import os
import re

import joblib
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS

# python-dotenv is optional — if it's installed, load GEMINI_API_KEY from a
# local .env file. If not installed, we just fall back to real env vars.
try:
    from dotenv import load_dotenv

    load_dotenv()
except ImportError:
    pass

app = Flask(__name__)
CORS(app)

model = joblib.load("blast_model.pkl")
scaler = joblib.load("blast_scaler.pkl")
feature_columns = joblib.load("blast_feature_columns.pkl")

GEMINI_MODEL = "gemini-3.5-flash-lite"
GEMINI_API_URL = (
    f"https://generativelanguage.googleapis.com/v1beta/models/{GEMINI_MODEL}:generateContent"
)


@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    missing = [col for col in feature_columns if col not in data]
    if missing:
        return jsonify({"error": f"Missing fields: {missing}"}), 400

    row = [data[col] for col in feature_columns]
    X = scaler.transform([row])
    pred = model.predict(X)[0]
    proba = model.predict_proba(X)[0][1]

    return jsonify({"risk": int(pred), "probability": round(float(proba), 3)})


def build_prompt(prediction_data):
    """Mirrors buildPrompt() from the original src/llmInterpreter.js."""
    import json

    return f"""You are assisting a farmer with a crop disease early-warning system.

Given the prediction data below, respond in simple, non-technical language.
Structure your response exactly like this, with these three headers:

Explanation:
(1-2 sentences on what this disease is and why current weather conditions favor it)

Why it's happening:
(1-2 sentences connecting the specific weather data below to the disease risk)

Recommended actions:
(3-4 short, concrete, practical steps the farmer can take now — phrase these as
"consider" or "commonly recommended" rather than absolute instructions, since
exact treatment can vary by local regulations, severity, and crop stage)

Keep the entire response under 150 words. Avoid jargon. Do not include any
text outside of the three sections above.

Prediction data:
{json.dumps(prediction_data, indent=2)}"""


def parse_llm_response(text):
    """
    Splits the model's "Explanation: / Why it's happening: / Recommended
    actions:" formatted text into structured fields the frontend can render
    directly, instead of shipping raw LLM text to the UI.
    """
    sections = {"explanation": "", "why": "", "actions": []}
    headers = {
        "Explanation:": "explanation",
        "Why it's happening:": "why",
        "Recommended actions:": "actions",
    }
    pattern = r"(" + "|".join(re.escape(h) for h in headers) + r")"
    parts = re.split(pattern, text)

    current = None
    for chunk in parts:
        stripped = chunk.strip()
        if stripped in headers:
            current = headers[stripped]
            continue
        if not current or not stripped:
            continue
        if current == "actions":
            lines = [
                line.strip(" -*\t")
                for line in stripped.split("\n")
                if line.strip(" -*\t")
            ]
            sections["actions"].extend(lines)
        else:
            sections[current] = (sections[current] + " " + stripped).strip()

    return sections


def call_gemini(prediction_data):
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "Missing GEMINI_API_KEY. Get a free key at "
            "https://aistudio.google.com/apikey and add it to model_folder/.env "
            "(server-side only)."
        )

    prompt = build_prompt(prediction_data)

    try:
        response = requests.post(
            GEMINI_API_URL,
            params={"key": api_key},
            json={
                "contents": [{"role": "user", "parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.3, "maxOutputTokens": 400},
            },
            timeout=20,
        )
    except requests.RequestException as exc:
        raise RuntimeError(f"Network error calling Gemini API: {exc}") from exc

    if not response.ok:
        if response.status_code == 429:
            raise RuntimeError(
                "Gemini API rate limit hit (429). Free tier allows ~10-15 "
                "requests/minute and ~1,500/day. Try again shortly."
            )
        raise RuntimeError(
            f"Gemini API returned {response.status_code}: {response.text}"
        )

    data = response.json()
    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    text = "\n".join(p.get("text", "") for p in parts).strip()

    if not text:
        raise RuntimeError("Gemini API returned an empty response.")

    return text


@app.route("/interpret", methods=["POST"])
def interpret():
    data = request.get_json(silent=True)
    if data is None:
        return jsonify({"error": "Invalid or missing JSON body"}), 400

    if not data.get("predicted_disease"):
        return jsonify({"error": "predicted_disease is required"}), 400

    try:
        raw_text = call_gemini(data)
    except RuntimeError as exc:
        return jsonify({"error": str(exc)}), 502

    parsed = parse_llm_response(raw_text)
    return jsonify(
        {
            "explanation": parsed["explanation"],
            "why": parsed["why"],
            "actions": parsed["actions"],
            "raw": raw_text,
        }
    )


if __name__ == "__main__":
    app.run(port=5000, debug=False)

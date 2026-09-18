import { useState, type FormEvent } from "react";
import { useApp } from "../context/AppContext";
import { UserIcon, LockIcon, AlertTriangleIcon } from "../components/Icons";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1200&q=60";
const LOGO_IMAGE = "/logo.jpg"; // place your logo file in public/logo.png

export default function Login() {
  const { login } = useApp();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [imgFailed, setImgFailed] = useState(false);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const ok = login(username, password);
    if (!ok) {
      setError("Incorrect username or password. Try demo / LuntiAni.");
      setPassword("");
    }
  }

  return (
    <div className="flex min-h-dvh flex-col bg-parchment md:flex-row">
      <div className="relative h-48 shrink-0 overflow-hidden md:h-auto md:w-1/2">
        {!imgFailed ? (
          <img
            src={HERO_IMAGE}
            alt="Rice field under an open sky"
            onError={() => setImgFailed(true)}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="h-full w-full bg-field" />
        )}
        <div className="absolute inset-0 bg-field/45" />
        <div className="absolute inset-0 flex items-center justify-center p-6 md:p-12">
          <div className="text-center text-white">
            <div className="flex items-center justify-center gap-2">
              <img
                src={LOGO_IMAGE}
                alt="LuntiAni logo"
                className="h-18 w-18 rounded-full object-cover bg-white/10 p-1 ring-1 ring-white/60"
              />
              <span
                className="text-4xl font-bold"
                style={{
                  fontFamily: '"Cardo", serif',
                  color: '#ffffff',
                }}
              >
                Lunti
                <span style={{ color: '#c79c2d' }}>A</span>
                ni
              </span>
            </div>
            <p className="mt-2 max-w-xs text-white/85 mx-auto">
              Grow Tomorrow, Today.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-1 items-center justify-center px-6 py-10">
        <form onSubmit={handleSubmit} className="w-full max-w-sm" noValidate>
          <h1 className="font-display text-2xl font-bold text-ink">Sign in</h1>
          <p className="mt-1 text-ink-soft">Log in to view the farm dashboard.</p>

          <label htmlFor="username" className="mt-8 block text-sm font-medium text-ink-soft">
            Username
          </label>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3.5">
            <UserIcon size={18} className="shrink-0 text-ink-soft" />
            <input
              id="username"
              autoFocus
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-transparent text-lg text-ink outline-none"
              placeholder="demo"
            />
          </div>

          <label htmlFor="password" className="mt-5 block text-sm font-medium text-ink-soft">
            Password
          </label>
          <div className="mt-1 flex items-center gap-2 rounded-xl border border-line bg-white px-4 py-3.5">
            <LockIcon size={18} className="shrink-0 text-ink-soft" />
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent text-lg text-ink outline-none"
              placeholder="LuntiAni"
            />
          </div>

          {error && (
            <p className="mt-4 flex items-center gap-2 text-sm font-medium text-high">
              <AlertTriangleIcon size={16} className="shrink-0" />
              {error}
            </p>
          )}

          <button
            type="submit"
            className="mt-8 w-full rounded-xl bg-field px-6 py-4 text-lg font-semibold text-white transition-transform active:scale-[0.98]"
          >
            Log in
          </button>

          <p className="mt-6 text-center text-sm text-ink-soft">
            Demo credentials — username <strong className="text-ink">demo</strong>, password{" "}
            <strong className="text-ink">LuntiAni</strong>
          </p>
        </form>
      </div>
    </div>
  );
}

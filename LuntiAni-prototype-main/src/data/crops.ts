import type { CropOption } from "./types";

export const CROPS: CropOption[] = [
  { id: "rice", name: "Rice" },
  { id: "corn", name: "Corn" },
  { id: "tomato", name: "Tomato" },
  { id: "other", name: "Other" },
];

export const DISEASES_BY_CROP: Record<string, string[]> = {
  rice: ["Rice Blast", "Bacterial Leaf Blight", "Brown Spot"],
  corn: ["Northern Corn Leaf Blight", "Common Rust", "Gray Leaf Spot"],
  tomato: ["Early Blight", "Late Blight", "Bacterial Spot"],
  other: ["General Fungal Disease", "Bacterial Infection", "Leaf Spot"],
};

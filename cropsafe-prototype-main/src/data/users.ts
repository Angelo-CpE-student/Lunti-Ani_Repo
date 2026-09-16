import type { User } from "./types";
import { DEMO_FARM } from "./farms";

// Fixed prototype credentials — not real authentication.
export const DEMO_USERNAME = "demo";
export const DEMO_PASSWORD = "cropsafe";

// Static mock farmer profile. Nothing here is persisted or fetched.
export const DEMO_USER: User = {
  contactNumber: "0917 123 4567",
  selectedCrop: "rice",
  farm: DEMO_FARM,
  plantedDate: "2026-06-10",
  growthStage: "Vegetative",
};

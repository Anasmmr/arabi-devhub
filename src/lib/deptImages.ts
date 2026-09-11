import ai from "@/assets/dept-ai.jpg";
import app from "@/assets/dept-app.jpg";
import security from "@/assets/dept-security.jpg";
import uiuxAsset from "@/assets/dept-uiux.jpg.asset.json";

export const deptImages: Record<string, string> = { ai, app, security, uiux: uiuxAsset.url };

export const deptImage = (slug: string) => deptImages[slug] ?? ai;

import ai from "@/assets/dept-ai.jpg";
import app from "@/assets/dept-app.jpg";
import security from "@/assets/dept-security.jpg";
import uiux from "@/assets/dept-uiux.jpg";

export const deptImages: Record<string, string> = { ai, app, security, uiux };

export const deptImage = (slug: string) => deptImages[slug] ?? ai;

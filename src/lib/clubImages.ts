import club1 from "@/assets/club-1.jpg.asset.json";
import club2 from "@/assets/club-2.jpg.asset.json";
import club3 from "@/assets/club-3.jpg.asset.json";
import club4 from "@/assets/club-4.jpg.asset.json";
import club5 from "@/assets/club-5.jpg.asset.json";

export const clubGallery = [
  { src: club2.url, alt: "متحدّث من النادي يشرح بناء واجهات React على المسرح" },
  { src: club4.url, alt: "متحدّث يفتتح لقاء النادي التقني بالميكروفون" },
  { src: club5.url, alt: "عرض تقني عن أدوات التطوير الحديثة في لقاء النادي" },
  { src: club3.url, alt: "تكريم أحد المشاركين وتسليم هدية النادي على المسرح" },
  { src: club1.url, alt: "أحد أعضاء النادي في جلسة حوارية مع الحضور" },
];

export const clubCover = clubGallery[0];

const categoryFallbacks = {
  education: "/images/needs-education.jpg",
  sante: "/images/hero-children.jpg",
  santé: "/images/hero-children.jpg",
  nutrition: "/images/about-children.jpg",
  hebergement: "/images/about-children.jpg",
  hébergement: "/images/about-children.jpg",
  protection: "/images/about-children.jpg",
  infrastructure: "/images/needs-education.jpg",
};

export function resolveNeedImage(need) {
  if (need?.imageUrl) return need.imageUrl;
  const key = String(need?.category || "").trim().toLowerCase();
  return categoryFallbacks[key] || "/images/hero-children.jpg";
}

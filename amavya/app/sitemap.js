export default function sitemap() {
  const base = "https://amavya.cloud";
  return [
    {
      url: base,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}

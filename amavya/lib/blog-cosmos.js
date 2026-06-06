/**
 * Helpers client-safe pour le Cosmos blog.
 * Importable depuis des composants "use client" (aucune dépendance Node).
 */
export function placeInCosmos(articles) {
  return articles.map((a, i) => {
    const golden = Math.PI * (3 - Math.sqrt(5));
    const radius = 5 + i * 1.6;
    const angle = i * golden;
    return {
      ...a,
      position: [
        Math.cos(angle) * radius,
        ((i % 5) - 2) * 1.4,
        Math.sin(angle) * radius - i * 0.8,
      ],
    };
  });
}

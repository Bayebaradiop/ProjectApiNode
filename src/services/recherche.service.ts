/**
 * Construit un filtre de recherche générique pour Prisma
 * @param q - mot-clé de recherche
 * @param fields - liste des champs dans lesquels chercher
 */
export function buildSearchFilter(q?: string, fields: string[] = []) {
  if (!q || fields.length === 0) return {};

  return {
    OR: fields.map((field) => ({
      [field]: { contains: q }, // Retirer mode: "insensitive"
    })),
  };
}

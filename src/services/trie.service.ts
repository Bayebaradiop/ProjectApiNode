// src/services/trie.service.ts
export class TrieService {
  /**
   * Valide l'ordre de tri.
   * @param ordre - valeur envoyée par l'utilisateur ('asc' ou 'desc')
   * @returns 'asc' ou 'desc' (par défaut 'asc')
   */
  validerOrdre(ordre?: string): 'asc' | 'desc' {
    return ordre?.toLowerCase() === 'desc' ? 'desc' : 'asc';
  }

  /**
   * Valide le champ de tri parmi les champs autorisés.
   * @param champsAutorises - liste des champs que l'on peut trier
   * @param champDemandé - champ demandé par l'utilisateur
   * @returns le champ valide à utiliser pour le tri
   */
  validerChampTri(champsAutorises: string[], champDemande?: string): string {
    return champsAutorises.includes(champDemande || '') ? champDemande! : champsAutorises[0];
  }

  /**
   * Transforme un paramètre de tri multi-colonnes en format Prisma.
   * Exemple : "nom:asc,createdAt:desc"
   * @param champsAutorises - champs autorisés pour le tri
   * @param parametreTri - paramètre envoyé par l'utilisateur
   * @returns tableau d'objets pour Prisma { champ: 'asc' | 'desc' }
   */
  triMultiColonnes(champsAutorises: string[], parametreTri?: string): Record<string, 'asc' | 'desc'>[] {
    if (!parametreTri) return [{ [champsAutorises[0]]: 'asc' }];

    return parametreTri.split(',').map(item => {
      const [champ, direction] = item.split(':');
      if (champsAutorises.includes(champ)) {
        return { [champ]: this.validerOrdre(direction) };
      }
      return { [champsAutorises[0]]: 'asc' }; // valeur par défaut si invalide
    });
  }
}

// Instance réutilisable dans tous les services
export const trieService = new TrieService();

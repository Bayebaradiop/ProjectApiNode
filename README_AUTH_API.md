# Test API Authentification - Postman

## 🔐 Endpoints Authentification

### 1. POST /auth/login - Connexion utilisateur

**Description :** Authentifie un utilisateur avec son email et mot de passe, retourne un token d'accès et un token de rafraîchissement.

**Requête :**
```http
POST {{BASE_URL}}/auth/login
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Connexion réussie",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY0MjU4MzYwMCwiZXhwIjoxNjQyNTg3MjAwfQ.signature",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY0MjU4MzYwMCwiZXhwIjoxNjQzMTg4MzYwMH0.signature"
  }
}
```

**Réponse d'erreur (401) - Identifiants incorrects :**
```json
{
  "statut": "error",
  "message": "Email ou mot de passe incorrect",
  "data": null
}
```

### 2. POST /auth/refresh - Rafraîchir le token d'accès

**Description :** Utilise un token de rafraîchissement valide pour obtenir un nouveau token d'accès.

**Requête :**
```http
POST {{BASE_URL}}/auth/refresh
Content-Type: application/json
```

**Corps de la requête :**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY0MjU4MzYwMCwiZXhwIjoxNjQzMTg4MzYwMH0.signature"
}
```

**Réponse de succès (200) :**
```json
{
  "statut": "success",
  "message": "Token d'accès renouvelé",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImVtYWlsIjoidXNlckBleGFtcGxlLmNvbSIsImlhdCI6MTY0MjU4NzIwMCwiZXhwIjoxNjQyNTkwODAwfQ.new_signature"
  }
}
```

**Réponse d'erreur (401) - Token invalide ou expiré :**
```json
{
  "statut": "error",
  "message": "Refresh token invalide ou expiré",
  "data": null
}
```

## 🧪 Tests à effectuer

### Test de validation des données

1. **Email manquant :**
   ```json
   {
     "password": "password123"
   }
   ```
   **Réponse attendue :** Erreur 400 avec détails des champs manquants

2. **Mot de passe manquant :**
   ```json
   {
     "email": "user@example.com"
   }
   ```
   **Réponse attendue :** Erreur 400 avec détails des champs manquants

3. **Email invalide :**
   ```json
   {
     "email": "invalid-email",
     "password": "password123"
   }
   ```
   **Réponse attendue :** Erreur 400 avec détails des champs invalides

4. **Refresh token manquant :**
   ```json
   {}
   ```
   **Réponse attendue :** Erreur 400 avec détails des champs manquants

### Test d'authentification

1. **Connexion avec des identifiants corrects :**
   - Utiliser un email et mot de passe existant en base
   - Vérifier que les tokens sont retournés
   - Vérifier que l'accessToken expire dans 1 heure
   - Vérifier que le refreshToken expire dans 24 heures

2. **Connexion avec email incorrect :**
   ```json
   {
     "email": "wrong@example.com",
     "password": "password123"
   }
   ```
   **Réponse attendue :** Erreur 401

3. **Connexion avec mot de passe incorrect :**
   ```json
   {
     "email": "user@example.com",
     "password": "wrongpassword"
   }
   ```
   **Réponse attendue :** Erreur 401

### Test du refresh token

1. **Refresh token valide :**
   - Utiliser un refreshToken obtenu lors du login
   - Vérifier qu'un nouveau accessToken est retourné
   - Vérifier que l'ancien accessToken devient invalide

2. **Refresh token expiré :**
   - Attendre 24 heures ou modifier manuellement la date d'expiration
   - Tenter de rafraîchir avec ce token
   **Réponse attendue :** Erreur 401

3. **Refresh token invalide :**
   ```json
   {
     "refreshToken": "invalid.token.here"
   }
   ```
   **Réponse attendue :** Erreur 401

## 🔑 Utilisation des tokens

### Token d'accès (Access Token)
- **Durée de vie :** 1 heure
- **Utilisation :** Dans le header `Authorization: Bearer <accessToken>`
- **Contenu :** userId et email de l'utilisateur

### Token de rafraîchissement (Refresh Token)
- **Durée de vie :** 24 heures
- **Utilisation :** Pour obtenir un nouveau token d'accès sans se reconnecter
- **Stockage :** En base de données avec association à l'utilisateur
- **Sécurité :** Ne jamais exposer côté client, utiliser uniquement pour les appels serveur

## 📝 Notes importantes

- Les mots de passe sont hashés en base de données avec bcrypt
- Les tokens JWT utilisent des clés secrètes distinctes pour l'accès et le rafraîchissement
- Les refresh tokens expirés sont automatiquement supprimés de la base
- Un utilisateur ne peut avoir qu'un refresh token actif à la fois (le nouveau remplace l'ancien)
- Tous les endpoints nécessitant une authentification doivent vérifier le token d'accès dans le header Authorization

## 🔧 Configuration

Les clés secrètes JWT sont configurées dans le fichier `.env` :
```
JWT_ACCESS_SECRET=votre-cle-secrete-access
JWT_REFRESH_SECRET=votre-cle-secrete-refresh
```

**⚠️ Important :** Changez ces valeurs en production avec des clés secrètes fortes et uniques.
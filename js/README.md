# Configuration centralisée des URLs API

Ce dossier contient la configuration centralisée des URLs API pour le site web LAFAOM.

## 📁 Structure des fichiers

### `config.js` - Configuration principale
- **CONFIG** : Configuration de base avec toutes les URLs et paramètres
- **API_URLS** : Fonctions pour construire les URLs avec paramètres
- **apiUrl** : Instance du builder d'URLs
- **apiRequest** : Fonction utilitaire pour les requêtes HTTP
- **authenticatedRequest** : Fonction pour les requêtes authentifiées

### Fichiers modifiés
- `training.js` - Utilise les URLs centralisées pour les formations
- `auth.js` - Utilise les URLs centralisées pour l'authentification
- `actualite.js` - Utilise les URLs centralisées pour les actualités
- `news.js` - Utilise les URLs centralisées pour les actualités
- `dashboard.js` - Utilise les URLs centralisées pour le dashboard
- `mes-candidatures.js` - Utilise les URLs centralisées pour les candidatures
- `recruitment.js` - Utilise les URLs centralisées pour le recrutement

## 🚀 Utilisation

### 1. Inclusion dans les pages HTML
Tous les fichiers HTML ont été mis à jour pour inclure `config.js` en premier :

```html
<script src="js/config.js"></script>
<script src="js/base.js"></script>
<script src="js/[nom-du-fichier].js"></script>
```

### 2. Utilisation des URLs centralisées

#### Avant (ancien code) :
```javascript
const response = await fetch('https://lafaom.vertex-cam.com/api/v1/trainings?page=1&page_size=20');
```

#### Après (nouveau code) :
```javascript
const response = await fetch(API_URLS.TRAININGS({ page: 1, page_size: 20 }));
```

### 3. Exemples d'utilisation

#### Formations
```javascript
// Charger toutes les formations
const trainingsUrl = API_URLS.TRAININGS();

// Charger avec pagination
const trainingsUrl = API_URLS.TRAININGS({ page: 1, page_size: 20 });

// Charger une formation spécifique
const trainingUrl = API_URLS.TRAINING_BY_ID('123');
```

#### Actualités
```javascript
// Charger les actualités publiées
const newsUrl = API_URLS.BLOG_POSTS({ is_published: true });

// Charger avec pagination
const newsUrl = API_URLS.BLOG_POSTS({ 
    page: 1, 
    page_size: 6, 
    is_published: true 
});
```

#### Emplois
```javascript
// Charger toutes les offres d'emploi
const jobsUrl = API_URLS.JOB_OFFERS();

// Charger une offre spécifique
const jobUrl = API_URLS.JOB_OFFER_BY_ID('456');
```

#### Candidatures
```javascript
// Charger les candidatures de l'utilisateur
const applicationsUrl = API_URLS.MY_STUDENT_APPLICATIONS({ is_paid: true });

// Charger une candidature spécifique
const applicationUrl = API_URLS.STUDENT_APPLICATION_BY_ID('789');
```

### 4. Requêtes authentifiées

```javascript
// Utiliser la fonction utilitaire pour les requêtes authentifiées
const data = await authenticatedRequest(API_URLS.MY_STUDENT_APPLICATIONS());
```

### 5. Gestion des erreurs

```javascript
try {
    const response = await apiRequest(API_URLS.TRAININGS());
    console.log('Données chargées:', response.data);
} catch (error) {
    console.error('Erreur API:', error);
}
```

## 🔧 Configuration

### URLs de base
```javascript
const CONFIG = {
    API_BASE_URL: 'https://lafaom.vertex-cam.com/api/v1',
    // ... autres configurations
};
```

### Endpoints disponibles
- **AUTH** : Authentification (`/auth/token`, `/auth/me`)
- **TRAINING** : Formations (`/trainings`, `/training-sessions`, `/student-applications`)
- **BLOG** : Actualités (`/blog/posts`)
- **JOB** : Emplois (`/job-offers`, `/job-applications`, `/job-attachments`)
- **PAYMENT** : Paiements (`/payments`)

## 📝 Avantages

1. **Centralisation** : Toutes les URLs sont définies en un seul endroit
2. **Maintenance** : Facile de changer l'URL de base ou les endpoints
3. **Réutilisabilité** : Les URLs sont réutilisables dans tous les fichiers
4. **Consistance** : Même format d'URL partout dans l'application
5. **Paramètres** : Gestion automatique des paramètres de requête
6. **Authentification** : Fonctions utilitaires pour les requêtes authentifiées

## 🐛 Résolution des problèmes

### Erreur "CONFIG is not defined"
- Vérifiez que `config.js` est inclus avant les autres scripts
- Vérifiez que le fichier `config.js` existe et est accessible

### Erreur "API_URLS is not defined"
- Vérifiez que `config.js` est chargé correctement
- Vérifiez que les fonctions sont bien exportées

### URLs incorrectes
- Vérifiez la configuration dans `config.js`
- Vérifiez que les paramètres sont passés correctement

## 🔄 Migration

Pour migrer un ancien code vers les nouvelles URLs :

1. Remplacez les URLs codées en dur par les fonctions `API_URLS`
2. Utilisez les paramètres d'objet au lieu des query strings manuelles
3. Utilisez les fonctions utilitaires pour les requêtes authentifiées
4. Testez que tout fonctionne correctement

## 📚 Exemples complets

Voir le fichier `example-usage.js` pour des exemples complets d'utilisation.

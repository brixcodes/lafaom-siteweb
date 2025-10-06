/**
 * Configuration centralisée pour l'API LAFAOM
 * Ce fichier contient toutes les URLs de base et les configurations réutilisables
 */

// Configuration de base
const CONFIG = {
    // URL de base de l'API
    API_BASE_URL: 'https://lafaom.vertex-cam.com/api/v1',
    
    // URLs spécifiques par module
    ENDPOINTS: {
        // Authentification
        AUTH: {
            TOKEN: '/auth/token',
            ME: '/auth/me',
            REFRESH: '/auth/refresh'
        },
        
        // Formations
        TRAINING: {
            BASE: '/trainings',
            SESSIONS: '/training-sessions',
            APPLICATIONS: '/student-applications',
            MY_APPLICATIONS: '/my-student-applications'
        },
        
        // Blog/Actualités
        BLOG: {
            BASE: '/blog',
            POSTS: '/blog/posts'
        },
        
        // Emplois
        JOB: {
            OFFERS: '/job-offers',
            APPLICATIONS: '/job-applications',
            ATTACHMENTS: '/job-attachments'
        },
        
        // Paiements
        PAYMENT: {
            BASE: '/payments',
            CINETPAY: '/payments/cinetpay'
        }
    },
    
    // Configuration des requêtes
    REQUEST_CONFIG: {
        DEFAULT_HEADERS: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        TIMEOUT: 30000, // 30 secondes
        RETRY_ATTEMPTS: 3
    },
    
    // Configuration de pagination
    PAGINATION: {
        DEFAULT_PAGE_SIZE: 20,
        MAX_PAGE_SIZE: 100
    }
};

/**
 * Classe utilitaire pour construire les URLs
 */
class APIUrlBuilder {
    constructor(baseUrl = CONFIG.API_BASE_URL) {
        this.baseUrl = baseUrl;
    }
    
    /**
     * Construit une URL complète
     * @param {string} endpoint - L'endpoint à ajouter
     * @param {Object} params - Paramètres de requête (optionnel)
     * @returns {string} URL complète
     */
    build(endpoint, params = null) {
        let url = `${this.baseUrl}${endpoint}`;
        
        if (params) {
            const queryString = new URLSearchParams(params).toString();
            url += `?${queryString}`;
        }
        
        return url;
    }
    
    /**
     * Construit une URL avec des paramètres de pagination
     * @param {string} endpoint - L'endpoint de base
     * @param {Object} options - Options de pagination et filtres
     * @returns {string} URL avec pagination
     */
    buildWithPagination(endpoint, options = {}) {
        const {
            page = 1,
            page_size = CONFIG.PAGINATION.DEFAULT_PAGE_SIZE,
            order_by = 'created_at',
            asc = 'asc',
            ...otherParams
        } = options;
        
        const params = {
            page,
            page_size,
            order_by,
            asc,
            ...otherParams
        };
        
        return this.build(endpoint, params);
    }
}

/**
 * Instance globale du builder d'URLs
 */
const apiUrl = new APIUrlBuilder();

/**
 * URLs pré-construites pour les cas d'usage courants
 */
const API_URLS = {
    // Authentification
    AUTH_TOKEN: () => apiUrl.build(CONFIG.ENDPOINTS.AUTH.TOKEN),
    AUTH_ME: () => apiUrl.build(CONFIG.ENDPOINTS.AUTH.ME),
    
    // Formations
    TRAININGS: (params) => apiUrl.buildWithPagination(CONFIG.ENDPOINTS.TRAINING.BASE, params),
    TRAINING_SESSIONS: (params) => apiUrl.buildWithPagination(CONFIG.ENDPOINTS.TRAINING.SESSIONS, params),
    STUDENT_APPLICATIONS: (params) => apiUrl.buildWithPagination(CONFIG.ENDPOINTS.TRAINING.APPLICATIONS, params),
    MY_STUDENT_APPLICATIONS: (params) => apiUrl.buildWithPagination(CONFIG.ENDPOINTS.TRAINING.MY_APPLICATIONS, params),
    
    // Blog/Actualités
    BLOG_POSTS: (params) => apiUrl.buildWithPagination(CONFIG.ENDPOINTS.BLOG.POSTS, params),
    
    // Emplois
    JOB_OFFERS: (params) => apiUrl.buildWithPagination(CONFIG.ENDPOINTS.JOB.OFFERS, params),
    JOB_APPLICATIONS: (params) => apiUrl.buildWithPagination(CONFIG.ENDPOINTS.JOB.APPLICATIONS, params),
    JOB_ATTACHMENTS: () => apiUrl.build(CONFIG.ENDPOINTS.JOB.ATTACHMENTS),
    
    // URLs spécifiques avec ID
    TRAINING_BY_ID: (id) => apiUrl.build(`${CONFIG.ENDPOINTS.TRAINING.BASE}/${id}`),
    TRAINING_SESSION_BY_ID: (id) => apiUrl.build(`${CONFIG.ENDPOINTS.TRAINING.SESSIONS}/${id}`),
    STUDENT_APPLICATION_BY_ID: (id) => apiUrl.build(`${CONFIG.ENDPOINTS.TRAINING.MY_APPLICATIONS}/${id}`),
    JOB_OFFER_BY_ID: (id) => apiUrl.build(`${CONFIG.ENDPOINTS.JOB.OFFERS}/${id}`),
    BLOG_POST_BY_ID: (id) => apiUrl.build(`${CONFIG.ENDPOINTS.BLOG.POSTS}/${id}`)
};

/**
 * Fonction utilitaire pour faire des requêtes HTTP
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête
 * @returns {Promise} Promise de la réponse
 */
async function apiRequest(url, options = {}) {
    const defaultOptions = {
        headers: CONFIG.REQUEST_CONFIG.DEFAULT_HEADERS,
        timeout: CONFIG.REQUEST_CONFIG.TIMEOUT
    };
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(url, mergedOptions);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        console.error('API Request failed:', error);
        throw error;
    }
}

/**
 * Fonction pour obtenir le token d'authentification depuis le localStorage
 * @returns {string|null} Token d'authentification ou null
 */
function getAuthToken() {
    return localStorage.getItem('authToken');
}

/**
 * Fonction pour ajouter le token d'authentification aux headers
 * @param {Object} headers - Headers existants
 * @returns {Object} Headers avec le token d'authentification
 */
function addAuthHeaders(headers = {}) {
    const token = getAuthToken();
    if (token) {
        return {
            ...headers,
            'Authorization': `Bearer ${token}`
        };
    }
    return headers;
}

/**
 * Fonction pour faire une requête authentifiée
 * @param {string} url - URL de la requête
 * @param {Object} options - Options de la requête
 * @returns {Promise} Promise de la réponse
 */
async function authenticatedRequest(url, options = {}) {
    const authHeaders = addAuthHeaders(options.headers);
    
    return apiRequest(url, {
        ...options,
        headers: authHeaders
    });
}

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        API_URLS,
        apiUrl,
        apiRequest,
        authenticatedRequest,
        getAuthToken,
        addAuthHeaders
    };
}

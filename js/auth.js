// Authentication system
class AuthManager {
    constructor() {
        this.sessionKey = 'lafaom_session';
        this.tokenKey = 'lafaom_token';
        this.userKey = 'lafaom_user';
    }

    // Check if user is authenticated
    isAuthenticated() {
        const token = localStorage.getItem(this.tokenKey);
        const user = localStorage.getItem(this.userKey);
        return !!(token && user);
    }

    // Get current user data
    getCurrentUser() {
        const userData = localStorage.getItem(this.userKey);
        return userData ? JSON.parse(userData) : null;
    }

    // Get access token
    getAccessToken() {
        return localStorage.getItem(this.tokenKey);
    }

    // Login function
    async login(email, password) {
        try {
            console.log('🔐 Tentative de connexion pour:', email);
            
            const response = await fetch('https://lafaom.vertex-cam.com/api/v1/auth/token', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            console.log('📡 Réponse API:', response.status);

            if (response.ok) {
                const data = await response.json();
                console.log('✅ Connexion réussie:', data);

                // Store session data
                this.storeSession(data);
                
                // Redirect to dashboard
                window.location.href = 'dashboard.html';
                
                return { success: true, data: data };
            } else {
                const errorData = await response.json();
                console.error('❌ Erreur de connexion:', errorData);
                return { success: false, error: errorData };
            }
        } catch (error) {
            console.error('❌ Erreur réseau:', error);
            return { success: false, error: error.message };
        }
    }

    // Store session data
    storeSession(data) {
        // Store access token
        if (data.access_token && data.access_token.token) {
            localStorage.setItem(this.tokenKey, data.access_token.token);
        }

        // Store user data
        if (data.user) {
            localStorage.setItem(this.userKey, JSON.stringify(data.user));
        }

        // Store complete session
        localStorage.setItem(this.sessionKey, JSON.stringify(data));

        console.log('💾 Session sauvegardée');
    }

    // Logout function
    logout() {
        console.log('🚪 Déconnexion en cours...');
        
        // Clear all session data
        localStorage.removeItem(this.sessionKey);
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.userKey);
        
        console.log('🗑️ Session supprimée');
        
        // Redirect to login
        window.location.href = 'login.html';
    }

    // Check authentication and redirect if needed
    requireAuth() {
        if (!this.isAuthenticated()) {
            console.log('🔒 Accès non autorisé, redirection vers login');
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }

    // Get user initials for avatar
    getUserInitials() {
        const user = this.getCurrentUser();
        if (user && user.first_name && user.last_name) {
            return (user.first_name.charAt(0) + user.last_name.charAt(0)).toUpperCase();
        }
        return 'U';
    }

    // Get user full name
    getUserFullName() {
        const user = this.getCurrentUser();
        if (user && user.first_name && user.last_name) {
            return `${user.first_name} ${user.last_name}`;
        }
        return 'Utilisateur';
    }

    // Get user email
    getUserEmail() {
        const user = this.getCurrentUser();
        return user ? user.email : '';
    }
}

// Global auth manager instance
const authManager = new AuthManager();

// Login form handler
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginButton = document.getElementById('loginButton');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');
    const errorMessage = document.getElementById('errorMessage');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Clear previous error messages
            hideMessage();
            
            const email = emailInput.value.trim();
            const password = passwordInput.value;

            if (!email || !password) {
                showError('Veuillez remplir tous les champs');
                return;
            }

            // Show loading state
            loginButton.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> ';
            loginButton.disabled = true;

            try {
                const result = await authManager.login(email, password);
                
                if (result.success) {
                    console.log('✅ Connexion réussie');
                    showSuccess('Connexion réussie ! Redirection en cours...');
                } else {
                    // Handle different types of errors
                    let errorMsg = 'Erreur de connexion';
                    
                    if (result.error) {
                        if (result.error.message) {
                            errorMsg = result.error.message;
                        } else if (result.error.error_code) {
                            switch (result.error.error_code) {
                                case 'invalid_credentials':
                                    errorMsg = 'Email ou mot de passe incorrect';
                                    break;
                                case 'user_not_found':
                                    errorMsg = 'Aucun compte trouvé avec cet email';
                                    break;
                                case 'account_disabled':
                                    errorMsg = 'Votre compte a été désactivé';
                                    break;
                                default:
                                    errorMsg = result.error.message || 'Identifiants incorrects';
                            }
                        }
                    }
                    
                    showError(errorMsg);
                }
            } catch (error) {
                console.error('Erreur:', error);
                showError('Erreur de connexion: ' + error.message);
            } finally {
                // Reset button
                loginButton.innerHTML = 'Login';
                loginButton.disabled = false;
            }
        });
    }

    // Function to show error message
    function showError(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.className = 'error-message';
            errorMessage.style.display = 'block';
        }
    }

    // Function to show success message
    function showSuccess(message) {
        if (errorMessage) {
            errorMessage.textContent = message;
            errorMessage.className = 'success-message';
            errorMessage.style.display = 'block';
        }
    }

    // Function to hide message
    function hideMessage() {
        if (errorMessage) {
            errorMessage.style.display = 'none';
        }
    }

    // Clear error when user starts typing
    if (emailInput) {
        emailInput.addEventListener('input', hideMessage);
    }
    if (passwordInput) {
        passwordInput.addEventListener('input', hideMessage);
    }
});

// Export for use in other files
window.authManager = authManager;

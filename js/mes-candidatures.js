// Mes Candidatures JavaScript
let candidaturesTable;

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing candidatures page...');
    
    // Check authentication first
    if (!authManager.requireAuth()) {
        return;
    }
    
    initializeCandidatures();
    loadUserData();
    loadCandidatures();
    setupEventListeners();
});

// Initialize candidatures page
function initializeCandidatures() {
    console.log('Candidatures page initialized');
}

// Load user data from session
function loadUserData() {
    try {
        console.log('Loading user data from session...');
        
        // Get user data from session
        const userData = authManager.getCurrentUser();
        
        if (userData) {
            console.log('User data loaded from session:', userData);
            updateUserInfo(userData);
        } else {
            console.error('No user data found in session');
            // Redirect to login if no user data
            authManager.logout();
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        authManager.logout();
    }
}

// Load mock user data
function loadMockUserData() {
    const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com'
    };
    
    updateUserInfo(userData);
}

// Update user information in header
function updateUserInfo(user) {
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userInitialsElement = document.getElementById('userInitials');
    const userInitialsSmallElement = document.getElementById('userInitialsSmall');
    
    // Use session data
    const fullName = authManager.getUserFullName();
    const email = authManager.getUserEmail();
    const initials = authManager.getUserInitials();
    
    if (userNameElement) {
        userNameElement.textContent = fullName;
    }
    
    if (userEmailElement) {
        userEmailElement.textContent = email;
    }
    
    if (userInitialsElement) {
        userInitialsElement.textContent = initials;
    }
    
    if (userInitialsSmallElement) {
        userInitialsSmallElement.textContent = initials;
    }
}

// Generate initials from name
function generateInitials(name) {
    if (!name) return 'U';
    
    const words = name.trim().split(' ');
    if (words.length === 1) {
        return words[0].charAt(0).toUpperCase();
    }
    
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
}

// Load candidatures from API
async function loadCandidatures() {
    console.log('Loading candidatures...');
    try {
        // Get token from session using authManager
        const token = authManager.getAccessToken();
        if (!token) {
            console.error('No token found in session');
            authManager.logout();
            return;
        }
        
        // API endpoint with parameters
        const apiUrl = 'https://lafaom.vertex-cam.com/api/v1/my-student-applications?page=1&page_size=20&is_paid=true&order_by=created_at&asc=asc';
        
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        });
        
        console.log('API Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('API data received:', data);
            displayCandidatures(data);
        } else {
            console.error('API error:', response.status, response.statusText);
            // Try to get error message
            try {
                const errorData = await response.json();
                console.error('API error details:', errorData);
            } catch (e) {
                console.error('Could not parse error response');
            }
            // Fallback to mock data
            loadMockCandidatures();
        }
    } catch (error) {
        console.warn('Candidatures API not available, using mock data:', error);
        loadMockCandidatures();
    }
}

// Load mock candidatures data
function loadMockCandidatures() {
    console.log('Loading mock candidatures data...');
    const mockData = {
        data: [
            {
                id: 1,
                user_id: "user123",
                training_id: "training456",
                target_session_id: "session789",
                application_number: "APP-2024-001",
                status: "PENDING",
                payment_id: "PAY-001",
                refusal_reason: null,
                registration_fee: 50,
                training_fee: 1200,
                currency: "EUR",
                training_title: "Développement Web Fullstack",
                training_session_start_date: "2024-02-15",
                training_session_end_date: "2024-04-15",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-01-15T10:30:00.000Z",
                updated_at: "2024-01-15T10:30:00.000Z"
            },
            {
                id: 2,
                user_id: "user123",
                training_id: "training789",
                target_session_id: "session456",
                application_number: "APP-2024-002",
                status: "ACCEPTED",
                payment_id: "PAY-002",
                refusal_reason: null,
                registration_fee: 75,
                training_fee: 1500,
                currency: "EUR",
                training_title: "Formation en Marketing Digital",
                training_session_start_date: "2024-03-01",
                training_session_end_date: "2024-05-01",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-01-10T14:20:00.000Z",
                updated_at: "2024-01-20T09:15:00.000Z"
            },
            {
                id: 3,
                user_id: "user123",
                training_id: "training321",
                target_session_id: "session654",
                application_number: "APP-2024-003",
                status: "REJECTED",
                payment_id: "PAY-003",
                refusal_reason: "Profil ne correspond pas aux critères",
                registration_fee: 60,
                training_fee: 1000,
                currency: "EUR",
                training_title: "Formation en Gestion de Projet",
                training_session_start_date: "2024-01-20",
                training_session_end_date: "2024-03-20",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-01-05T16:45:00.000Z",
                updated_at: "2024-01-12T11:30:00.000Z"
            },
            {
                id: 4,
                user_id: "user123",
                training_id: "training555",
                target_session_id: "session777",
                application_number: "APP-2024-004",
                status: "ACCEPTED",
                payment_id: "PAY-004",
                refusal_reason: null,
                registration_fee: 100,
                training_fee: 2000,
                currency: "EUR",
                training_title: "Formation en Intelligence Artificielle",
                training_session_start_date: "2024-04-01",
                training_session_end_date: "2024-06-01",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-01-20T08:15:00.000Z",
                updated_at: "2024-01-25T14:30:00.000Z"
            },
            {
                id: 5,
                user_id: "user123",
                training_id: "training888",
                target_session_id: "session999",
                application_number: "APP-2024-005",
                status: "PENDING",
                payment_id: "PAY-005",
                refusal_reason: null,
                registration_fee: 80,
                training_fee: 1800,
                currency: "EUR",
                training_title: "Formation en Cybersécurité",
                training_session_start_date: "2024-05-15",
                training_session_end_date: "2024-07-15",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-01-25T11:45:00.000Z",
                updated_at: "2024-01-25T11:45:00.000Z"
            },
            {
                id: 6,
                user_id: "user123",
                training_id: "training111",
                target_session_id: "session222",
                application_number: "APP-2024-006",
                status: "CANCELLED",
                payment_id: "PAY-006",
                refusal_reason: "Annulé par l'utilisateur",
                registration_fee: 40,
                training_fee: 800,
                currency: "EUR",
                training_title: "Formation en Design UX/UI",
                training_session_start_date: "2024-02-01",
                training_session_end_date: "2024-04-01",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-01-08T16:20:00.000Z",
                updated_at: "2024-01-18T10:15:00.000Z"
            },
            {
                id: 7,
                user_id: "user123",
                training_id: "training333",
                target_session_id: "session444",
                application_number: "APP-2024-007",
                status: "ACCEPTED",
                payment_id: "PAY-007",
                refusal_reason: null,
                registration_fee: 90,
                training_fee: 1600,
                currency: "EUR",
                training_title: "Formation en Data Science",
                training_session_start_date: "2024-06-01",
                training_session_end_date: "2024-08-01",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-01-30T09:30:00.000Z",
                updated_at: "2024-02-05T13:20:00.000Z"
            },
            {
                id: 8,
                user_id: "user123",
                training_id: "training666",
                target_session_id: "session777",
                application_number: "APP-2024-008",
                status: "PENDING",
                payment_id: "PAY-008",
                refusal_reason: null,
                registration_fee: 70,
                training_fee: 1400,
                currency: "EUR",
                training_title: "Formation en DevOps",
                training_session_start_date: "2024-07-01",
                training_session_end_date: "2024-09-01",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-02-01T14:15:00.000Z",
                updated_at: "2024-02-01T14:15:00.000Z"
            },
            {
                id: 9,
                user_id: "user123",
                training_id: "training999",
                target_session_id: "session111",
                application_number: "APP-2024-009",
                status: "REJECTED",
                payment_id: "PAY-009",
                refusal_reason: "Expérience insuffisante dans le domaine",
                registration_fee: 120,
                training_fee: 2500,
                currency: "EUR",
                training_title: "Formation en Architecture Cloud",
                training_session_start_date: "2024-08-01",
                training_session_end_date: "2024-10-01",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-02-05T10:45:00.000Z",
                updated_at: "2024-02-10T16:30:00.000Z"
            },
            {
                id: 10,
                user_id: "user123",
                training_id: "training000",
                target_session_id: "session333",
                application_number: "APP-2024-010",
                status: "ACCEPTED",
                payment_id: "PAY-010",
                refusal_reason: null,
                registration_fee: 85,
                training_fee: 1700,
                currency: "EUR",
                training_title: "Formation en Blockchain",
                training_session_start_date: "2024-09-01",
                training_session_end_date: "2024-11-01",
                user_email: "john.doe@example.com",
                user_first_name: "John",
                user_last_name: "Doe",
                created_at: "2024-02-10T12:00:00.000Z",
                updated_at: "2024-02-15T09:45:00.000Z"
            }
        ],
        page: 1,
        number: 10,
        total_number: 10
    };
    
    console.log('Mock data created:', mockData);
    displayCandidatures(mockData);
}

// Display candidatures in table with DataTables
function displayCandidatures(data) {
    console.log('Displaying candidatures:', data);
    
    // Check if jQuery is loaded
    if (typeof $ === 'undefined') {
        console.error('jQuery is not loaded');
        return;
    }
    
    console.log('jQuery is loaded, proceeding with DataTables...');
    
    // Destroy existing table if it exists
    if (candidaturesTable) {
        console.log('Destroying existing table...');
        candidaturesTable.destroy();
    }
    
    const table = $('#candidaturesTable');
    const tbody = table.find('tbody');
    
    console.log('Table found:', table.length);
    console.log('Tbody found:', tbody.length);
    
    // Handle API response structure
    let candidatures = [];
    if (data.success && data.data) {
        candidatures = data.data;
    } else if (data.data) {
        candidatures = data.data;
    } else if (Array.isArray(data)) {
        candidatures = data;
    }
    
    console.log('Candidatures to display:', candidatures);
    
    if (!candidatures || candidatures.length === 0) {
        tbody.html(`
            <tr>
                <td colspan="8" class="has-text-centered">
                    <div class="no-data-content">
                        <i class="fas fa-file-alt is-size-1 has-text-grey-light"></i>
                        <p class="is-size-5 has-text-grey">Aucune candidature trouvée</p>
                        <a href="recrutement.html" class="button is-primary">Postuler maintenant</a>
                    </div>
                </td>
            </tr>
        `);
    } else {
        tbody.html(candidatures.map(candidature => `
            <tr>
                <td>${candidature.application_number}</td>
                <td>${candidature.training_title}</td>
                <td>
                    <span class="tag ${getStatusClass(candidature.status)}">
                        ${getStatusText(candidature.status)}
                    </span>
                </td>
                <td>${formatDate(candidature.training_session_start_date)}</td>
                <td>${formatDate(candidature.training_session_end_date)}</td>
                <td>${candidature.registration_fee} ${candidature.currency}</td>
                <td>${formatDate(candidature.created_at)}</td>
                <td>
                    <div class="buttons has-addons">
                        <button class="button is-small is-primary" onclick="viewCandidature(${candidature.id})" title="Voir les détails">
                            <span class="icon">
                                <i class="fas fa-eye"></i>
                            </span>
                        </button>
                        ${candidature.status === 'PENDING' ? `
                            <button class="button is-small is-warning" onclick="editCandidature(${candidature.id})" title="Modifier">
                                <span class="icon">
                                    <i class="fas fa-edit"></i>
                                </span>
                            </button>
                        ` : ''}
                    </div>
                </td>
            </tr>
        `).join(''));
    }
    
    // Initialize DataTables with a small delay to ensure DOM is ready
    setTimeout(() => {
        // Check if DataTables is loaded
        if (typeof $.fn.DataTable === 'undefined') {
            console.error('DataTables is not loaded');
            return;
        }
        
        try {
            candidaturesTable = table.DataTable({
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/1.13.7/i18n/fr-FR.json'
                },
                pageLength: 10,
                lengthMenu: [5, 10, 25, 50],
                order: [[6, 'desc']], // Sort by date of application (descending)
                columnDefs: [
                    { orderable: false, targets: [7] } // Disable sorting on Actions column
                ],
                responsive: true,
                dom: '<"top"lf>rt<"bottom"ip><"clear">',
                initComplete: function() {
                    console.log('DataTable initialized successfully');
                }
            });
        } catch (error) {
            console.error('Error initializing DataTable:', error);
            // Fallback: display table without DataTables
            console.log('Falling back to basic table display');
            displayBasicTable(data);
        }
    }, 100);
}

// Fallback function to display table without DataTables
function displayBasicTable(data) {
    console.log('Displaying basic table without DataTables...');
    
    const table = document.getElementById('candidaturesTable');
    const tbody = table.querySelector('tbody');
    
    if (!data.data || data.data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="8" class="has-text-centered">
                    <div class="no-data-content">
                        <i class="fas fa-file-alt is-size-1 has-text-grey-light"></i>
                        <p class="is-size-5 has-text-grey">Aucune candidature trouvée</p>
                        <a href="recrutement.html" class="button is-primary">Postuler maintenant</a>
                    </div>
                </td>
            </tr>
        `;
        return;
    }
    
    tbody.innerHTML = data.data.map(candidature => `
        <tr>
            <td>${candidature.application_number}</td>
            <td>${candidature.training_title}</td>
            <td>
                <span class="tag ${getStatusClass(candidature.status)}">
                    ${getStatusText(candidature.status)}
                </span>
            </td>
            <td>${formatDate(candidature.training_session_start_date)}</td>
            <td>${formatDate(candidature.training_session_end_date)}</td>
            <td>${candidature.registration_fee} ${candidature.currency}</td>
            <td>${formatDate(candidature.created_at)}</td>
            <td>
                <div class="buttons has-addons">
                    <button class="button is-small is-primary" onclick="viewCandidature(${candidature.id})" title="Voir les détails">
                        <span class="icon">
                            <i class="fas fa-eye"></i>
                        </span>
                    </button>
                    ${candidature.status === 'PENDING' ? `
                        <button class="button is-small is-warning" onclick="editCandidature(${candidature.id})" title="Modifier">
                            <span class="icon">
                                <i class="fas fa-edit"></i>
                            </span>
                        </button>
                    ` : ''}
                </div>
            </td>
        </tr>
    `).join('');
    
    console.log('Basic table populated with', data.data.length, 'candidatures');
}

// Get status class for Bulma tags
function getStatusClass(status) {
    const classMap = {
        'PENDING': 'is-warning',
        'ACCEPTED': 'is-success',
        'REJECTED': 'is-danger',
        'CANCELLED': 'is-light'
    };
    return classMap[status] || 'is-light';
}

// Get status text in French
function getStatusText(status) {
    const statusMap = {
        'PENDING': 'En attente',
        'ACCEPTED': 'Acceptée',
        'REJECTED': 'Refusée',
        'CANCELLED': 'Annulée'
    };
    return statusMap[status] || status;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// DataTables handles pagination automatically

// View candidature details
async function viewCandidature(id) {
    console.log('View candidature:', id);
    
    try {
        // Get token from session
        const token = authManager.getAccessToken();
        if (!token) {
            console.error('No token found in session');
            authManager.logout();
            return;
        }
        
        // Show loading state
        showCandidatureModal('Chargement des détails...', true);
        
        // API call to get candidature details
        const apiUrl = `https://lafaom.vertex-cam.com/api/v1/my-student-applications/${id}`;
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'accept': 'application/json'
            }
        });
        
        console.log('API Response status:', response.status);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Candidature details:', data);
            console.log('About to display candidature details...');
            displayCandidatureDetails(data.data);
            console.log('displayCandidatureDetails called');
        } else {
            console.error('API error:', response.status, response.statusText);
            showCandidatureError('Erreur lors du chargement des détails');
        }
    } catch (error) {
        console.error('Error loading candidature details:', error);
        showCandidatureError('Erreur de connexion');
    }
}

// Cancel candidature
function cancelCandidature(id) {
    if (confirm('Êtes-vous sûr de vouloir annuler cette candidature ?')) {
        console.log('Cancel candidature:', id);
        // Implement cancel functionality
        alert('Fonctionnalité d\'annulation à implémenter');
    }
}

// Setup event listeners
function setupEventListeners() {
    // User dropdown
    const userAvatar = document.getElementById('userAvatar');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userAvatar && userDropdown) {
        userAvatar.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userAvatar.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Mobile menu
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    
    if (burger && menu) {
        burger.addEventListener('click', () => {
            menu.classList.toggle('is-active');
            burger.classList.toggle('is-active');
        });
    }
    
    // DataTables handles sorting and filtering automatically
}

// DataTables handles all filtering and sorting automatically

// Handle logout
function handleLogout() {
    // Use auth manager logout
    authManager.logout();
}

// This function is now implemented above

// Show candidature modal
function showCandidatureModal(content, isLoading = false) {
    // Remove existing modal if any
    const existingModal = document.getElementById('candidatureModal');
    if (existingModal) {
        existingModal.remove();
    }
    
    // Create modal HTML using the same structure as recruitment modal
    const modalHTML = `
        <div id="candidatureModal" class="application-modal show">
            <div class="modal-wrap">
                <div class="modal-header">
                    <h3 class="modal-title">Détails de la candidature</h3>
                    <button class="modal-close" onclick="closeCandidatureModal()" aria-label="Fermer">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    ${isLoading ? `
                        <div class="has-text-centered" style="padding: 2rem;">
                            <div class="spinner"></div>
                            <p class="mt-3">${content}</p>
                        </div>
                    ` : content}
                </div>
            </div>
        </div>
    `;
    
    // Add modal to page
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Debug: Check if modal was added
    console.log('Modal added to DOM:', document.getElementById('candidatureModal'));
    
    // Add interaction for details (close others when opening one)
    setTimeout(() => {
        const details = document.querySelectorAll('#candidatureModal details');
        details.forEach(d => d.addEventListener('click', e => {
            if (!e.shiftKey) {
                details.filter(i => i !== d).forEach(i => i.removeAttribute('open'));
            }
        }));
    }, 100);
}

// Display candidature details
function displayCandidatureDetails(candidature) {
    console.log('displayCandidatureDetails called with:', candidature);
    const content = `
        <container>
            <h2>Détails de la candidature - ${candidature.application_number}</h2>
            
            <details>
                <summary class="success">Informations générales</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="status">Statut: ${getStatusText(candidature.status)}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">Date de création: ${formatDate(candidature.created_at)}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">Dernière mise à jour: ${formatDate(candidature.updated_at)}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            <details>
                <summary class="success">Informations financières</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="status">Frais d'inscription: ${candidature.registration_fee} ${candidature.currency}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">Frais de formation: ${candidature.training_fee} ${candidature.currency}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">ID de paiement: ${candidature.payment_id || 'Non disponible'}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            ${candidature.refusal_reason ? `
                <details>
                    <summary class="failure">Raison du refus</summary>
                    <ul>
                        <li>
                            <div class="failure">
                                <span class="status">Refus</span>
                                <span class="info">${candidature.refusal_reason}</span>
                            </div>
                        </li>
                    </ul>
                </details>
            ` : ''}
            
            <details>
                <summary class="success">Formation</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="status">Titre: ${candidature.training.title}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">Type: ${candidature.training.training_type}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">Durée: ${candidature.training.duration} ${candidature.training.duration_unit}</span>
                        </div>
                    </li>
                    <li>
                        <div class="${candidature.training.status === 'ACTIVE' ? 'success' : 'warning'}">
                            <span class="status">Statut formation: ${candidature.training.status}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            <details>
                <summary class="success">Session de formation</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="status">Date de début: ${formatDate(candidature.training_session.start_date)}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">Date de fin: ${formatDate(candidature.training_session.end_date)}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">Limite d'inscription: ${formatDate(candidature.training_session.registration_deadline)}</span>
                        </div>
                    </li>
                    <li>
                        <div class="success">
                            <span class="status">Places disponibles: ${candidature.training_session.available_slots}</span>
                        </div>
                    </li>
                    <li>
                        <div class="${candidature.training_session.status === 'OPEN_FOR_REGISTRATION' ? 'success' : 'warning'}">
                            <span class="status">Statut session: ${candidature.training_session.status}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            <details open="open">
                <summary class="success">Présentation de la formation</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="info">${candidature.training.presentation}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            <details>
                <summary class="success">Programme de formation</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="info">${candidature.training.program}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            <details>
                <summary class="success">Public cible</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="info">${candidature.training.target_audience}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            <details>
                <summary class="success">Prérequis</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="info">${candidature.training.prerequisites}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            <details>
                <summary class="success">Compétences cibles</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="info">${candidature.training.target_skills}</span>
                        </div>
                    </li>
                </ul>
            </details>
            
            <details>
                <summary class="success">Inscription</summary>
                <ul>
                    <li>
                        <div class="success">
                            <span class="info">${candidature.training.enrollment}</span>
                        </div>
                    </li>
                </ul>
            </details>
        </container>
    `;
    
    console.log('Content generated, calling showCandidatureModal...');
    showCandidatureModal(content);
    console.log('showCandidatureModal called');
}

// Show candidature error
function showCandidatureError(message) {
    const content = `
        <div class="has-text-centered" style="padding: 2rem;">
            <div class="icon is-large has-text-danger mb-3">
                <i class="fas fa-exclamation-triangle fa-3x"></i>
            </div>
            <h4 class="title is-4 has-text-danger">Erreur</h4>
            <p class="subtitle is-6">${message}</p>
            <button class="button is-danger" onclick="closeCandidatureModal()">Fermer</button>
        </div>
    `;
    
    showCandidatureModal(content);
}

// Close candidature modal
function closeCandidatureModal() {
    const modal = document.getElementById('candidatureModal');
    if (modal) {
        modal.remove();
    }
}

// Edit candidature
function editCandidature(id) {
    console.log('Editing candidature:', id);
    // TODO: Implement edit candidature modal or page
    alert('Fonctionnalité "Modifier" en cours de développement');
}

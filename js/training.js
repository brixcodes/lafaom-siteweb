// Training page functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Training page loaded');
    
    // Initialize training functionality
    initializeTrainingFilters();
    loadTrainingPrograms();
    
    // Initialize offcanvas
    initializeTrainingOffcanvas();
});

// Training data storage
let allTrainings = [];
let filteredTrainings = [];

// API Configuration
const TRAINING_API_URL = 'https://lafaom.vertex-cam.com/api/v1/trainings';
const API_TIMEOUT = 10000; // 10 seconds

// Load training programs from API
async function loadTrainingPrograms() {
    const loadingContainer = document.getElementById('loadingTrainings');
    const trainingGrid = document.getElementById('trainingProgramsGrid');
    const errorContainer = document.getElementById('errorTrainings');
    
    try {
        // Show loading state
        loadingContainer.style.display = 'block';
        trainingGrid.style.display = 'none';
        errorContainer.style.display = 'none';
        
        // Create abort controller for timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);
        
        const response = await fetch(`${TRAINING_API_URL}?page=1&page_size=20&order_by=created_at&asc=asc`, {
            method: 'GET',
            headers: {
                'accept': 'application/json'
            },
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
            const data = await response.json();
            console.log('Training data loaded:', data);
            
            allTrainings = data.data || [];
            filteredTrainings = [...allTrainings];
            
            renderTrainingPrograms();
            initializeTrainingFilters();
            
            // Hide loading, show grid
            loadingContainer.style.display = 'none';
            trainingGrid.style.display = 'grid';
            
        } else {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
    } catch (error) {
        console.error('Error loading training programs:', error);
        
        // Show fallback data
        allTrainings = getFallbackTrainingData();
        filteredTrainings = [...allTrainings];
        renderTrainingPrograms();
        initializeTrainingFilters();
        
        // Hide loading, show grid
        loadingContainer.style.display = 'none';
        trainingGrid.style.display = 'grid';
        
        // Show error message after a delay
        setTimeout(() => {
            console.warn('Using fallback training data');
        }, 1000);
    }
}

// Fallback training data
function getFallbackTrainingData() {
    return [
        {
            id: "fallback-1",
            title: "Développement Web Fullstack",
            status: "ACTIVE",
            duration: 40,
            duration_unit: "HOURS",
            training_type: "On-Site",
            presentation: "<p>Une formation complète pour apprendre à créer des applications web avec frontend et backend.</p>",
            target_skills: "<p>Connaissance de base en programmation</p>",
            program: "<ul><li>Créer des applications web complètes</li><li>Gérer des bases de données</li><li>Déployer un site web</li></ul>",
            target_audience: "<p>Développeurs débutants ou professionnels souhaitant se former au développement fullstack</p>",
            prerequisites: "<p>Cette formation couvre les technologies modernes pour le développement web</p>",
            enrollment: "<p>Inscription ouverte via notre plateforme en ligne</p>",
            created_at: "2025-01-01T00:00:00.000Z"
        },
        {
            id: "fallback-2",
            title: "Formation AVMJ - Auxiliaire de Vie en Univers Judiciaire",
            status: "ACTIVE",
            duration: 120,
            duration_unit: "HOURS",
            training_type: "Hybrid",
            presentation: "<p>Formation professionnelle pour devenir Auxiliaire de Vie en Univers Judiciaire.</p>",
            target_skills: "<p>Compétences en accompagnement judiciaire</p>",
            program: "<ul><li>Droit pénal et civil</li><li>Techniques d'accompagnement</li><li>Éthique professionnelle</li></ul>",
            target_audience: "<p>Professionnels souhaitant se spécialiser dans l'accompagnement judiciaire</p>",
            prerequisites: "<p>Niveau baccalauréat ou équivalent</p>",
            enrollment: "<p>Inscription sur dossier</p>",
            created_at: "2025-01-01T00:00:00.000Z"
        },
        {
            id: "fallback-3",
            title: "Gestion de Projets Humanitaires",
            status: "ACTIVE",
            duration: 60,
            duration_unit: "HOURS",
            training_type: "Online",
            presentation: "<p>Formation complète en gestion de projets dans le secteur humanitaire.</p>",
            target_skills: "<p>Gestion de projet, planification, suivi</p>",
            program: "<ul><li>Cycle de vie du projet</li><li>Outils de gestion</li><li>Évaluation et reporting</li></ul>",
            target_audience: "<p>Professionnels du secteur humanitaire et social</p>",
            prerequisites: "<p>Expérience dans le secteur social ou humanitaire</p>",
            enrollment: "<p>Inscription en ligne</p>",
            created_at: "2025-01-01T00:00:00.000Z"
        }
    ];
}

// Render training programs
function renderTrainingPrograms() {
    const trainingGrid = document.getElementById('trainingProgramsGrid');
    
    if (!trainingGrid) {
        console.error('Training grid not found');
        return;
    }
    
    trainingGrid.innerHTML = '';
    
    if (filteredTrainings.length === 0) {
        trainingGrid.innerHTML = `
            <div class="no-results">
                <i class="bx bx-search-alt-2"></i>
                <h3>Aucune formation trouvée</h3>
                <p>Essayez de modifier vos critères de recherche</p>
            </div>
        `;
        return;
    }
    
    filteredTrainings.forEach((training, index) => {
        const trainingCard = createTrainingCard(training, index);
        trainingGrid.appendChild(trainingCard);
    });
}

// Create training card
function createTrainingCard(training, index) {
    const card = document.createElement('div');
    card.className = 'training-card';
    card.setAttribute('data-training-id', training.id);
    
    const duration = formatDuration(training.duration, training.duration_unit);
    const status = getStatusLabel(training.status);
    const type = getTypeLabel(training.training_type);
    const description = stripHtml(training.presentation || 'Aucune description disponible');
    
    card.innerHTML = `
        <div class="training-card-header">
            <div>
                <h3 class="training-card-title">${training.title}</h3>
                <div class="training-card-meta">
                    <div class="training-meta-item">
                        <i class="bx bx-time"></i>
                        <span>${duration}</span>
                    </div>
                    <div class="training-meta-item">
                        <i class="bx bx-laptop"></i>
                        <span>${type}</span>
                    </div>
                    <div class="training-meta-item">
                        <i class="bx bx-check-circle"></i>
                        <span>${status}</span>
                    </div>
                </div>
            </div>
            <div class="training-status-badge training-status-${training.status.toLowerCase()}">
                ${status}
            </div>
        </div>
        
        <div class="training-card-description">
            ${description}
        </div>
        
        <div class="training-card-actions">
            <button class="training-btn training-btn-primary" onclick="showTrainingDetails('${training.id}')">
                <i class="bx bx-info-circle"></i>
                Voir les sessions
            </button>
        </div>
    `;
    
    return card;
}

// Format duration
function formatDuration(duration, unit) {
    if (!duration) return 'Durée non spécifiée';
    
    const unitMap = {
        'HOURS': 'heures',
        'DAYS': 'jours',
        'WEEKS': 'semaines',
        'MONTHS': 'mois'
    };
    
    const unitText = unitMap[unit] || unit.toLowerCase();
    return `${duration} ${unitText}`;
}

// Get status label
function getStatusLabel(status) {
    const statusMap = {
        'ACTIVE': 'Actif',
        'INACTIVE': 'Inactif',
        'UPCOMING': 'À venir',
        'COMPLETED': 'Terminé'
    };
    return statusMap[status] || status;
}

// Get type label
function getTypeLabel(type) {
    const typeMap = {
        'On-Site': 'Présentiel',
        'Online': 'En ligne',
        'Hybrid': 'Hybride'
    };
    return typeMap[type] || type;
}

// Strip HTML tags
function stripHtml(html) {
    if (!html) return '';
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

// Initialize training filters
function initializeTrainingFilters() {
    const searchInput = document.getElementById('trainingSearch');
    const typeSelect = document.getElementById('typeSelect');
    const durationSelect = document.getElementById('durationSelect');
    const statusSelect = document.getElementById('statusSelect');
    const retryButton = document.getElementById('retryTrainingButton');
    
    // Search filter
    if (searchInput) {
        searchInput.addEventListener('input', filterTrainings);
    }
    
    // Type filter
    if (typeSelect) {
        typeSelect.addEventListener('change', filterTrainings);
    }
    
    // Duration filter
    if (durationSelect) {
        durationSelect.addEventListener('change', filterTrainings);
    }
    
    // Status filter
    if (statusSelect) {
        statusSelect.addEventListener('change', filterTrainings);
    }
    
    // Retry button
    if (retryButton) {
        retryButton.addEventListener('click', loadTrainingPrograms);
    }
}

// Filter trainings
function filterTrainings() {
    const searchTerm = document.getElementById('trainingSearch')?.value.toLowerCase() || '';
    const typeFilter = document.getElementById('typeSelect')?.value || 'all';
    const durationFilter = document.getElementById('durationSelect')?.value || 'all';
    const statusFilter = document.getElementById('statusSelect')?.value || 'all';
    
    filteredTrainings = allTrainings.filter(training => {
        // Search filter
        const matchesSearch = !searchTerm || 
            training.title.toLowerCase().includes(searchTerm) ||
            stripHtml(training.presentation || '').toLowerCase().includes(searchTerm) ||
            stripHtml(training.target_audience || '').toLowerCase().includes(searchTerm);
        
        // Type filter
        const matchesType = typeFilter === 'all' || training.training_type === typeFilter;
        
        // Duration filter
        let matchesDuration = true;
        if (durationFilter !== 'all') {
            const duration = training.duration || 0;
            switch (durationFilter) {
                case 'short':
                    matchesDuration = duration <= 20;
                    break;
                case 'medium':
                    matchesDuration = duration > 20 && duration <= 40;
                    break;
                case 'long':
                    matchesDuration = duration > 40;
                    break;
            }
        }
        
        // Status filter
        const matchesStatus = statusFilter === 'all' || training.status === statusFilter;
        
        return matchesSearch && matchesType && matchesDuration && matchesStatus;
    });
    
    renderTrainingPrograms();
}

// Show training details
async function showTrainingDetails(trainingId) {
    const training = allTrainings.find(t => t.id === trainingId);
    if (!training) {
        console.error('Training not found:', trainingId);
        return;
    }
    
    const offcanvas = document.getElementById('trainingOffcanvas');
    const title = document.getElementById('offcanvasTitle');
    const content = document.getElementById('offcanvasContent');
    
    if (!offcanvas || !title || !content) {
        console.error('Offcanvas elements not found');
        return;
    }
    
    // Set title
    title.textContent = training.title;
    
    // Set content with loading state
    content.innerHTML = `
        <div class="job-details">
            <div class="job-details-header">
                <div class="job-title-section">
                    <h1 class="job-title">${training.title}</h1>
                    <div class="job-meta">
                        <span class="job-type">${getTypeLabel(training.training_type)}</span>
                        <span class="job-location">${formatDuration(training.duration, training.duration_unit)}</span>
                        <span class="status-badge status-${training.status.toLowerCase()}">${getStatusLabel(training.status)}</span>
                    </div>
                </div>
            </div>
            
            <div class="job-details-section">
                <h3>Présentation</h3>
                <div class="job-description">
                    ${training.presentation || '<p>Aucune présentation disponible</p>'}
                </div>
            </div>
            
            ${training.target_skills ? `
            <div class="job-details-section">
                <h3>Compétences visées</h3>
                <div class="job-description">
                    ${training.target_skills}
                </div>
            </div>
            ` : ''}
            
            ${training.program ? `
            <div class="job-details-section">
                <h3>Programme</h3>
                <div class="job-description">
                    ${training.program}
                </div>
            </div>
            ` : ''}
            
            ${training.target_audience ? `
            <div class="job-details-section">
                <h3>Public cible</h3>
                <div class="job-description">
                    ${training.target_audience}
                </div>
            </div>
            ` : ''}
            
            ${training.prerequisites ? `
            <div class="job-details-section">
                <h3>Prérequis</h3>
                <div class="job-description">
                    ${training.prerequisites}
                </div>
            </div>
            ` : ''}
            
            ${training.enrollment ? `
            <div class="job-details-section">
                <h3>Inscription</h3>
                <div class="job-description">
                    ${training.enrollment}
                </div>
            </div>
            ` : ''}
            
            <div class="job-details-section">
                <h3>Sessions disponibles</h3>
                <div class="training-sessions-loading">
                    <div class="loading-spinner"></div>
                    <p>Chargement des sessions...</p>
                </div>
            </div>
            
        </div>
    `;
    
    // Show offcanvas
    offcanvas.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Load training sessions
    await loadTrainingSessions(trainingId);
}

// Load training sessions
async function loadTrainingSessions(trainingId) {
    try {
        console.log(`📡 Chargement des sessions pour la formation: ${trainingId}`);
        
        const response = await fetch(
            `https://lafaom.vertex-cam.com/api/v1/training-sessions?page=1&page_size=20&training_id=${trainingId}&order_by=created_at&asc=asc`,
            {
                headers: { accept: "application/json" }
            }
        );
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Sessions reçues:', data);
        
        if (data.data && data.data.length > 0) {
            renderTrainingSessions(data.data);
        } else {
            renderNoSessions();
        }
    } catch (error) {
        console.error('❌ Erreur lors du chargement des sessions:', error);
        renderSessionsError();
    }
}

// Render training sessions
function renderTrainingSessions(sessions) {
    const sessionsContainer = document.querySelector('.training-sessions-loading');
    if (!sessionsContainer) return;
    
    // Store sessions globally
    currentSessions = sessions;
    
    sessionsContainer.innerHTML = `
        <div class="training-sessions-list">
            ${sessions.map(session => `
                <div class="training-session-card">
                    <div class="session-dates">
                        <span class="session-date-range">
                            Du ${new Date(session.start_date).toLocaleDateString('fr-FR')} au ${new Date(session.end_date).toLocaleDateString('fr-FR')}
                        </span>
                    </div>
                    
                    <div class="session-deadline">
                        <span class="deadline-text">date limite d'inscription: ${new Date(session.registration_deadline).toLocaleDateString('fr-FR')}</span>
                    </div>
                    
                    <div class="session-pricing">
                        <span class="price-label">TARIF ${session.training_fee} ${session.currency}</span>
                    </div>
                    
                    <div class="session-actions">
                        <button class="session-btn session-btn-primary" onclick="enrollInSession('${session.id}')">
                            Je m'inscris
                        </button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Render no sessions message
function renderNoSessions() {
    const sessionsContainer = document.querySelector('.training-sessions-loading');
    if (!sessionsContainer) return;
    
    sessionsContainer.innerHTML = `
        <div class="no-sessions">
            <i class="bx bx-info-circle"></i>
            <p>Aucune session disponible pour le moment.</p>
            <p>Contactez-nous pour plus d'informations sur les prochaines sessions.</p>
        </div>
    `;
}

// Render sessions error
function renderSessionsError() {
    const sessionsContainer = document.querySelector('.training-sessions-loading');
    if (!sessionsContainer) return;
    
    sessionsContainer.innerHTML = `
        <div class="sessions-error">
            <i class="bx bx-error-circle"></i>
            <p>Impossible de charger les sessions pour le moment.</p>
            <button class="retry-btn" onclick="loadTrainingSessions('${trainingId}')">
                <i class="bx bx-refresh"></i>
                Réessayer
            </button>
        </div>
    `;
}

// Get session status label
function getSessionStatusLabel(status) {
    const statusMap = {
        'OPEN_FOR_REGISTRATION': 'Inscriptions ouvertes',
        'CLOSED': 'Inscriptions fermées',
        'FULL': 'Complet',
        'CANCELLED': 'Annulé',
        'ONGOING': 'En cours',
        'COMPLETED': 'Terminé'
    };
    return statusMap[status] || status;
}

// Enroll in specific session
function enrollInSession(sessionId) {
    console.log('🔍 Tentative d\'inscription à la session:', sessionId);
    console.log('📊 Sessions disponibles:', currentSessions);
    
    // Trouver la session dans les données chargées
    const session = findSessionById(sessionId);
    console.log('🎯 Session trouvée:', session);
    
    if (!session) {
        console.error('❌ Session not found:', sessionId);
        console.error('📋 Sessions disponibles:', currentSessions.map(s => s.id));
        alert('Session non trouvée. Veuillez réessayer.');
        return;
    }
    
    console.log('✅ Affichage de la modal pour la session:', session);
    // Créer une modal d'inscription spécifique à la session
    showSessionEnrollmentModal(session);
}

// Global variable to store sessions
let currentSessions = [];

// Country codes data with ISO codes
const countryCodes = [
    { code: "+1", iso: "US", name: "États-Unis", flag: "🇺🇸" },
    { code: "+1", iso: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "+7", iso: "RU", name: "Russie", flag: "🇷🇺" },
    { code: "+7", iso: "KZ", name: "Kazakhstan", flag: "🇰🇿" },
    { code: "+20", iso: "EG", name: "Égypte", flag: "🇪🇬" },
    { code: "+27", iso: "ZA", name: "Afrique du Sud", flag: "🇿🇦" },
    { code: "+30", iso: "GR", name: "Grèce", flag: "🇬🇷" },
    { code: "+31", iso: "NL", name: "Pays-Bas", flag: "🇳🇱" },
    { code: "+32", iso: "BE", name: "Belgique", flag: "🇧🇪" },
    { code: "+33", iso: "FR", name: "France", flag: "🇫🇷" },
    { code: "+34", iso: "ES", name: "Espagne", flag: "🇪🇸" },
    { code: "+36", iso: "HU", name: "Hongrie", flag: "🇭🇺" },
    { code: "+39", iso: "IT", name: "Italie", flag: "🇮🇹" },
    { code: "+40", iso: "RO", name: "Roumanie", flag: "🇷🇴" },
    { code: "+41", iso: "CH", name: "Suisse", flag: "🇨🇭" },
    { code: "+43", iso: "AT", name: "Autriche", flag: "🇦🇹" },
    { code: "+44", iso: "GB", name: "Royaume-Uni", flag: "🇬🇧" },
    { code: "+45", iso: "DK", name: "Danemark", flag: "🇩🇰" },
    { code: "+46", iso: "SE", name: "Suède", flag: "🇸🇪" },
    { code: "+47", iso: "NO", name: "Norvège", flag: "🇳🇴" },
    { code: "+48", iso: "PL", name: "Pologne", flag: "🇵🇱" },
    { code: "+49", iso: "DE", name: "Allemagne", flag: "🇩🇪" },
    { code: "+51", iso: "PE", name: "Pérou", flag: "🇵🇪" },
    { code: "+52", iso: "MX", name: "Mexique", flag: "🇲🇽" },
    { code: "+53", iso: "CU", name: "Cuba", flag: "🇨🇺" },
    { code: "+54", iso: "AR", name: "Argentine", flag: "🇦🇷" },
    { code: "+55", iso: "BR", name: "Brésil", flag: "🇧🇷" },
    { code: "+56", iso: "CL", name: "Chili", flag: "🇨🇱" },
    { code: "+57", iso: "CO", name: "Colombie", flag: "🇨🇴" },
    { code: "+58", iso: "VE", name: "Venezuela", flag: "🇻🇪" },
    { code: "+60", iso: "MY", name: "Malaisie", flag: "🇲🇾" },
    { code: "+61", iso: "AU", name: "Australie", flag: "🇦🇺" },
    { code: "+62", iso: "ID", name: "Indonésie", flag: "🇮🇩" },
    { code: "+63", iso: "PH", name: "Philippines", flag: "🇵🇭" },
    { code: "+64", iso: "NZ", name: "Nouvelle-Zélande", flag: "🇳🇿" },
    { code: "+65", iso: "SG", name: "Singapour", flag: "🇸🇬" },
    { code: "+66", iso: "TH", name: "Thaïlande", flag: "🇹🇭" },
    { code: "+81", iso: "JP", name: "Japon", flag: "🇯🇵" },
    { code: "+82", iso: "KR", name: "Corée du Sud", flag: "🇰🇷" },
    { code: "+84", iso: "VN", name: "Vietnam", flag: "🇻🇳" },
    { code: "+86", iso: "CN", name: "Chine", flag: "🇨🇳" },
    { code: "+90", iso: "TR", name: "Turquie", flag: "🇹🇷" },
    { code: "+91", iso: "IN", name: "Inde", flag: "🇮🇳" },
    { code: "+92", iso: "PK", name: "Pakistan", flag: "🇵🇰" },
    { code: "+93", iso: "AF", name: "Afghanistan", flag: "🇦🇫" },
    { code: "+94", iso: "LK", name: "Sri Lanka", flag: "🇱🇰" },
    { code: "+95", iso: "MM", name: "Myanmar", flag: "🇲🇲" },
    { code: "+98", iso: "IR", name: "Iran", flag: "🇮🇷" },
    { code: "+212", iso: "MA", name: "Maroc", flag: "🇲🇦" },
    { code: "+213", iso: "DZ", name: "Algérie", flag: "🇩🇿" },
    { code: "+216", iso: "TN", name: "Tunisie", flag: "🇹🇳" },
    { code: "+218", iso: "LY", name: "Libye", flag: "🇱🇾" },
    { code: "+220", iso: "GM", name: "Gambie", flag: "🇬🇲" },
    { code: "+221", iso: "SN", name: "Sénégal", flag: "🇸🇳" },
    { code: "+222", iso: "MR", name: "Mauritanie", flag: "🇲🇷" },
    { code: "+223", iso: "ML", name: "Mali", flag: "🇲🇱" },
    { code: "+224", iso: "GN", name: "Guinée", flag: "🇬🇳" },
    { code: "+225", iso: "CI", name: "Côte d'Ivoire", flag: "🇨🇮" },
    { code: "+226", iso: "BF", name: "Burkina Faso", flag: "🇧🇫" },
    { code: "+227", iso: "NE", name: "Niger", flag: "🇳🇪" },
    { code: "+228", iso: "TG", name: "Togo", flag: "🇹🇬" },
    { code: "+229", iso: "BJ", name: "Bénin", flag: "🇧🇯" },
    { code: "+230", iso: "MU", name: "Maurice", flag: "🇲🇺" },
    { code: "+231", iso: "LR", name: "Libéria", flag: "🇱🇷" },
    { code: "+232", iso: "SL", name: "Sierra Leone", flag: "🇸🇱" },
    { code: "+233", iso: "GH", name: "Ghana", flag: "🇬🇭" },
    { code: "+234", iso: "NG", name: "Nigeria", flag: "🇳🇬" },
    { code: "+235", iso: "TD", name: "Tchad", flag: "🇹🇩" },
    { code: "+236", iso: "CF", name: "République centrafricaine", flag: "🇨🇫" },
    { code: "+237", iso: "CM", name: "Cameroun", flag: "🇨🇲" },
    { code: "+238", iso: "CV", name: "Cap-Vert", flag: "🇨🇻" },
    { code: "+239", iso: "ST", name: "São Tomé-et-Príncipe", flag: "🇸🇹" },
    { code: "+240", iso: "GQ", name: "Guinée équatoriale", flag: "🇬🇶" },
    { code: "+241", iso: "GA", name: "Gabon", flag: "🇬🇦" },
    { code: "+242", iso: "CG", name: "République du Congo", flag: "🇨🇬" },
    { code: "+243", iso: "CD", name: "République démocratique du Congo", flag: "🇨🇩" },
    { code: "+244", iso: "AO", name: "Angola", flag: "🇦🇴" },
    { code: "+245", iso: "GW", name: "Guinée-Bissau", flag: "🇬🇼" },
    { code: "+248", iso: "SC", name: "Seychelles", flag: "🇸🇨" },
    { code: "+249", iso: "SD", name: "Soudan", flag: "🇸🇩" },
    { code: "+250", iso: "RW", name: "Rwanda", flag: "🇷🇼" },
    { code: "+251", iso: "ET", name: "Éthiopie", flag: "🇪🇹" },
    { code: "+252", iso: "SO", name: "Somalie", flag: "🇸🇴" },
    { code: "+253", iso: "DJ", name: "Djibouti", flag: "🇩🇯" },
    { code: "+254", iso: "KE", name: "Kenya", flag: "🇰🇪" },
    { code: "+255", iso: "TZ", name: "Tanzanie", flag: "🇹🇿" },
    { code: "+256", iso: "UG", name: "Ouganda", flag: "🇺🇬" },
    { code: "+257", iso: "BI", name: "Burundi", flag: "🇧🇮" },
    { code: "+258", iso: "MZ", name: "Mozambique", flag: "🇲🇿" },
    { code: "+260", iso: "ZM", name: "Zambie", flag: "🇿🇲" },
    { code: "+261", iso: "MG", name: "Madagascar", flag: "🇲🇬" },
    { code: "+262", iso: "RE", name: "Réunion", flag: "🇷🇪" },
    { code: "+263", iso: "ZW", name: "Zimbabwe", flag: "🇿🇼" },
    { code: "+264", iso: "NA", name: "Namibie", flag: "🇳🇦" },
    { code: "+265", iso: "MW", name: "Malawi", flag: "🇲🇼" },
    { code: "+266", iso: "LS", name: "Lesotho", flag: "🇱🇸" },
    { code: "+267", iso: "BW", name: "Botswana", flag: "🇧🇼" },
    { code: "+268", iso: "SZ", name: "Swaziland", flag: "🇸🇿" },
    { code: "+269", iso: "KM", name: "Comores", flag: "🇰🇲" },
    { code: "+291", iso: "ER", name: "Érythrée", flag: "🇪🇷" },
    { code: "+350", iso: "GI", name: "Gibraltar", flag: "🇬🇮" },
    { code: "+351", iso: "PT", name: "Portugal", flag: "🇵🇹" },
    { code: "+352", iso: "LU", name: "Luxembourg", flag: "🇱🇺" },
    { code: "+353", iso: "IE", name: "Irlande", flag: "🇮🇪" },
    { code: "+354", iso: "IS", name: "Islande", flag: "🇮🇸" },
    { code: "+355", iso: "AL", name: "Albanie", flag: "🇦🇱" },
    { code: "+356", iso: "MT", name: "Malte", flag: "🇲🇹" },
    { code: "+357", iso: "CY", name: "Chypre", flag: "🇨🇾" },
    { code: "+358", iso: "FI", name: "Finlande", flag: "🇫🇮" },
    { code: "+359", iso: "BG", name: "Bulgarie", flag: "🇧🇬" },
    { code: "+370", iso: "LT", name: "Lituanie", flag: "🇱🇹" },
    { code: "+371", iso: "LV", name: "Lettonie", flag: "🇱🇻" },
    { code: "+372", iso: "EE", name: "Estonie", flag: "🇪🇪" },
    { code: "+373", iso: "MD", name: "Moldavie", flag: "🇲🇩" },
    { code: "+374", iso: "AM", name: "Arménie", flag: "🇦🇲" },
    { code: "+375", iso: "BY", name: "Biélorussie", flag: "🇧🇾" },
    { code: "+376", iso: "AD", name: "Andorre", flag: "🇦🇩" },
    { code: "+377", iso: "MC", name: "Monaco", flag: "🇲🇨" },
    { code: "+378", iso: "SM", name: "Saint-Marin", flag: "🇸🇲" },
    { code: "+380", iso: "UA", name: "Ukraine", flag: "🇺🇦" },
    { code: "+381", iso: "RS", name: "Serbie", flag: "🇷🇸" },
    { code: "+382", iso: "ME", name: "Monténégro", flag: "🇲🇪" },
    { code: "+385", iso: "HR", name: "Croatie", flag: "🇭🇷" },
    { code: "+386", iso: "SI", name: "Slovénie", flag: "🇸🇮" },
    { code: "+387", iso: "BA", name: "Bosnie-Herzégovine", flag: "🇧🇦" },
    { code: "+389", iso: "MK", name: "Macédoine du Nord", flag: "🇲🇰" },
    { code: "+420", iso: "CZ", name: "République tchèque", flag: "🇨🇿" },
    { code: "+421", iso: "SK", name: "Slovaquie", flag: "🇸🇰" },
    { code: "+423", iso: "LI", name: "Liechtenstein", flag: "🇱🇮" }
];

// Initialize country codes dropdown
function initializeCountryCodes() {
    const countrySelect = document.getElementById('countryCode');
    if (!countrySelect) return;
    
    // Sort countries by name
    const sortedCountries = countryCodes.sort((a, b) => a.name.localeCompare(b.name, 'fr'));
    
    // Add options to select
    sortedCountries.forEach(country => {
        const option = document.createElement('option');
        option.value = country.code;
        option.textContent = `${country.flag} ${country.iso} - ${country.name}`;
        countrySelect.appendChild(option);
    });
}

// Find session by ID
function findSessionById(sessionId) {
    return currentSessions.find(session => session.id === sessionId);
}

// Show session enrollment modal with form
function showSessionEnrollmentModal(session) {
    console.log('🚀 Création de la modal d\'inscription pour:', session);
    
    // Créer modal overlay
    const modalOverlay = document.createElement('div');
    modalOverlay.className = 'session-enrollment-modal-overlay';
    modalOverlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 20000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        overflow-y: auto;
    `;
    
    // Créer modal content
    const modalContent = document.createElement('div');
    modalContent.className = 'session-enrollment-modal-content';
    modalContent.style.cssText = `
        background: white;
        border-radius: 16px;
        padding: 40px;
        max-width: 600px;
        width: 100%;
        max-height: 90vh;
        overflow-y: auto;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        transform: scale(0.9);
        transition: transform 0.3s ease;
    `;
    
    modalContent.innerHTML = `
        <div class="enrollment-header" style="text-align: center; margin-bottom: 30px;">
            <div class="enrollment-icon" style="font-size: 3rem; color: var(--color-primary); margin-bottom: 16px;">
                <img src="assets/Images/logo.png" alt="Logo" style="width: 80px; height: 80px; object-fit: contain;">
            </div>
            <h2 style="color: var(--color-gray-800); margin-bottom: 8px; font-size: 1.8rem;">
                Inscription à la formation
            </h2>
            <p style="color: var(--color-gray-600); font-size: 0.9rem;">
                Remplissez le formulaire ci-dessous pour vous inscrire à cette session
            </p>
        </div>
        
        <form id="enrollmentForm" class="enrollment-form" style="display: flex; flex-direction: column; gap: 20px;">
            <div class="form-row" style="display: flex; gap: 16px;">
                <div class="form-group" style="flex: 1;">
                    <label for="firstName" style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--color-gray-700);">
                        Prénom *
                    </label>
                    <input type="text" id="firstName" name="firstName" required
                           style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; transition: border-color 0.3s ease;"
                           onfocus="this.style.borderColor='var(--color-primary)'; this.style.outline='none';"
                           onblur="this.style.borderColor='#e5e7eb';">
                </div>
                <div class="form-group" style="flex: 1;">
                    <label for="lastName" style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--color-gray-700);">
                        Nom *
                    </label>
                    <input type="text" id="lastName" name="lastName" required
                           style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; transition: border-color 0.3s ease;"
                           onfocus="this.style.borderColor='var(--color-primary)'; this.style.outline='none';"
                           onblur="this.style.borderColor='#e5e7eb';">
                </div>
            </div>
            
            <div class="form-group">
                <label for="email" style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--color-gray-700);">
                    Adresse email *
                </label>
                <input type="email" id="email" name="email" required
                       style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; transition: border-color 0.3s ease;"
                       onfocus="this.style.borderColor='var(--color-primary)'; this.style.outline='none';"
                       onblur="this.style.borderColor='#e5e7eb';">
            </div>
            
            <div class="form-row" style="display: flex; gap: 16px;">
                <div class="form-group" style="flex: 0 0 120px;">
                    <label for="countryCode" style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--color-gray-700);">
                        Code pays *
                    </label>
                    <select id="countryCode" name="countryCode" required
                            style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; transition: border-color 0.3s ease;"
                            onfocus="this.style.borderColor='var(--color-primary)'; this.style.outline='none';"
                            onblur="this.style.borderColor='#e5e7eb';">
                        <option value="">Sélectionner un pays</option>
                    </select>
                </div>
                <div class="form-group" style="flex: 1;">
                    <label for="phoneNumber" style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--color-gray-700);">
                        Numéro de téléphone *
                    </label>
                    <input type="tel" id="phoneNumber" name="phoneNumber" required
                           style="width: 100%; padding: 12px 16px; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 16px; transition: border-color 0.3s ease;"
                           onfocus="this.style.borderColor='var(--color-primary)'; this.style.outline='none';"
                           onblur="this.style.borderColor='#e5e7eb';">
                </div>
            </div>
            
            <div class="form-group">
                <label for="attachments" style="display: block; margin-bottom: 8px; font-weight: 600; color: var(--color-gray-700);">
                    Documents (CV, Lettre de motivation, etc.)
                </label>
                <div class="file-upload-area" id="fileUploadArea" 
                     style="border: 2px dashed #d1d5db; border-radius: 8px; padding: 20px; text-align: center; cursor: pointer; transition: all 0.3s ease;"
                     onmouseover="this.style.borderColor='var(--color-primary)'; this.style.backgroundColor='rgba(220, 38, 127, 0.05)';"
                     onmouseout="this.style.borderColor='#d1d5db'; this.style.backgroundColor='transparent';">
                    <i class="bx bx-cloud-upload" style="font-size: 2rem; color: var(--color-gray-400); margin-bottom: 8px; display: block;"></i>
                    <p style="color: var(--color-gray-600); margin: 0; font-size: 0.9rem;">
                        Cliquez pour sélectionner des fichiers ou glissez-déposez ici
                    </p>
                    <p style="color: var(--color-gray-400); margin: 4px 0 0 0; font-size: 0.8rem;">
                        PDF, DOC, DOCX (max 10MB par fichier)
                    </p>
                </div>
                <input type="file" id="attachments" name="attachments" multiple accept=".pdf,.doc,.docx" 
                       style="display: none;">
                <div id="selectedFiles" style="margin-top: 12px;"></div>
            </div>
            
            <div class="form-actions" style="display: flex; gap: 12px; justify-content: center; margin-top: 30px;">
                <button type="button" onclick="closeSessionEnrollmentModal()" 
                        style="padding: 12px 24px; border: 2px solid var(--color-primary); background: transparent; color: var(--color-primary); border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                        onmouseover="this.style.background='var(--color-primary)'; this.style.color='white';" 
                        onmouseout="this.style.background='transparent'; this.style.color='var(--color-primary);">
                    Annuler
                </button>
                <button type="submit" id="submitEnrollment"
                        style="padding: 12px 24px; background: var(--color-primary); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.3s ease;"
                        onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(220, 38, 127, 0.3)';" 
                        onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                    <i class="bx bx-send" style="margin-right: 8px;"></i>
                    S'inscrire
                </button>
            </div>
        </form>
    `;
    
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);
    document.body.style.overflow = 'hidden';
    
    console.log('✅ Modal ajoutée au DOM');
    
    // Animate modal
    setTimeout(() => {
        modalContent.style.transform = 'scale(1)';
        console.log('🎨 Animation de la modal déclenchée');
    }, 10);
    
    // Initialize form functionality
    initializeEnrollmentForm(session);
    
    // Close on overlay click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeSessionEnrollmentModal();
        }
    });
    
    // Store modal reference
    window.currentSessionEnrollmentModal = modalOverlay;
}

// Initialize enrollment form
function initializeEnrollmentForm(session) {
    const form = document.getElementById('enrollmentForm');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const fileInput = document.getElementById('attachments');
    const selectedFilesDiv = document.getElementById('selectedFiles');
    const submitButton = document.getElementById('submitEnrollment');
    
    // Initialize country codes
    initializeCountryCodes();
    
    // File upload handling
    fileUploadArea.addEventListener('click', () => fileInput.click());
    
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = 'var(--color-primary)';
        fileUploadArea.style.backgroundColor = 'rgba(220, 38, 127, 0.1)';
    });
    
    fileUploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#d1d5db';
        fileUploadArea.style.backgroundColor = 'transparent';
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.style.borderColor = '#d1d5db';
        fileUploadArea.style.backgroundColor = 'transparent';
        
        const files = Array.from(e.dataTransfer.files);
        handleFileSelection(files);
    });
    
    fileInput.addEventListener('change', (e) => {
        const files = Array.from(e.target.files);
        handleFileSelection(files);
    });
    
    function handleFileSelection(files) {
        selectedFilesDiv.innerHTML = '';
        
        files.forEach((file, index) => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`Le fichier "${file.name}" est trop volumineux (max 10MB)`);
                return;
            }
            
            const fileDiv = document.createElement('div');
            fileDiv.style.cssText = `
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 8px 12px;
                background: rgba(220, 38, 127, 0.1);
                border-radius: 6px;
                margin-bottom: 8px;
                font-size: 0.9rem;
            `;
            
            fileDiv.innerHTML = `
                <span style="color: var(--color-gray-700);">
                    <i class="bx bx-file" style="margin-right: 8px;"></i>
                    ${file.name} (${(file.size / 1024 / 1024).toFixed(1)}MB)
                </span>
                <button type="button" onclick="removeFile(${index})" style="
                    background: none;
                    border: none;
                    color: var(--color-primary);
                    cursor: pointer;
                    padding: 4px;
                ">
                    <i class="bx bx-x"></i>
                </button>
            `;
            
            selectedFilesDiv.appendChild(fileDiv);
        });
    }
    
    // Form submission
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(form);
        const enrollmentData = {
            email: formData.get('email'),
            target_session_id: session.id,
            first_name: formData.get('firstName'),
            last_name: formData.get('lastName'),
            phone_number: formData.get('phoneNumber'),
            country_code: formData.get('countryCode'),
            attachments: []
        };
        
        // Handle file attachments
        const files = Array.from(fileInput.files);
        for (const file of files) {
            enrollmentData.attachments.push(file.name);
        }
        
        // Show loading state
        submitButton.innerHTML = '<i class="bx bx-loader-alt bx-spin" style="margin-right: 8px;"></i>Inscription en cours...';
        submitButton.disabled = true;
        
        try {
            const response = await fetch('https://lafaom.vertex-cam.com/api/v1/student-applications', {
                method: 'POST',
                headers: {
                    'accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(enrollmentData)
            });
            
            if (response.ok) {
                const result = await response.json();
                showEnrollmentSuccess(result);
            } else {
                throw new Error(`Erreur ${response.status}: ${response.statusText}`);
            }
        } catch (error) {
            console.error('Erreur lors de l\'inscription:', error);
            showEnrollmentError(error.message);
        } finally {
            submitButton.innerHTML = '<i class="bx bx-send" style="margin-right: 8px;"></i>S\'inscrire';
            submitButton.disabled = false;
        }
    });
}

// Show enrollment success
function showEnrollmentSuccess(result) {
    const modal = window.currentSessionEnrollmentModal;
    if (!modal) return;
    
    const modalContent = modal.querySelector('.session-enrollment-modal-content');
    modalContent.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4rem; color: #16a34a; margin-bottom: 20px;">
                <i class="bx bx-check-circle"></i>
            </div>
            <h2 style="color: var(--color-gray-800); margin-bottom: 16px; font-size: 1.8rem;">
                Inscription réussie !
            </h2>
            <p style="color: var(--color-gray-600); margin-bottom: 24px; line-height: 1.6;">
                Votre inscription a été enregistrée avec succès. Vous recevrez un email de confirmation avec tous les détails.
            </p>
            <button onclick="closeSessionEnrollmentModal()" style="
                padding: 12px 24px;
                background: var(--color-primary);
                color: white;
                border: none;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            " onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 4px 12px rgba(220, 38, 127, 0.3)';" 
               onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none';">
                Fermer
            </button>
        </div>
    `;
}

// Show enrollment error
function showEnrollmentError(errorMessage) {
    const modal = window.currentSessionEnrollmentModal;
    if (!modal) return;
    
    const modalContent = modal.querySelector('.session-enrollment-modal-content');
    modalContent.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4rem; color: #dc2626; margin-bottom: 20px;">
                <i class="bx bx-error-circle"></i>
            </div>
            <h2 style="color: var(--color-gray-800); margin-bottom: 16px; font-size: 1.8rem;">
                Erreur d'inscription
            </h2>
            <p style="color: var(--color-gray-600); margin-bottom: 24px; line-height: 1.6;">
                Une erreur s'est produite lors de votre inscription : ${errorMessage}
            </p>
            <div style="display: flex; gap: 12px; justify-content: center;">
                <button onclick="closeSessionEnrollmentModal()" style="
                    padding: 12px 24px;
                    border: 2px solid var(--color-primary);
                    background: transparent;
                    color: var(--color-primary);
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Fermer
                </button>
                <button onclick="location.reload()" style="
                    padding: 12px 24px;
                    background: var(--color-primary);
                    color: white;
                    border: none;
                    border-radius: 8px;
                    font-weight: 600;
                    cursor: pointer;
                ">
                    Réessayer
                </button>
            </div>
        </div>
    `;
}

// Close session enrollment modal
function closeSessionEnrollmentModal() {
    const modal = window.currentSessionEnrollmentModal;
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
        window.currentSessionEnrollmentModal = null;
    }
}




// Initialize training offcanvas
function initializeTrainingOffcanvas() {
    const offcanvas = document.getElementById('trainingOffcanvas');
    const closeButton = document.getElementById('closeOffcanvas');
    const overlay = offcanvas?.querySelector('.offcanvas-overlay');
    
    if (!offcanvas || !closeButton) {
        console.error('Offcanvas elements not found');
        return;
    }
    
    // Close button
    closeButton.addEventListener('click', closeTrainingOffcanvas);
    
    // Overlay click
    if (overlay) {
        overlay.addEventListener('click', closeTrainingOffcanvas);
    }
    
    // Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && offcanvas.classList.contains('show')) {
            closeTrainingOffcanvas();
        }
    });
}

// Close training offcanvas
function closeTrainingOffcanvas() {
    const offcanvas = document.getElementById('trainingOffcanvas');
    if (!offcanvas) return;
    
    offcanvas.classList.add('closing');
    
    setTimeout(() => {
        offcanvas.classList.remove('show', 'closing');
        document.body.style.overflow = '';
    }, 300);
}

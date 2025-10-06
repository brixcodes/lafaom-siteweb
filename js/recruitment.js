// JavaScript spécifique à la page recrutement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de la page recrutement');

    // API Configuration - Utilise les URLs centralisées
    const API_BASE_URL = CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.JOB.OFFERS;

    // DOM Elements
    const loadingOffers = document.getElementById('loadingOffers');
    const jobOffersContainer = document.getElementById('jobOffersGrid');
    const errorOffers = document.getElementById('errorOffers');
    const retryButton = document.getElementById('retryButton');
    const jobOffcanvas = document.getElementById('jobOffcanvas');
    const closeOffcanvas = document.getElementById('closeOffcanvas');
    const offcanvasTitle = document.getElementById('offcanvasTitle');
    const offcanvasContent = document.getElementById('offcanvasContent');

    // Filter elements
    const jobSearch = document.getElementById('jobSearch');
    const locationSelect = document.getElementById('locationSelect');
    const contractSelect = document.getElementById('contractSelect');
    const salarySelect = document.getElementById('salarySelect');

    if (!loadingOffers || !jobOffersContainer || !errorOffers || !retryButton || !jobOffcanvas || !closeOffcanvas || !offcanvasTitle || !offcanvasContent || !jobSearch || !locationSelect || !contractSelect || !salarySelect) {
        console.error('❌ Un ou plusieurs éléments DOM requis pour la page de recrutement sont manquants.');
        return;
    }

    let allJobOffers = [];
    let filteredJobOffers = [];

    // Load job offers from API
    async function loadJobOffers() {
        try {
            console.log('📡 Chargement des offres d\'emploi...');
            showLoading();

            const response = await fetch(API_URLS.JOB_OFFERS());
            const result = await response.json();
            
            console.log('Résultat API offres:', result);
            allJobOffers = result.data || [];
            filteredJobOffers = [...allJobOffers];
            renderJobOffers(filteredJobOffers);
        } catch (error) {
            console.error('Erreur lors du chargement des offres:', error);
            showJobOffersError();
        }
    }

    function renderJobOffers(jobOffers) {
        console.log('🎯 Rendu des offres d\'emploi:', jobOffers);
        
        // Masquer le loader
        const loadingOffers = document.getElementById('loadingOffers');
        if (loadingOffers) {
            loadingOffers.style.display = 'none';
        }
        
        // Afficher le conteneur
        jobOffersContainer.style.display = 'block';
        jobOffersContainer.innerHTML = '';

        if (jobOffers.length === 0) {
            console.log('⚠️ Aucune offre d\'emploi trouvée');
            jobOffersContainer.innerHTML = `
                <div class="no-jobs">
                    <h3>Aucune offre d'emploi disponible</h3>
                    <p>Il n'y a actuellement aucune offre d'emploi correspondant à vos critères.</p>
                </div>
            `;
            return;
        }

        jobOffers.forEach((job, index) => {
            console.log(`📄 Création carte emploi ${index + 1}:`, job.title);
            const jobCard = createJobCard(job);
            jobOffersContainer.appendChild(jobCard);
            console.log(`✅ Carte ${index + 1} ajoutée au conteneur`);
        });
        
        console.log(`🎉 ${jobOffers.length} offres d'emploi rendues avec succès`);
        
        // Initialize filters after rendering
        initializeFilters();
    }

    function createJobCard(job) {
        const card = document.createElement('div');
        card.className = 'job-card primary-card';
        card.setAttribute('data-job-id', job.id);

        const contractType = job.contract_type || 'Non spécifié';
        const location = job.location || 'Non spécifié';
        const salary = formatSalary(job.salary, job.currency);
        const deadline = formatDate(job.submission_deadline);
        const weeklyHours = job.weekly_hours || 'Non spécifié';

        const isNew = new Date(job.created_at) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const isFormation = contractType === 'CDD' || contractType === 'CDI';

        let badges = '';
        if (isNew) {
            badges += '<span class="job-badge new">Nouveau</span>';
        }
        if (isFormation) {
            badges += '<span class="job-badge formation">Formation</span>';
        }
        if (job.weekly_hours && job.weekly_hours > 35) {
            badges += '<span class="job-badge mission">Mission</span>';
        }

        card.innerHTML = `
            <div class="job-card-header">
                <div class="job-card-content">
                    ${badges ? `<div class="job-badges">${badges}</div>` : ''}
                    <h3 class="job-title">${job.title}</h3>
                    <div class="job-meta">
                        <div class="job-location">
                            <i class="bx bx-map"></i>
                            <span>${location}</span>
                        </div>
                        <div class="job-duration">
                            <i class="bx bx-time"></i>
                            <span>Formation ${weeklyHours}h/semaine</span>
                        </div>
                        <div class="job-availability">
                            <i class="bx bx-calendar"></i>
                            <span>Clôture: ${deadline}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="job-card-footer">
                <div class="job-availability-text">
                    ${Math.floor(Math.random() * 3) + 1} session(s) disponible(s)
                </div>
                <button class="job-expand-btn primary-btn" data-job-id="${job.id}">
                    +
                </button>
            </div>
        `;
        return card;
    }

    function showJobDetails(jobId) {
        const job = allJobOffers.find(j => j.id === jobId);
        if (!job) return;

        offcanvasTitle.textContent = job.title;
        offcanvasContent.innerHTML = `
            <div class="job-details">
                <div class="job-details-header">
                    <span class="job-ref">Réf: ${job.reference || 'N/A'}</span>
                    <span class="job-contract">${job.contract_type || 'N/A'}</span>
                </div>
                <div class="job-info-grid">
                    <div class="job-info-item"><strong>Lieu:</strong> ${job.location || 'N/A'}</div>
                    <div class="job-info-item"><strong>Début:</strong> ${formatDate(job.start_date) || 'N/A'}</div>
                    <div class="job-info-item"><strong>Fin:</strong> ${job.end_date ? formatDate(job.end_date) : 'Non spécifié'}</div>
                    <div class="job-info-item"><strong>Heures/semaine:</strong> ${job.weekly_hours || 'N/A'}</div>
                    <div class="job-info-item"><strong>Permis requis:</strong> ${job.driving_license_required ? 'Oui' : 'Non'}</div>
                    <div class="job-info-item"><strong>Date limite:</strong> ${formatDate(job.submission_deadline) || 'N/A'}</div>
                </div>

                <div class="job-details-section">
                    <h3><i class="bx bx-briefcase"></i> Mission principale</h3>
                    <div class="job-content">${job.main_mission || 'Non spécifié'}</div>
                </div>
                <div class="job-details-section">
                    <h3><i class="bx bx-list-ul"></i> Responsabilités</h3>
                    <div class="job-content">${job.responsibilities || 'Non spécifié'}</div>
                </div>
                <div class="job-details-section">
                    <h3><i class="bx bx-award"></i> Compétences</h3>
                    <div class="job-content">${job.competencies || 'Non spécifié'}</div>
                </div>
                <div class="job-details-section">
                    <h3><i class="bx bx-user"></i> Profil recherché</h3>
                    <div class="job-content">${job.profile || 'Non spécifié'}</div>
                </div>
                <div class="job-details-section">
                    <h3><i class="bx bx-dollar"></i> Salaire & Avantages</h3>
                    <div class="job-content">
                        <p><strong>Salaire:</strong> ${formatSalary(job.salary, job.currency)}</p>
                        ${job.benefits ? `<p><strong>Avantages:</strong> ${job.benefits}</p>` : ''}
                        ${job.submission_fee ? `<p><strong>Frais de dossier:</strong> ${job.submission_fee} ${job.currency}</p>` : ''}
                    </div>
                </div>
                ${job.attachment && job.attachment.length > 0 ? `
                <div class="job-details-section">
                    <h3><i class="bx bx-paperclip"></i> Pièces jointes requises</h3>
                    <div class="job-attachments">
                        ${job.attachment.map(att => `<span class="attachment-tag">${att}</span>`).join('')}
                    </div>
                </div>` : ''}
                ${job.conditions ? `
                <div class="job-details-section">
                    <h3><i class="bx bx-info-circle"></i> Conditions spécifiques</h3>
                    <div class="job-content">${job.conditions}</div>
                </div>` : ''}
                <div class="job-actions">
                    <button class="btn btn-primary" onclick="openApplicationModal('${job.id}')">
                        <i class="bx bx-send"></i> Postuler
                    </button>
                    <a href="#" class="btn btn-neutral">
                        <i class="bx bx-download"></i> Télécharger l'offre
                    </a>
                </div>
            </div>
        `;
        jobOffcanvas.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeOffcanvasWithAnimation() {
        jobOffcanvas.classList.add('closing');
        setTimeout(() => {
            jobOffcanvas.classList.remove('show', 'closing');
            document.body.style.overflow = '';
        }, 300);
    }

    // Helper functions
    function formatDate(dateString) {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('fr-FR', options);
    }

    function formatSalary(salary, currency) {
        if (salary === null || salary === undefined) return 'Non spécifié';
        const formattedSalary = new Intl.NumberFormat('fr-FR', {
            style: 'currency',
            currency: currency || 'EUR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(salary);
        return formattedSalary;
    }

    function showLoading() {
        loadingOffers.style.display = 'block';
        jobOffersContainer.style.display = 'none';
        errorOffers.style.display = 'none';
    }

    function showJobOffersError() {
        loadingOffers.style.display = 'none';
        jobOffersContainer.style.display = 'none';
        errorOffers.style.display = 'block';
    }

    // Event listeners
    retryButton.addEventListener('click', loadJobOffers);

    closeOffcanvas.addEventListener('click', () => {
        closeOffcanvasWithAnimation();
    });

    jobOffcanvas.addEventListener('click', (e) => {
        if (e.target === jobOffcanvas || e.target.classList.contains('offcanvas-overlay')) {
            closeOffcanvasWithAnimation();
        }
    });

    // Handle job card clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('job-expand-btn') || e.target.closest('.job-expand-btn')) {
            const jobId = e.target.closest('.job-expand-btn').getAttribute('data-job-id');
            showJobDetails(jobId);
        }
    });

    // Filter functionality
    function initializeFilters() {
        // Populate location filter
        populateLocationFilter();
        
        // Add event listeners
        if (jobSearch) jobSearch.addEventListener('input', filterJobs);
        if (locationSelect) locationSelect.addEventListener('change', filterJobs);
        if (contractSelect) contractSelect.addEventListener('change', filterJobs);
        if (salarySelect) salarySelect.addEventListener('change', filterJobs);
    }

    // Populate location filter with unique locations
    function populateLocationFilter() {
        if (allJobOffers.length === 0) return;
        
        const locations = [...new Set(allJobOffers.map(offer => offer.location))].filter(loc => loc);
        locations.sort();
        
        if (locationSelect) {
            locationSelect.innerHTML = '<option value="all">Toutes les localisations</option>';
            locations.forEach(location => {
                const option = document.createElement('option');
                option.value = location;
                option.textContent = location;
                locationSelect.appendChild(option);
            });
        }
    }

    // Filter jobs based on criteria
    function filterJobs() {
        const searchTerm = jobSearch ? jobSearch.value.toLowerCase() : '';
        const selectedLocation = locationSelect ? locationSelect.value : 'all';
        const selectedContract = contractSelect ? contractSelect.value : 'all';
        const minSalary = salarySelect ? salarySelect.value : 'all';
        
        filteredJobOffers = allJobOffers.filter(offer => {
            // Search filter
            const matchesSearch = !searchTerm || 
                offer.title.toLowerCase().includes(searchTerm) ||
                offer.location.toLowerCase().includes(searchTerm) ||
                (offer.main_mission && stripHtml(offer.main_mission).toLowerCase().includes(searchTerm));
            
            // Location filter
            const matchesLocation = selectedLocation === 'all' || offer.location === selectedLocation;
            
            // Contract filter
            const matchesContract = selectedContract === 'all' || offer.contract_type === selectedContract;
            
            // Salary filter
            const matchesSalary = minSalary === 'all' || (offer.salary && offer.salary >= parseInt(minSalary));
            
            return matchesSearch && matchesLocation && matchesContract && matchesSalary;
        });
        
        renderJobOffers(filteredJobOffers);
    }

    // Helper function to strip HTML
    function stripHtml(html) {
        if (!html) return '';
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }

    // Load job offers when page loads
    loadJobOffers();
});

// Global functions for application modal
let currentJobId = null;

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
window.initializeCountryCodes = function() {
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

// Open application modal
window.openApplicationModal = async function(jobId) {
    currentJobId = jobId;
    const modal = document.getElementById('applicationModal');
    const formContent = document.getElementById('applicationFormContent');
    
    if (!modal || !formContent) {
        console.error('Modal elements not found');
        return;
    }
    
    // Show loading state
    formContent.innerHTML = `
        <div class="loading-state" style="text-align: center; padding: 40px;">
            <div class="loading-spinner" style="width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--color-primary); border-radius: 50%; animation: spin 1s linear infinite; margin: 0 auto 20px;"></div>
            <p style="color: var(--color-gray-600);">Chargement des détails de l'offre...</p>
        </div>
    `;
    
    // Show modal
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    try {
        // Fetch job offer details to get required attachments
        const response = await fetch(API_URLS.JOB_OFFER_BY_ID(jobId));
        const jobOffer = await response.json();
        
        console.log('Job offer details:', jobOffer);
        console.log('Required attachments:', jobOffer.data?.attachment);
        console.log('Attachment type:', typeof jobOffer.data?.attachment);
        console.log('Attachment length:', jobOffer.data?.attachment ? jobOffer.data.attachment.length : 'undefined');
        
        // Create application form with dynamic attachments
        formContent.innerHTML = generateApplicationForm(jobOffer.data);
        
        console.log('Generated form HTML:', formContent.innerHTML);
        
        // Initialize form
        initializeApplicationForm();
        
    } catch (error) {
        console.error('Error fetching job offer details:', error);
        formContent.innerHTML = `
            <div class="error-state" style="text-align: center; padding: 40px;">
                <i class="bx bx-error-circle" style="font-size: 3rem; color: #dc2626; margin-bottom: 16px;"></i>
                <h3 style="color: var(--color-gray-800); margin-bottom: 8px;">Erreur de chargement</h3>
                <p style="color: var(--color-gray-600); margin-bottom: 20px;">Impossible de charger les détails de l'offre.</p>
                <button onclick="closeApplicationModal()" class="btn-cancel">Fermer</button>
            </div>
        `;
    }
}

// Generate application form with dynamic attachments
function generateApplicationForm(jobOffer) {
    const requiredAttachments = jobOffer.attachment || [];
    
    // Generate attachment fields based on requirements
    const attachmentFields = generateAttachmentFields(requiredAttachments);
    
    return `
        <div class="application-form">
            <div class="application-header" style="text-align: center; margin-bottom: 30px;">
                <div class="application-icon" style="font-size: 3rem; color: var(--color-primary); margin-bottom: 16px;">
                      <img src="assets/Images/logo.png" alt="Logo" style="width: 80px; height: 80px; object-fit: contain;">
                </div>
                <h2 style="color: var(--color-gray-800); margin-bottom: 8px; font-size: 1.8rem;">
                    Candidature
                </h2>
                <p style="color: var(--color-gray-600); font-size: 0.9rem;">
                    Remplissez le formulaire ci-dessous pour postuler à cette offre
                </p>
            </div>
            
            <form id="applicationForm" class="application-form">
                <div class="form-row">
                    <div class="form-group">
                        <label for="firstName">Prénom *</label>
                        <input type="text" id="firstName" name="firstName" required>
                    </div>
                    <div class="form-group">
                        <label for="lastName">Nom *</label>
                        <input type="text" id="lastName" name="lastName" required>
                    </div>
                </div>
                
                <div class="form-row">
                    <div class="form-group">
                        <label for="civility">Civilité *</label>
                        <select id="civility" name="civility" required>
                            <option value="">Sélectionner</option>
                            <option value="Monsieur">Monsieur</option>
                            <option value="Madame">Madame</option>
                            <option value="Mademoiselle">Mademoiselle</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="dateOfBirth">Date de naissance *</label>
                        <input type="date" id="dateOfBirth" name="dateOfBirth" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="email">Adresse email *</label>
                    <input type="email" id="email" name="email" required>
                </div>
                
                <div class="form-row">
                    <div class="form-group" style="flex: 0 0 120px;">
                        <label for="countryCode">Code pays *</label>
                        <select id="countryCode" name="countryCode" required>
                            <option value="">Sélectionner un pays</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="phoneNumber">Numéro de téléphone *</label>
                        <input type="tel" id="phoneNumber" name="phoneNumber" required>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="address">Adresse *</label>
                    <textarea id="address" name="address" required placeholder="Votre adresse complète"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="city">Ville *</label>
                    <input type="text" id="city" name="city" required>
                </div>
                
                ${attachmentFields}
                
                <div class="form-actions">
                    <button type="button" class="btn-cancel" onclick="closeApplicationModal()">
                        Annuler
                    </button>
                    <button type="submit" class="btn-submit" id="submitApplication">
                        <i class="bx bx-send"></i>
                        Envoyer la candidature
                    </button>
                </div>
            </form>
        </div>
    `;
}

// Generate attachment fields based on job requirements
function generateAttachmentFields(requiredAttachments) {
    console.log('generateAttachmentFields called with:', requiredAttachments);
    
    if (!requiredAttachments || requiredAttachments.length === 0) {
        console.log('No attachments required, no upload fields needed');
        return ''; // Return empty string - no upload fields needed
    }
    
    // Map attachment types to French labels
    const attachmentLabels = {
        'CV': 'CV (Curriculum Vitae) *',
        'COVER_LETTER': 'Lettre de motivation *',
        'CERTIFICATE': 'Certificat/Diplôme',
        'DIPLOMA': 'Diplôme *',
        'RECOMMENDATION': 'Lettre de recommandation',
        'WORK_PERMIT': 'Permis de travail',
        'CRIMINAL_RECORD': 'Extrait de casier judiciaire',
        'PORTFOLIO': 'Portfolio',
        'OTHER': 'Autre document'
    };
    
    let attachmentFields = '';
    
    console.log('Generating fields for attachments:', requiredAttachments);
    
    requiredAttachments.forEach((attachmentType, index) => {
        const label = attachmentLabels[attachmentType] || `${attachmentType} *`;
        // CV, COVER_LETTER, et DIPLOMA sont généralement obligatoires
        const isRequired = ['CV', 'COVER_LETTER', 'DIPLOMA'].includes(attachmentType);
        
        console.log(`Creating field for ${attachmentType}: ${label} (required: ${isRequired})`);
        
        attachmentFields += `
            <div class="form-group">
                <label for="attachment_${attachmentType.toLowerCase()}">${label}</label>
                <div class="file-upload-area attachment-upload-area" id="fileUploadArea_${attachmentType.toLowerCase()}" data-type="${attachmentType}">
                    <i class="bx bx-cloud-upload file-upload-icon"></i>
                    <p class="file-upload-text">Cliquez pour sélectionner un fichier</p>
                    <p class="file-upload-hint">PDF, DOC, DOCX (max 10MB)</p>
                </div>
                <input type="file" id="attachment_${attachmentType.toLowerCase()}" name="attachment_${attachmentType.toLowerCase()}" accept=".pdf,.doc,.docx" style="display: none;" ${isRequired ? 'required' : ''}>
                <div id="selectedFile_${attachmentType.toLowerCase()}" class="selected-file"></div>
            </div>
        `;
    });
    
    console.log('Generated attachment fields HTML:', attachmentFields);
    return attachmentFields;
}

// Initialize application form
window.initializeApplicationForm = function() {
    // Initialize country codes
    initializeCountryCodes();
    
    // Check if we have dynamic attachment fields or the old single attachment field
    const hasDynamicAttachments = document.querySelector('.attachment-upload-area');
    const hasOldAttachmentField = document.getElementById('attachments');
    
    console.log('Form initialization - hasDynamicAttachments:', !!hasDynamicAttachments, 'hasOldAttachmentField:', !!hasOldAttachmentField);
    
    if (hasDynamicAttachments) {
        // Handle dynamic attachment fields
        console.log('Initializing dynamic attachments');
        initializeDynamicAttachments();
    } else if (hasOldAttachmentField) {
        // Handle old single attachment field
        console.log('Initializing single attachment field');
        initializeSingleAttachment();
    } else {
        console.log('No attachment fields found - form without file uploads');
    }
    
    // Form submission
    const form = document.getElementById('applicationForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = document.getElementById('submitApplication');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Envoi en cours...';
        
        try {
            await submitApplication();
        } catch (error) {
            console.error('Erreur lors de la soumission:', error);
            showApplicationError('Une erreur est survenue lors de l\'envoi de votre candidature.');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bx bx-send"></i> Envoyer la candidature';
        }
    });
}

// Initialize dynamic attachment fields
function initializeDynamicAttachments() {
    const attachmentAreas = document.querySelectorAll('.attachment-upload-area');
    
    attachmentAreas.forEach(area => {
        const attachmentType = area.dataset.type;
        const fileInput = document.getElementById(`attachment_${attachmentType.toLowerCase()}`);
        const selectedFileDiv = document.getElementById(`selectedFile_${attachmentType.toLowerCase()}`);
        
        // Click to upload
        area.addEventListener('click', () => {
            fileInput.click();
        });
        
        // File selection
        fileInput.addEventListener('change', (e) => {
            handleSingleFileSelection(e.target.files[0], attachmentType, selectedFileDiv);
        });
        
        // Drag and drop
        area.addEventListener('dragover', (e) => {
            e.preventDefault();
            area.classList.add('dragover');
        });
        
        area.addEventListener('dragleave', () => {
            area.classList.remove('dragover');
        });
        
        area.addEventListener('drop', (e) => {
            e.preventDefault();
            area.classList.remove('dragover');
            handleSingleFileSelection(e.dataTransfer.files[0], attachmentType, selectedFileDiv);
        });
    });
}

// Initialize single attachment field (fallback)
function initializeSingleAttachment() {
    const fileInput = document.getElementById('attachments');
    const fileUploadArea = document.getElementById('fileUploadArea');
    const selectedFilesDiv = document.getElementById('selectedFiles');
    let selectedFiles = [];
    
    // File input click
    fileUploadArea.addEventListener('click', () => {
        fileInput.click();
    });
    
    // File input change
    fileInput.addEventListener('change', (e) => {
        handleFileSelection(e.target.files);
    });
    
    // Drag and drop
    fileUploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadArea.classList.add('dragover');
    });
    
    fileUploadArea.addEventListener('dragleave', () => {
        fileUploadArea.classList.remove('dragover');
    });
    
    fileUploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadArea.classList.remove('dragover');
        handleFileSelection(e.dataTransfer.files);
    });
    
    function handleFileSelection(files) {
        Array.from(files).forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
                alert(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
                return;
            }
            
            if (!['.pdf', '.doc', '.docx'].some(ext => file.name.toLowerCase().endsWith(ext))) {
                alert(`Le fichier ${file.name} n'est pas dans un format accepté`);
                return;
            }
            
            selectedFiles.push(file);
        });
        
        updateSelectedFilesDisplay();
    }
    
    function updateSelectedFilesDisplay() {
        selectedFilesDiv.innerHTML = '';
        selectedFiles.forEach((file, index) => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            fileItem.innerHTML = `
                <div class="file-info">
                    <i class="bx bx-file file-icon"></i>
                    <div>
                        <div class="file-name">${file.name}</div>
                        <div class="file-size">${(file.size / 1024 / 1024).toFixed(2)} MB</div>
                    </div>
                </div>
                <button type="button" class="remove-file" onclick="removeFile(${index})">
                    <i class="bx bx-x"></i>
                </button>
            `;
            selectedFilesDiv.appendChild(fileItem);
        });
    }
    
    // Global function for file removal
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateSelectedFilesDisplay();
    };
}

// Handle single file selection for dynamic attachments
function handleSingleFileSelection(file, attachmentType, selectedFileDiv) {
    if (!file) return;
    
    if (file.size > 10 * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
        return;
    }
    
    if (!['.pdf', '.doc', '.docx'].some(ext => file.name.toLowerCase().endsWith(ext))) {
        alert(`Le fichier ${file.name} n'est pas dans un format accepté`);
        return;
    }
    
    // Display selected file
    selectedFileDiv.innerHTML = `
        <div class="selected-file-item">
            <div class="file-info">
                <i class="bx bx-file"></i>
                <span class="file-name">${file.name}</span>
                <span class="file-size">(${(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            </div>
            <button type="button" class="remove-file" onclick="removeSingleFile('${attachmentType}')">
                <i class="bx bx-x"></i>
            </button>
        </div>
    `;
}

// Global function for removing single files
window.removeSingleFile = function(attachmentType) {
    const fileInput = document.getElementById(`attachment_${attachmentType.toLowerCase()}`);
    const selectedFileDiv = document.getElementById(`selectedFile_${attachmentType.toLowerCase()}`);
    
    fileInput.value = '';
    selectedFileDiv.innerHTML = '';
};

// Test function to verify dynamic attachment generation
window.testAttachmentGeneration = function() {
    console.log('Testing attachment generation...');
    
    // Test with CV and COVER_LETTER
    const testAttachments = ['CV', 'COVER_LETTER'];
    const result = generateAttachmentFields(testAttachments);
    console.log('Test result:', result);
    
    // Test with more attachments
    const testAttachments2 = ['CV', 'COVER_LETTER', 'CERTIFICATE', 'PORTFOLIO'];
    const result2 = generateAttachmentFields(testAttachments2);
    console.log('Test result 2:', result2);
    
    return { result, result2 };
};

// Submit application
window.submitApplication = async function() {
    console.log('🚀 Début de la soumission de candidature...');
    
    const form = document.getElementById('applicationForm');
    const formData = new FormData(form);
    
    // Validate required fields
    const requiredFields = ['email', 'phoneNumber', 'firstName', 'lastName', 'civility', 'countryCode', 'city', 'address', 'dateOfBirth'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
        console.log('❌ Champs manquants:', missingFields);
        showApplicationError(`Veuillez remplir tous les champs requis : ${missingFields.join(', ')}`);
        return;
    }
    
    console.log('✅ Validation des champs de base réussie');
    
    // Check if we have dynamic attachment fields or the old single attachment field
    const hasDynamicAttachments = document.querySelector('.attachment-upload-area');
    const hasOldAttachmentField = document.getElementById('attachments');
    
    console.log('Validation - hasDynamicAttachments:', !!hasDynamicAttachments, 'hasOldAttachmentField:', !!hasOldAttachmentField);
    
    // Validate file attachments based on form type
    if (hasDynamicAttachments) {
        // Validate dynamic attachment fields
        const attachmentInputs = document.querySelectorAll('input[type="file"][id^="attachment_"]');
        let hasRequiredFiles = false;
        
        console.log('Found dynamic attachment inputs:', attachmentInputs.length);
        
        attachmentInputs.forEach(input => {
            if (input.hasAttribute('required') && input.files.length === 0) {
                const label = document.querySelector(`label[for="${input.id}"]`);
                showApplicationError(`${label ? label.textContent.replace(' *', '') : 'Un fichier'} est obligatoire.`);
                return;
            }
            if (input.files.length > 0) {
                hasRequiredFiles = true;
            }
        });
        
        if (!hasRequiredFiles) {
            showApplicationError('Au moins un fichier est obligatoire.');
            return;
        }
    } else if (hasOldAttachmentField) {
        // Validate old single attachment field
        if (!hasOldAttachmentField.files || hasOldAttachmentField.files.length === 0) {
            showApplicationError('Le CV est obligatoire. Veuillez sélectionner au moins un fichier.');
            return;
        }
    } else {
        console.log('No attachment fields found - skipping file validation');
    }
    
    // Get selected country ISO code
    const countryCode = formData.get('countryCode');
    const selectedCountry = countryCodes.find(country => country.code === countryCode);
    
    if (!selectedCountry) {
        showApplicationError('Veuillez sélectionner un pays valide.');
        return;
    }
    
    const countryISO = selectedCountry.iso.toUpperCase(); // Ensure uppercase ISO-2 code
    
    console.log('Selected country:', selectedCountry);
    console.log('Country code:', countryCode);
    console.log('Country ISO:', countryISO);
    
    // Prepare application data
    const applicationData = {
        job_offer_id: currentJobId,
        email: formData.get('email'),
        phone_number: formData.get('phoneNumber'),
        first_name: formData.get('firstName'),
        last_name: formData.get('lastName'),
        civility: formData.get('civility'),
        country_code: countryISO, // Use ISO-2 code directly
        city: formData.get('city'),
        address: formData.get('address'),
        date_of_birth: formData.get('dateOfBirth'),
        attachments: []
    };
    
    // Show loading state
    const submitButton = document.querySelector('#applicationForm .btn-submit');
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Upload en cours...';
    submitButton.disabled = true;
    
    // Handle file attachments - upload to job-attachments API first
    try {
        let filesToUpload = [];
        
        if (hasDynamicAttachments) {
            // Collect files from dynamic attachment fields
            const attachmentInputs = document.querySelectorAll('input[type="file"][id^="attachment_"]');
            console.log('📎 Collecte des fichiers depuis les champs dynamiques:', attachmentInputs.length);
            
            attachmentInputs.forEach(input => {
                if (input.files.length > 0) {
                    const attachmentType = input.id.replace('attachment_', '').toUpperCase();
                    console.log(`📄 Fichier trouvé: ${input.files[0].name} (type: ${attachmentType})`);
                    filesToUpload.push({
                        file: input.files[0],
                        type: attachmentType
                    });
                }
            });
        } else if (hasOldAttachmentField) {
            // Collect files from old single attachment field
            console.log('📎 Collecte des fichiers depuis l\'ancien champ unique');
            Array.from(hasOldAttachmentField.files).forEach(file => {
                console.log(`📄 Fichier trouvé: ${file.name}`);
                filesToUpload.push({
                    file: file,
                    type: 'CV' // Default type for old field
                });
            });
        } else {
            console.log('ℹ️ Aucun champ de pièce jointe trouvé - pas de fichiers à uploader');
        }
        
        console.log(`📊 Total des fichiers à uploader: ${filesToUpload.length}`);
        
        // Upload each file to job-attachments API
        for (const { file, type } of filesToUpload) {
            console.log(`⬆️ Upload du fichier: ${file.name} (type: ${type})`);
            
            // Vérifier la taille du fichier (max 10MB)
            if (file.size > 10 * 1024 * 1024) {
                throw new Error(`Le fichier ${file.name} est trop volumineux (max 10MB)`);
            }
            
            // Vérifier le type de fichier
            const allowedTypes = ['.pdf', '.doc', '.docx'];
            const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
            if (!allowedTypes.includes(fileExtension)) {
                throw new Error(`Le fichier ${file.name} n'est pas dans un format accepté (PDF, DOC, DOCX)`);
            }
            
            const attachmentData = new FormData();
            attachmentData.append('name', type); // Use the attachment type as name
            attachmentData.append('file', file);
            
            console.log(`🌐 Envoi vers: ${API_URLS.JOB_ATTACHMENTS()}`);
            
            const attachmentResponse = await fetch(API_URLS.JOB_ATTACHMENTS(), {
                method: 'POST',
                headers: {
                    'accept': 'application/json'
                    // Ne pas définir Content-Type pour FormData, le navigateur le fait automatiquement
                },
                body: attachmentData
            });
            
            if (attachmentResponse.ok) {
                const attachmentResult = await attachmentResponse.json();
                console.log('✅ Upload réussi:', attachmentResult);
                
                applicationData.attachments.push({
                    name: attachmentResult.data?.file_path || file.name,
                    url: attachmentResult.data?.file_path || attachmentResult.url,
                    type: type
                });
            } else {
                console.error('❌ Échec de l\'upload pour le fichier:', file.name);
                console.error('📊 Statut de réponse:', attachmentResponse.status);
                
                let errorMessage = 'Erreur inconnue';
                try {
                    const errorResult = await attachmentResponse.json();
                    console.error('📋 Détails de l\'erreur:', errorResult);
                    errorMessage = errorResult.message || errorResult.error || 'Erreur de validation';
                } catch (e) {
                    console.error('⚠️ Impossible de parser la réponse d\'erreur:', e);
                    errorMessage = `Erreur HTTP ${attachmentResponse.status}: ${attachmentResponse.statusText}`;
                }
                
                throw new Error(`Erreur lors de l'upload du fichier ${file.name}: ${errorMessage}`);
            }
        }
    } catch (error) {
        console.error('Erreur upload fichier:', error);
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
        showApplicationError(`Erreur lors de l'upload des fichiers : ${error.message}`);
        return;
    }
    
    try {
        console.log('📤 Envoi des données de candidature:', applicationData);
        
        const response = await fetch(API_URLS.JOB_APPLICATIONS(), {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            },
            body: JSON.stringify(applicationData)
        });
        
        const result = await response.json();
        console.log('📋 Réponse de l\'API:', result);
        
        if (response.ok) {
            console.log('✅ Candidature soumise avec succès:', result);
            showApplicationSuccess(result);
        } else {
            console.error('❌ Erreur lors de la soumission:', result);
            
            // Handle specific payment errors
            if (result.message && result.message.includes('MINIMUM_REQUIRED_FIELDS')) {
                showApplicationError('Erreur de validation : Veuillez vérifier que tous les champs requis sont correctement remplis, notamment le pays sélectionné.');
            } else if (result.message && result.message.includes('customer_country')) {
                showApplicationError('Erreur de pays : Le code pays sélectionné n\'est pas valide. Veuillez sélectionner un autre pays.');
            } else if (result.message && result.message.includes('payment')) {
                showApplicationError('Erreur de paiement : ' + result.message);
            } else {
                showApplicationError(result.message || 'Erreur lors de l\'envoi de la candidature');
            }
        }
    } catch (error) {
        console.error('❌ Erreur API:', error);
        showApplicationError('Erreur de connexion. Veuillez réessayer.');
    } finally {
        // Restore button state
        submitButton.textContent = originalButtonText;
        submitButton.disabled = false;
    }
}

// Show success message
window.showApplicationSuccess = function(response) {
    console.log('🎉 Affichage du message de succès:', response);
    
    const formContent = document.getElementById('applicationFormContent');
    
    // Check if payment is required
    if (response.data && response.data.payment && response.data.payment.payment_link) {
        console.log('💳 Paiement requis - redirection vers le paiement');
        
        // Payment required - show payment message
        formContent.innerHTML = `
            <div class="application-message application-success">
                <div class="success-icon">
                    <i class="bx bx-check-circle" style="color: #10b981; font-size: 3rem;"></i>
                </div>
                <div class="success-content">
                    <h3 style="color: #10b981; margin-bottom: 16px;">✅ Candidature envoyée avec succès !</h3>
                    
                    <p style="color: #6b7280; margin-bottom: 24px;">
                        Votre candidature a été enregistrée. Vous devez maintenant effectuer le paiement pour finaliser votre candidature.
                    </p>
                    
                    <div class="payment-info" style="background: #f3f4f6; padding: 16px; border-radius: 8px; margin-bottom: 24px;">
                        <div style="display: flex; align-items: center; margin-bottom: 8px;">
                            <i class="bx bx-euro" style="color: #059669; margin-right: 8px;"></i>
                            <span style="font-weight: 600; color: #059669;">Montant: ${response.data.payment.amount} EUR</span>
                        </div>
                        <div style="display: flex; align-items: center;">
                            <i class="bx bx-receipt" style="color: #6b7280; margin-right: 8px;"></i>
                            <span style="color: #6b7280;">N° candidature: ${response.data.job_application.application_number}</span>
                        </div>
                    </div>
                    
                    <div class="payment-buttons" style="display: flex; gap: 12px; justify-content: center;">
                        <button class="btn btn-primary" onclick="redirectToPayment('${response.data.payment.payment_link}')" style="background: #059669; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                            <i class="bx bx-credit-card" style="margin-right: 8px;"></i>
                            Payer maintenant
                        </button>
                        <button class="btn btn-secondary" onclick="closeApplicationModal()" style="background: #6b7280; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
                            <i class="bx bx-x" style="margin-right: 8px;"></i>
                            Fermer
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        console.log('✅ Aucun paiement requis - affichage du message de succès simple');
        
        // No payment required - show success message
        formContent.innerHTML = `
            <div class="application-message application-success">
                <div class="success-icon">
                    <i class="bx bx-check-circle" style="color: #10b981; font-size: 3rem;"></i>
                </div>
                <div class="success-content">
                    <h3 style="color: #10b981; margin-bottom: 16px;">✅ Candidature envoyée avec succès !</h3>
                    
                    <p style="color: #6b7280; margin-bottom: 24px;">
                        Votre candidature a été enregistrée. Nous vous contacterons dans les plus brefs délais.
                    </p>
                    
                    <button class="success-button" onclick="closeApplicationModal()" style="background: #10b981; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        <i class="bx bx-check" style="margin-right: 8px;"></i>
                        OK
                    </button>
                </div>
            </div>
        `;
    }
}

// Redirect to payment
window.redirectToPayment = function(paymentLink) {
    console.log('💳 Redirection vers le paiement:', paymentLink);
    
    // Vérifier que le lien de paiement est valide
    if (!paymentLink || paymentLink === 'undefined' || paymentLink === 'null') {
        console.error('❌ Lien de paiement invalide:', paymentLink);
        showApplicationError('Erreur: Lien de paiement invalide. Veuillez contacter le support.');
        return;
    }
    
    // Ouvrir le lien de paiement dans un nouvel onglet
    const paymentWindow = window.open(paymentLink, '_blank', 'noopener,noreferrer');
    
    if (!paymentWindow) {
        console.error('❌ Impossible d\'ouvrir la fenêtre de paiement (popup bloqué)');
        showApplicationError('Veuillez autoriser les popups pour accéder au paiement, ou cliquez sur le lien suivant: ' + paymentLink);
        return;
    }
    
    console.log('✅ Fenêtre de paiement ouverte avec succès');
    
    // Fermer le modal après un court délai
    setTimeout(() => {
        closeApplicationModal();
    }, 1000);
}


// Show error message
window.showApplicationError = function(message) {
    console.error('❌ Affichage du message d\'erreur:', message);
    
    const formContent = document.getElementById('applicationFormContent');
    formContent.innerHTML = `
        <div class="application-message application-error">
            <div class="error-icon">
                <i class="bx bx-x-circle" style="color: #dc2626; font-size: 3rem;"></i>
            </div>
            <div class="error-content">
                <h3 style="color: #dc2626; margin-bottom: 16px;">❌ Erreur</h3>
                <p style="color: #6b7280; margin-bottom: 24px;">${message}</p>
                <div style="display: flex; gap: 12px; justify-content: center;">
                    <button class="error-button" onclick="closeApplicationModal()" style="background: #dc2626; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600;">
                        <i class="bx bx-x" style="margin-right: 8px;"></i>
                        Fermer
                    </button>
                    <button class="retry-button" onclick="location.reload()" style="background: #6b7280; color: white; padding: 12px 24px; border: none; border-radius: 6px; cursor: pointer;">
                        <i class="bx bx-refresh" style="margin-right: 8px;"></i>
                        Réessayer
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Close application modal
window.closeApplicationModal = function() {
    const modal = document.getElementById('applicationModal');
    if (modal) {
        modal.classList.remove('show');
        document.body.style.overflow = '';
    }
}

// Event listeners for modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('applicationModal');
    const closeBtn = document.getElementById('closeApplicationModal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closeApplicationModal);
    }
    
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal || e.target.classList.contains('modal-overlay')) {
                closeApplicationModal();
            }
        });
    }
});
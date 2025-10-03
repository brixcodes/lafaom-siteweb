// JavaScript spécifique à la page recrutement
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation de la page recrutement');

    // API Configuration
    const API_BASE_URL = 'https://lafaom.vertex-cam.com/api/v1/job-offers';

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

            const response = await fetch('https://lafaom.vertex-cam.com/api/v1/job-offers?page=1&page_size=20&order_by=created_at&asc=asc');
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
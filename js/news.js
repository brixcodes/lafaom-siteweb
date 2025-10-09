// JavaScript spécifique à la page actualités
document.addEventListener('DOMContentLoaded', async function () {
    console.log('🚀 Initialisation de la page actualités');

    const filterSelect = document.getElementById('categorySelect');
    const newsContainer = document.querySelector('.news-cards-main ul.cards');
    const paginationContainer = document.querySelector('.pagination-numbers');

    console.log('🔍 Éléments trouvés:', {
        filterSelect: !!filterSelect,
        newsContainer: !!newsContainer,
        paginationContainer: !!paginationContainer
    });

    if (!filterSelect || !newsContainer || !paginationContainer) {
        console.error('❌ Éléments requis non trouvés sur la page actualités');
        console.error('filterSelect:', filterSelect);
        console.error('newsContainer:', newsContainer);
        console.error('paginationContainer:', paginationContainer);
        return;
    }

    let currentCategory = "all";
    let currentPage = 1;
    const pageSize = 6;
    let totalPages = 1;

    async function loadNews(page = 1) {
        try {
            console.log(`📡 Chargement des actualités - Page: ${page}`);

            // Test de l'API avec timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 secondes timeout

            const response = await fetch(
                API_URLS.BLOG_POSTS({ 
                    page, 
                    page_size: pageSize, 
                    is_published: true 
                }),
                {
                    headers: { accept: "application/json" },
                    signal: controller.signal
                }
            );

            clearTimeout(timeoutId);
            console.log('📡 Réponse API reçue:', response.status);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const result = await response.json();
            console.log('📊 Résultat API:', result);
            console.log('📰 Nombre de posts:', result.data ? result.data.length : 0);

            // Vérifier si l'API retourne des données valides
            if (!result || !result.data) {
                console.warn('⚠️ API retourne des données invalides, utilisation des données de test');
                loadTestData();
                return;
            }

            renderCards(result.data || []);
            totalPages = Math.ceil(result.total_number / pageSize);
            renderPagination(totalPages, page);
        } catch (error) {
            console.error("❌ Erreur lors du chargement des actualités :", error);
            console.log('🔄 Tentative de chargement des données de test...');
            loadTestData();
        }
    }

    // Fonction de données de test
    function loadTestData() {
        console.log('🧪 Chargement des données de test');
        const testData = [
            {
                id: 1,
                title: "Formation AVMJ - Session 2025",
                summary: "Découvrez notre nouveau programme de formation pour les Auxiliaires de Vie en Univers Judiciaire.",
                cover_image: "assets/Images/banner.jpg",
                published_at: "2025-01-15T10:00:00Z",
                category_id: 1
            },
            {
                id: 2,
                title: "Partenariat avec l'Université de Ziguinchor",
                summary: "L'Institut Lafaom-Mao signe un partenariat stratégique avec l'Université de Ziguinchor.",
                cover_image: "assets/Images/banner2.jpg",
                published_at: "2025-01-10T14:30:00Z",
                category_id: 4
            },
            {
                id: 3,
                title: "Certification des AVMJ",
                summary: "Les premiers diplômés de notre programme AVMJ ont reçu leur certification officielle.",
                cover_image: "assets/Images/banner.jpg",
                published_at: "2025-01-05T09:15:00Z",
                category_id: 1
            }
        ];

        renderCards(testData);
        totalPages = 1;
        renderPagination(totalPages, 1);
    }

    function renderCards(posts) {
        console.log('📰 Rendu des cartes:', posts);
        console.log('📦 Conteneur avant:', newsContainer);

        newsContainer.innerHTML = "";
        console.log('🧹 Conteneur vidé');

        if (posts.length === 0) {
            console.log('⚠️ Aucun post trouvé');
            // Enlever display: flex du conteneur des cartes
            newsContainer.style.display = 'block';
            newsContainer.innerHTML = `
                <div class="no-news-message">
                    <span class="no-news-icon">📰</span>
                    <h3>Pas d'actualité disponible</h3>
                    <p>Aucune actualité n'est disponible pour le moment. Revenez bientôt pour découvrir nos dernières nouvelles.</p>
                </div>
            `;
            return;
        }

        // Restaurer display: flex quand il y a des actualités
        newsContainer.style.display = 'flex';
        
        posts.forEach((post, index) => {
            console.log(`📄 Création carte ${index + 1}:`, post.title);

            const category = getCategoryName(post.category_id);
            const date = post.published_at
                ? new Date(post.published_at).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" })
                : "";

            const li = document.createElement("li");
            li.className = "cards_item";
            li.setAttribute("data-category", category.toLowerCase());

            li.innerHTML = `
                <div class="news-card">
                    <div class="card_image">
                        <span class="note">${category}</span>
                        <img src="${post.cover_image}" alt="${post.title}" onerror="this.src='assets/Images/banner.jpg'">
                        <span class="card_price">${date}</span>
                    </div>
                    <div class="card_content">
                        <h2 class="card_title">${post.title}</h2>
                        <div class="card_text">
                            <p>${post.summary ?? ""}</p>
                            <hr />
                        </div>
                    </div>
                </div>
            `;

            console.log(`➕ Ajout de la carte ${index + 1} au conteneur`);
            newsContainer.appendChild(li);
        });

        // Animation d'apparition des cartes
        setTimeout(() => {
            const cards = newsContainer.querySelectorAll('.cards_item');
            cards.forEach((card, index) => {
                card.style.animation = 'fadeIn 0.5s ease-in-out';
            });
        }, 100);

        filterCards(currentCategory);
    }

    function showErrorState() {
        // Enlever display: flex du conteneur des cartes
        newsContainer.style.display = 'block';
        newsContainer.innerHTML = `
            <div class="no-news-message">
                <span class="no-news-icon">⚠️</span>
                <h3>Erreur de chargement</h3>
                <p>Impossible de charger les actualités. Veuillez réessayer plus tard.</p>
            </div>
        `;
    }

    // API Configuration
    const API_BASE_URL = CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.BLOG.BASE;

    // Load categories from API
    async function loadCategories() {
        try {
            // Show loading state
            if (filterSelect) {
                filterSelect.innerHTML = '<option value="all" selected>Toutes</option><option value="loading" disabled>Chargement des catégories...</option>';
                filterSelect.disabled = true;
            }

            const response = await fetch(`${API_BASE_URL}/categories`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();

            if (data.success && data.data && data.data.length > 0) {
                populateCategorySelect(data.data);
                return data.data;
            } else {
                console.warn('Aucune catégorie trouvée dans la réponse API');
                return loadFallbackCategories();
            }
        } catch (error) {
            console.error('Erreur lors du chargement des catégories:', error);
            return loadFallbackCategories();
        } finally {
            // Re-enable select
            if (filterSelect) {
                filterSelect.disabled = false;
            }
        }
    }

    // Populate category select with API data
    function populateCategorySelect(categories) {
        if (!filterSelect) return;

        // Clear existing options including loading state
        filterSelect.innerHTML = '<option value="all" selected>Toutes</option>';

        // Sort categories by title alphabetically
        const sortedCategories = categories.sort((a, b) => {
            return a.title.localeCompare(b.title, 'fr', { sensitivity: 'base' });
        });

        // Add categories to select
        sortedCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.slug;
            option.textContent = category.title;
            option.setAttribute('data-category-id', category.id);
            filterSelect.appendChild(option);
        });

        // Add visual feedback
        filterSelect.classList.add('success');
        setTimeout(() => {
            filterSelect.classList.remove('success');
        }, 2000);

        // Show success notification
        showNotification(`${sortedCategories.length} catégories chargées avec succès`, 'success');

        console.log('Catégories chargées depuis l\'API:', sortedCategories);
    }

    // Fallback categories if API fails
    function loadFallbackCategories() {
        if (!filterSelect) return;

        const fallbackCategories = [
            { id: 1, slug: 'formation', title: 'Formation' },
            { id: 2, slug: 'accompagnement', title: 'Accompagnement' },
            { id: 3, slug: 'reinsertion', title: 'Réinsertion' },
            { id: 4, slug: 'partenariat', title: 'Partenariat' }
        ];

        populateCategorySelect(fallbackCategories);

        // Show fallback notification
        showNotification('Catégories de secours chargées', 'warning');
        console.log('Catégories de secours chargées');
        return fallbackCategories;
    }

    // Show notification to user
    function showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `category-notification category-notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-message">${message}</span>
                <button class="notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Add to page
        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    function getCategoryName(categoryId) {
        // Try to get from loaded categories first
        const categorySelect = document.getElementById('categorySelect');
        if (categorySelect) {
            const option = categorySelect.querySelector(`option[data-category-id="${categoryId}"]`);
            if (option) {
                return option.textContent;
            }
        }

        // Fallback to hardcoded mapping
        switch (categoryId) {
            case 1: return "Formation";
            case 2: return "Accompagnement";
            case 3: return "Réinsertion";
            case 4: return "Partenariat";
            default: return "Autre";
        }
    }

    function filterCards(category) {
        currentCategory = category;
        const cards = newsContainer.querySelectorAll('.cards_item');
        cards.forEach(card => {
            const cardCategory = (card.getAttribute('data-category') || '').toLowerCase();
            if (category === 'all' || cardCategory === category) {
                card.style.display = 'flex';
                card.style.opacity = '1';
                card.style.visibility = 'visible';
                card.style.animation = 'fadeIn 0.3s ease';
            } else {
                card.style.display = 'none';
            }
        });
    }

    if (filterSelect) {
        filterSelect.addEventListener('change', function () {
            filterCards(this.value);
        });
    }

    function renderPagination(totalPages, currentPage) {
        paginationContainer.innerHTML = "";
        for (let i = 1; i <= totalPages; i++) {
            const span = document.createElement("span");
            span.className = "pagination-number" + (i === currentPage ? " active" : "");
            span.textContent = i;
            span.addEventListener("click", async function () {
                currentPage = i;
                await loadNews(currentPage);
            });
            paginationContainer.appendChild(span);
        }
    }


    // Load categories from API when page loads
    await loadCategories();

    // Load news
    await loadNews(currentPage);
});

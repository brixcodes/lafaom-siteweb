// Dashboard JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    if (!authManager.requireAuth()) {
        return;
    }
    
    // Initialize dashboard
    initializeDashboard();
    loadUserData();
    setupEventListeners();
});

// Initialize dashboard components
function initializeDashboard() {
    console.log('Dashboard initialized');
    
    // Check if user is logged in
    const userData = localStorage.getItem('userData');
    if (userData) {
        // Parse user data
        const user = JSON.parse(userData);
        updateUserInfo(user);
    } else {
        // Use default user info for testing
        updateUserInfo({ name: 'Utilisateur Test' });
    }
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

// Load user data and stats
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

// Alternative API for user data (if the first one doesn't work)
async function loadUserDataAlternative() {
    try {
        // Try alternative API endpoint
        const response = await fetch('https://lafaom.vertex-cam.com/api/v1/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const userData = await response.json();
            updateUserInfo(userData);
            updateStats(userData);
            return true;
        }
        return false;
    } catch (error) {
        console.warn('Alternative API not available:', error);
        return false;
    }
}

// Load mock user data
function loadMockUserData() {
    const userData = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        applications: 5,
        accepted: 2,
        pending: 2,
        formations: 3
    };
    
    updateUserInfo(userData);
    updateStats(userData);
}

// Update user data (simplified)
function updateStats(data) {
    // No statistics to update anymore
    console.log('User data updated:', data);
}

// Load news from API
async function loadNews() {
    try {
        const response = await fetch('https://lafaom.vertex-cam.com/api/v1/blog/posts');
        if (response.ok) {
            const data = await response.json();
            displayNews(data.data || data);
        } else {
            console.error('Failed to load news');
            displayMockNews();
        }
    } catch (error) {
        console.error('Error loading news:', error);
        displayMockNews();
    }
}

// Display news articles
function displayNews(news) {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    // Limit to 6 articles
    const limitedNews = news.slice(0, 6);
    
    newsGrid.innerHTML = limitedNews.map(article => `
        <div class="news-card">
            <div class="news-image">
                <img src="${article.image || 'assets/Images/banner.jpg'}" alt="${article.title}" onerror="this.src='assets/Images/banner.jpg'">
            </div>
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-excerpt">${stripHtml(article.content || article.excerpt || '').substring(0, 100)}...</p>
                <div class="news-meta">
                    <span class="news-date">${formatDate(article.created_at || article.published_at)}</span>
                    <a href="actualite.html" class="news-link">Lire plus</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Display mock news if API fails
function displayMockNews() {
    const newsGrid = document.getElementById('newsGrid');
    if (!newsGrid) return;
    
    const mockNews = [
        {
            title: "Nouvelle session de formation",
            content: "Découvrez nos nouvelles formations en développement web et marketing digital.",
            image: "assets/Images/banner.jpg",
            date: new Date().toISOString()
        },
        {
            title: "Recrutement ouvert",
            content: "Nous recherchons des formateurs qualifiés pour nos programmes de formation.",
            image: "assets/Images/banner.jpg",
            date: new Date().toISOString()
        },
        {
            title: "Événement spécial",
            content: "Participez à notre journée portes ouvertes le 15 décembre prochain.",
            image: "assets/Images/banner.jpg",
            date: new Date().toISOString()
        }
    ];
    
    newsGrid.innerHTML = mockNews.map(article => `
        <div class="news-card">
            <div class="news-image">
                <img src="${article.image}" alt="${article.title}">
            </div>
            <div class="news-content">
                <h3 class="news-title">${article.title}</h3>
                <p class="news-excerpt">${article.content}</p>
                <div class="news-meta">
                    <span class="news-date">${formatDate(article.date)}</span>
                    <a href="actualite.html" class="news-link">Lire plus</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Setup event listeners
function setupEventListeners() {
    // User dropdown
    const userAvatarContainer = document.getElementById('userAvatarContainer');
    const userDropdown = document.getElementById('userDropdown');
    
    if (userAvatarContainer && userDropdown) {
        userAvatarContainer.addEventListener('click', (e) => {
            e.stopPropagation();
            userDropdown.classList.toggle('show');
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', (e) => {
            if (!userAvatarContainer.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.remove('show');
            }
        });
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Mobile menu (burger menu) - Keep existing functionality
    const burger = document.getElementById('burger');
    const menu = document.getElementById('menu');
    const overlay = document.querySelector('.overlay');
    
    if (burger && menu && overlay) {
        burger.addEventListener('click', () => {
            menu.classList.toggle('active');
            overlay.classList.toggle('active');
        });
        
        overlay.addEventListener('click', () => {
            menu.classList.remove('active');
            overlay.classList.remove('active');
        });
    }
}

// Handle logout
function handleLogout() {
    // Use auth manager logout
    authManager.logout();
}

// Utility functions
function stripHtml(html) {
    const tmp = document.createElement('div');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Add news card styles
const newsCardStyles = `
.news-card {
    background: var(--color-white);
    border-radius: 12px;
    box-shadow: var(--shadow-medium);
    overflow: hidden;
    transition: all 0.3s ease;
}

.news-card:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-large);
}

.news-image {
    width: 100%;
    height: 200px;
    overflow: hidden;
}

.news-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.news-content {
    padding: 1.5rem;
}

.news-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-gray-800);
    margin-bottom: 0.75rem;
    line-height: 1.4;
}

.news-excerpt {
    color: var(--color-gray-600);
    line-height: 1.6;
    margin-bottom: 1rem;
}

.news-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.news-date {
    font-size: 0.9rem;
    color: var(--color-gray-500);
}

.news-link {
    color: var(--color-primary);
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s ease;
}

.news-link:hover {
    color: var(--color-primary-dark);
}
`;

// Add styles to head
const styleSheet = document.createElement('style');
styleSheet.textContent = newsCardStyles;
document.head.appendChild(styleSheet);

// Dashboard functions for candidatures and reclamations
function initializeReclamations() {
    console.log('Réclamations section initialized');
    // Add any specific functionality for reclamations here
}

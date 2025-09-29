// Initialize the required DOM elements
const navbarMenu = document.getElementById("menu");
const burgerMenu = document.getElementById("burger");
const headerMenu = document.getElementById("header");
const bgOverlay = document.querySelector(".overlay");

// Slider elements
const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const prevBtn = document.getElementById("prevSlide");
const nextBtn = document.getElementById("nextSlide");
const Menulink = document.querySelectorAll('.menu-link');

let currentSlide = 0;
const totalSlides = slides.length;

// Initialize hide navbar menu function
const toggleNavbarMenu = () => {
    navbarMenu.classList.toggle("is-active");
    burgerMenu.classList.toggle("is-active");
    bgOverlay.classList.toggle("is-active");

    // Prevent body scroll when menu is open
    if (navbarMenu.classList.contains("is-active")) {
        document.body.style.overflow = "hidden";
    } else {
        document.body.style.overflow = "";
    }
};

// Show hide toggle navbar menu on clicked
burgerMenu.addEventListener("click", () => {
    toggleNavbarMenu();
});

// Hide the navbar menu when overlay clicked
bgOverlay.addEventListener("click", () => {
    toggleNavbarMenu();
});

// Hide the navbar menu when links clicked
document.querySelectorAll(".menu").forEach((link) => {
    link.addEventListener("click", () => {
        toggleNavbarMenu();
    });
});

// Change the header background on scrolling
window.addEventListener("scroll", () => {
    if (window.scrollY >= 75) {
        headerMenu.style.background = "#ffffff";
        Menulink.forEach(link => {
            link.style.color = '#E85A7A';
        });
    } else {
        headerMenu.style.background = "transparent";
        Menulink.forEach(link => {
            if (window.innerWidth <= 576) { // Écran mobile (≤ 576px)
                link.style.color = '#E85A7A'; // Rouge pour mobile
            } else if (window.innerWidth <= 768) { // Écran tablette (≤ 768px)
                link.style.color = '#FFFFFF'; // Vert pour tablette
            } else { // Écran ordinateur (> 768px)
                link.style.color = '#FFFFFF'; // Blanc pour ordinateur
            }}
        )
      


    }
});

// Fixed the navbar menu on window resizing
window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
        if (navbarMenu.classList.contains("is-active")) {
            navbarMenu.classList.remove("is-active");
            burgerMenu.classList.remove("is-active");
            bgOverlay.classList.remove("is-active");
        }
    }
});

// Slider functionality
function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach(slide => slide.classList.remove("active"));
    dots.forEach(dot => dot.classList.remove("active"));

    // Add active class to current slide and dot
    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
}

function nextSlide() {
    const next = (currentSlide + 1) % totalSlides;
    showSlide(next);
}

function prevSlide() {
    const prev = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(prev);
}

// Event listeners are now handled in the auto-play section below

// Auto-play slider functionality
let autoPlayInterval;

function startAutoPlay() {
    autoPlayInterval = setInterval(nextSlide, 4000); // Change slide every 4 seconds
}

function stopAutoPlay() {
    clearInterval(autoPlayInterval);
}

function restartAutoPlay() {
    stopAutoPlay();
    startAutoPlay();
}

// Start auto-play when page loads
document.addEventListener("DOMContentLoaded", () => {
    startAutoPlay();
});

// Pause auto-play on hover and restart when mouse leaves
const sliderContainer = document.querySelector(".slider-container");
if (sliderContainer) {
    sliderContainer.addEventListener("mouseenter", stopAutoPlay);
    sliderContainer.addEventListener("mouseleave", startAutoPlay);
}

// Restart auto-play when user interacts with slider
function handleUserInteraction() {
    restartAutoPlay();
}

// Add event listeners with auto-play restart
if (nextBtn) nextBtn.addEventListener("click", () => {
    nextSlide();
    handleUserInteraction();
});

if (prevBtn) prevBtn.addEventListener("click", () => {
    prevSlide();
    handleUserInteraction();
});

// Event listeners for dots with auto-play restart
dots.forEach((dot, index) => {
    dot.addEventListener("click", () => {
        showSlide(index);
        handleUserInteraction();
    });
});

// Keyboard navigation with auto-play restart
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        prevSlide();
        handleUserInteraction();
    } else if (e.key === "ArrowRight") {
        nextSlide();
        handleUserInteraction();
    }
});

// Pause auto-play when page is not visible
document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        stopAutoPlay();
    } else {
        startAutoPlay();
    }
});
// Video Modal functionality
const videoModal = document.getElementById("videoModal");
const playVideoBtn = document.getElementById("playVideoBtn");
const closeVideoModal = document.getElementById("closeVideoModal");
const videoModalOverlay = document.getElementById("videoModalOverlay");
const videoFrame = document.getElementById("videoFrame");

// Video URL - You can replace this with your actual video URL
const videoUrl = "https://youtu.be/zEAX0EJkjIg?si=sLhTX49qUtER2Oom";

// Open video modal
function openVideoModal() {
    videoModal.classList.add("active");
    videoFrame.src = videoUrl;
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Close video modal
function closeVideoModalFunc() {
    videoModal.classList.remove("active");
    videoFrame.src = ""; // Stop video playback
    document.body.style.overflow = ""; // Restore scrolling
}

// Event listeners for video modal
if (playVideoBtn) {
    playVideoBtn.addEventListener("click", openVideoModal);
}

if (closeVideoModal) {
    closeVideoModal.addEventListener("click", closeVideoModalFunc);
}

if (videoModalOverlay) {
    videoModalOverlay.addEventListener("click", closeVideoModalFunc);
}

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && videoModal.classList.contains("active")) {
        closeVideoModalFunc();
    }
});

// Prevent modal content click from closing modal
document.querySelector(".video-modal-content")?.addEventListener("click", (e) => {
    e.stopPropagation();
});

// Counter animation for stats
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16); // 60fps


    // Add animation classes
    element.classList.add('counting', 'animating');

    function updateCounter() {
        start += increment;
        if (start < target) {
            element.textContent = Math.floor(start);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
            // Remove animation classes when done
            element.classList.remove('counting', 'animating');
         
        }
    }

    updateCounter();
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {

            // Try both selectors to be sure
            let statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
            if (statNumbers.length === 0) {
                statNumbers = entry.target.querySelectorAll('.stat-number');
            }

        

            statNumbers.forEach((statNumber, index) => {
                // Get target from data attribute or text content
                let targetValue = statNumber.getAttribute('data-target');
                if (!targetValue) {
                    targetValue = statNumber.textContent;
                }
                targetValue = parseInt(targetValue);

               

                // Set initial value to 0
                statNumber.textContent = '0';

                // Delay animation slightly for each number
                setTimeout(() => {
                    animateCounter(statNumber, targetValue, 2000);
                }, index * 500);
            });

            // Only animate once
            statsObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.1 // Lower threshold to trigger earlier
});

// Start observing the stats section when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, looking for stats section...'); // Debug log

    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        console.log('Stats section found, starting observer'); // Debug log
        statsObserver.observe(statsSection);
    } else {
        console.log('Stats section not found!'); // Debug log
    }

    // Alternative: trigger animation after a delay for testing
    setTimeout(() => {
        const statNumbers = document.querySelectorAll('.stat-number');
        console.log(`Manual trigger: found ${statNumbers.length} elements`);

        if (statNumbers.length > 0) {
            statNumbers.forEach((statNumber, index) => {
                let targetValue = statNumber.getAttribute('data-target') || statNumber.textContent;
                targetValue = parseInt(targetValue);

                if (targetValue > 0) {
                    statNumber.textContent = '0';
                    setTimeout(() => {
                        animateCounter(statNumber, targetValue, 2000);
                    }, index * 500);
                }
            });
        }
    }, 3000); // Trigger after 3 seconds for testing
});
// Cookie Management System
class CookieManager {
    constructor() {
        this.cookieName = 'lafaom_cookie_consent';
        this.cookieExpiry = 365; // jours
        this.analyticsEnabled = false;
        this.marketingEnabled = false;
        this.preferencesEnabled = false;
        
        this.init();
    }

    init() {
        // Vérifier si l'utilisateur a déjà donné son consentement
        const consent = this.getCookieConsent();
        
        if (!consent) {
            // Afficher le bouton cookie après un délai
            setTimeout(() => {
                this.showCookieButton();
            }, 2000);
        } else {
            // Appliquer les préférences existantes
            this.applyConsent(consent);
        }

        this.bindEvents();
    }

    bindEvents() {
const btn = document.getElementById("cookie-btn");
const modal = document.getElementById("cookie-modal");
const refuse = document.getElementById("btn-refuse");
const choose = document.getElementById("btn-choose");
const accept = document.getElementById("btn-accept");

        if (btn) {
            btn.onclick = () => this.showModal();
        }

        if (refuse) {
            refuse.onclick = () => this.handleRefuse();
        }

        if (choose) {
            choose.onclick = () => this.showCustomOptions();
        }

        if (accept) {
            accept.onclick = () => this.handleAccept();
        }

// Fermer modal si on clique dehors
        if (modal) {
window.onclick = (e) => {
                if (e.target === modal) {
                    this.hideModal();
                }
            }
        }

        // Gestion des options personnalisées
        this.bindCustomOptions();
    }

    showCookieButton() {
        const btn = document.getElementById("cookie-btn");
        if (btn) {
            // btn.style.display = "block";
            btn.style.animation = "slideInUp 0.5s ease-out";
        }
    }

    showModal() {
        const modal = document.getElementById("cookie-modal");
        if (modal) {
            modal.style.display = "block";
            document.body.style.overflow = "hidden";
            
            // Animation d'entrée
            setTimeout(() => {
                modal.classList.add("show");
            }, 10);
        }
    }

    hideModal() {
        const modal = document.getElementById("cookie-modal");
        if (modal) {
            modal.classList.remove("show");
            setTimeout(() => {
                modal.style.display = "none";
                document.body.style.overflow = "auto";
            }, 300);
        }
    }

    handleRefuse() {
        const consent = {
            necessary: true,
            analytics: false,
            marketing: false,
            preferences: false,
            timestamp: new Date().toISOString()
        };

        this.saveCookieConsent(consent);
        this.applyConsent(consent);
        this.hideModal();
        this.hideCookieButton();
        
        this.showNotification("Cookies refusés", "Seuls les cookies nécessaires sont utilisés.");
    }

    handleAccept() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
            timestamp: new Date().toISOString()
        };

        this.saveCookieConsent(consent);
        this.applyConsent(consent);
        this.hideModal();
        this.hideCookieButton();
        
        this.showNotification("Cookies acceptés", "Tous les cookies sont maintenant activés.");
    }

    showCustomOptions() {
        // Créer ou afficher les options personnalisées
        let customModal = document.getElementById("custom-cookie-modal");
        
        if (!customModal) {
            customModal = this.createCustomOptionsModal();
            document.body.appendChild(customModal);
        }
        
        customModal.style.display = "block";
        this.hideModal();
    }

    createCustomOptionsModal() {
        const modal = document.createElement('div');
        modal.id = "custom-cookie-modal";
        modal.className = "cookie-modal";
        
        modal.innerHTML = `
            <div class="cookie-content custom-options">
                <div class="cookie-header">
                    <h2>Personnaliser vos préférences</h2>
                    <button class="close-btn" onclick="this.closest('.cookie-modal').style.display='none'">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="cookie-options">
                    <div class="cookie-option">
                        <div class="option-header">
                            <h3>Cookies nécessaires</h3>
                            <label class="switch">
                                <input type="checkbox" checked disabled>
                                <span class="slider"></span>
                            </label>
                        </div>
                        <p>Ces cookies sont essentiels au fonctionnement du site et ne peuvent pas être désactivés.</p>
                    </div>
                    
                    <div class="cookie-option">
                        <div class="option-header">
                            <h3>Cookies d'analyse</h3>
                            <label class="switch">
                                <input type="checkbox" id="analytics-toggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <p>Ces cookies nous aident à comprendre comment vous utilisez notre site.</p>
                    </div>
                    
                    <div class="cookie-option">
                        <div class="option-header">
                            <h3>Cookies marketing</h3>
                            <label class="switch">
                                <input type="checkbox" id="marketing-toggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <p>Ces cookies sont utilisés pour vous proposer des publicités personnalisées.</p>
                    </div>
                    
                    <div class="cookie-option">
                        <div class="option-header">
                            <h3>Cookies de préférences</h3>
                            <label class="switch">
                                <input type="checkbox" id="preferences-toggle">
                                <span class="slider"></span>
                            </label>
                        </div>
                        <p>Ces cookies mémorisent vos préférences et paramètres.</p>
                    </div>
                </div>
                
                <div class="cookie-actions">
                    <button class="btn" onclick="cookieManager.saveCustomPreferences()">Sauvegarder</button>
                    <button class="btn accept" onclick="cookieManager.acceptAllCustom()">Tout accepter</button>
                </div>
            </div>
        `;
        
        return modal;
    }

    bindCustomOptions() {
        // Les événements pour les options personnalisées seront liés dynamiquement
    }

    saveCustomPreferences() {
        const analytics = document.getElementById("analytics-toggle")?.checked || false;
        const marketing = document.getElementById("marketing-toggle")?.checked || false;
        const preferences = document.getElementById("preferences-toggle")?.checked || false;

        const consent = {
            necessary: true,
            analytics: analytics,
            marketing: marketing,
            preferences: preferences,
            timestamp: new Date().toISOString()
        };

        this.saveCookieConsent(consent);
        this.applyConsent(consent);
        
        const customModal = document.getElementById("custom-cookie-modal");
        if (customModal) {
            customModal.style.display = "none";
        }
        
        this.hideCookieButton();
        this.showNotification("Préférences sauvegardées", "Vos choix ont été enregistrés.");
    }

    acceptAllCustom() {
        const consent = {
            necessary: true,
            analytics: true,
            marketing: true,
            preferences: true,
            timestamp: new Date().toISOString()
        };

        this.saveCookieConsent(consent);
        this.applyConsent(consent);
        
        const customModal = document.getElementById("custom-cookie-modal");
        if (customModal) {
            customModal.style.display = "none";
        }
        
        this.hideCookieButton();
        this.showNotification("Tous les cookies acceptés", "Toutes les fonctionnalités sont maintenant activées.");
    }

    saveCookieConsent(consent) {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + this.cookieExpiry);
        
        const cookieValue = JSON.stringify(consent);
        document.cookie = `${this.cookieName}=${cookieValue}; expires=${expiryDate.toUTCString()}; path=/; SameSite=Lax`;
        
        // Sauvegarder aussi dans localStorage pour plus de fiabilité
        localStorage.setItem(this.cookieName, cookieValue);
    }

    getCookieConsent() {
        // Essayer d'abord les cookies
        const cookies = document.cookie.split(';');
        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            if (name === this.cookieName) {
                try {
                    return JSON.parse(decodeURIComponent(value));
                } catch (e) {
                    console.error('Erreur lors du parsing du cookie:', e);
                }
            }
        }
        
        // Fallback sur localStorage
        const stored = localStorage.getItem(this.cookieName);
        if (stored) {
            try {
                return JSON.parse(stored);
            } catch (e) {
                console.error('Erreur lors du parsing du localStorage:', e);
            }
        }
        
        return null;
    }

    applyConsent(consent) {
        this.analyticsEnabled = consent.analytics;
        this.marketingEnabled = consent.marketing;
        this.preferencesEnabled = consent.preferences;

        // Activer/désactiver Google Analytics
        if (consent.analytics) {
            this.enableAnalytics();
        } else {
            this.disableAnalytics();
        }

        // Activer/désactiver les cookies marketing
        if (consent.marketing) {
            this.enableMarketing();
        } else {
            this.disableMarketing();
        }

        // Activer/désactiver les préférences
        if (consent.preferences) {
            this.enablePreferences();
        } else {
            this.disablePreferences();
        }
    }

    enableAnalytics() {
        // Code pour activer Google Analytics ou autres outils d'analyse
        console.log('Analytics activés');
        // Exemple: gtag('consent', 'update', {'analytics_storage': 'granted'});
    }

    disableAnalytics() {
        // Code pour désactiver Google Analytics
        console.log('Analytics désactivés');
        // Exemple: gtag('consent', 'update', {'analytics_storage': 'denied'});
    }

    enableMarketing() {
        // Code pour activer les cookies marketing
        console.log('Marketing activé');
    }

    disableMarketing() {
        // Code pour désactiver les cookies marketing
        console.log('Marketing désactivé');
    }

    enablePreferences() {
        // Code pour activer les préférences
        console.log('Préférences activées');
    }

    disablePreferences() {
        // Code pour désactiver les préférences
        console.log('Préférences désactivées');
    }

    hideCookieButton() {
        const btn = document.getElementById("cookie-btn");
        if (btn) {
            btn.style.display = "none";
        }
    }

    showNotification(title, message) {
        // Créer une notification toast
        const notification = document.createElement('div');
        notification.className = 'cookie-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
            <button class="notification-close" onclick="this.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        document.body.appendChild(notification);
        
        // Animation d'entrée
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);
        
        // Auto-suppression après 5 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }, 5000);
    }

    // Méthode publique pour réinitialiser les cookies
    resetCookies() {
        document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
        localStorage.removeItem(this.cookieName);
        location.reload();
    }
}

// Initialiser le gestionnaire de cookies
document.addEventListener('DOMContentLoaded', () => {
    window.cookieManager = new CookieManager();
});
document.addEventListener("DOMContentLoaded", () => {
    const offcanvas = document.getElementById("mission-offcanvas");
    const offcanvasOverlay = offcanvas.querySelector(".offcanvas-overlay");
    const offcanvasClose = offcanvas.querySelector(".offcanvas-close");
    const offcanvasTitle = document.getElementById("offcanvas-title");
    const offcanvasText = document.getElementById("offcanvas-text");
  
    document.querySelectorAll(".mission-card-btn").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const title = btn.getAttribute("data-title");
        const content = btn.getAttribute("data-content");
  
        offcanvasTitle.textContent = title;
        offcanvasText.innerHTML = content; // ⚡ Injection de contenu riche
  
        offcanvas.classList.add("active");
        offcanvasOverlay.classList.add("active");
      });
    });
  
    [offcanvasClose, offcanvasOverlay].forEach(el => {
      el.addEventListener("click", () => {
        offcanvas.classList.remove("active");
        offcanvasOverlay.classList.remove("active");
      });
    });
  });
  
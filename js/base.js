// JavaScript commun à toutes les pages
document.addEventListener('DOMContentLoaded', function() {
    // Initialize the required DOM elements
    const navbarMenu = document.getElementById("menu");
    const burgerMenu = document.getElementById("burger");
    const headerMenu = document.getElementById("header");
    const bgOverlay = document.querySelector(".overlay");
    const Menulink = document.querySelectorAll('.menu-link');

    // Initialize hide navbar menu function
    const toggleNavbarMenu = () => {
        if (navbarMenu && burgerMenu && bgOverlay) {
            navbarMenu.classList.toggle("is-active");
            burgerMenu.classList.toggle("is-active");
            bgOverlay.classList.toggle("is-active");

            // Prevent body scroll when menu is open
            if (navbarMenu.classList.contains("is-active")) {
                document.body.style.overflow = "hidden";
            } else {
                document.body.style.overflow = "";
            }
        }
    };

    // Show hide toggle navbar menu on clicked
    if (burgerMenu) {
        burgerMenu.addEventListener("click", () => {
            toggleNavbarMenu();
        });
    }

    // Hide the navbar menu when overlay clicked
    if (bgOverlay) {
        bgOverlay.addEventListener("click", () => {
            toggleNavbarMenu();
        });
    }

    // Hide the navbar menu when links clicked
    document.querySelectorAll(".menu").forEach((link) => {
        if (link) {
            link.addEventListener("click", () => {
                toggleNavbarMenu();
            });
        }
    });

    // Change the header background on scrolling
    window.addEventListener("scroll", () => {
        if (headerMenu && Menulink) {
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
                    }
                });
            }
        }
    });

    // Fixed the navbar menu on window resizing
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) {
            if (navbarMenu && burgerMenu && bgOverlay && navbarMenu.classList.contains("is-active")) {
                navbarMenu.classList.remove("is-active");
                burgerMenu.classList.remove("is-active");
                bgOverlay.classList.remove("is-active");
            }
        }
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
            const consent = this.getCookieConsent();

            if (!consent) {
                setTimeout(() => {
                    this.showCookieButton();
                }, 2000);
            } else {
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

            if (modal) {
                window.onclick = (e) => {
                    if (e.target === modal) {
                        this.hideModal();
                    }
                };
            }

            this.bindCustomOptions();
        }

        showCookieButton() {
            const btn = document.getElementById("cookie-btn");
            if (btn) {
                btn.style.display = "block";
                btn.style.animation = "slideInUp 0.5s ease-out";
            }
        }

        showModal() {
            const modal = document.getElementById("cookie-modal");
            if (modal) {
                modal.style.display = "block";
                document.body.style.overflow = "hidden";

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
            // Events for custom options will be bound dynamically
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
            localStorage.setItem(this.cookieName, cookieValue);
        }

        getCookieConsent() {
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

            if (consent.analytics) {
                this.enableAnalytics();
            } else {
                this.disableAnalytics();
            }
            if (consent.marketing) {
                this.enableMarketing();
            } else {
                this.disableMarketing();
            }
            if (consent.preferences) {
                this.enablePreferences();
            } else {
                this.disablePreferences();
            }
        }

        enableAnalytics() { console.log('Analytics activés'); }
        disableAnalytics() { console.log('Analytics désactivés'); }
        enableMarketing() { console.log('Marketing activé'); }
        disableMarketing() { console.log('Marketing désactivé'); }
        enablePreferences() { console.log('Préférences activées'); }
        disablePreferences() { console.log('Préférences désactivées'); }

        hideCookieButton() {
            const btn = document.getElementById("cookie-btn");
            if (btn) {
                btn.style.display = "none";
            }
        }

        showNotification(title, message) {
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
            setTimeout(() => { notification.classList.add('show'); }, 100);
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => { if (notification.parentElement) { notification.remove(); } }, 300);
            }, 5000);
        }

        resetCookies() {
            document.cookie = `${this.cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
            localStorage.removeItem(this.cookieName);
            location.reload();
        }
    }

    // Initialize cookie manager
    window.cookieManager = new CookieManager();
});

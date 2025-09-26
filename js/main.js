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
            link.style.color = '#FFFFFF';
        });


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
const videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&rel=0";

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

    console.log(`Starting animation for ${target}`); // Debug log

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
            console.log(`Animation completed for ${target}`); // Debug log
        }
    }

    updateCounter();
}

// Intersection Observer for stats animation
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            console.log('Stats section is visible!'); // Debug log

            // Try both selectors to be sure
            let statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
            if (statNumbers.length === 0) {
                statNumbers = entry.target.querySelectorAll('.stat-number');
            }

            console.log(`Found ${statNumbers.length} stat numbers`); // Debug log

            statNumbers.forEach((statNumber, index) => {
                // Get target from data attribute or text content
                let targetValue = statNumber.getAttribute('data-target');
                if (!targetValue) {
                    targetValue = statNumber.textContent;
                }
                targetValue = parseInt(targetValue);

                console.log(`Target value: ${targetValue}`); // Debug log

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
document.addEventListener('DOMContentLoaded', () => {
const btn = document.getElementById("cookie-btn");
const modal = document.getElementById("cookie-modal");
const refuse = document.getElementById("btn-refuse");
const choose = document.getElementById("btn-choose");
const accept = document.getElementById("btn-accept");

// Ouvrir modal
btn.onclick = () => modal.style.display = "block";

// Fermer modal si on clique dehors
window.onclick = (e) => {
  if (e.target == modal) modal.style.display = "none";
}

// Gestion des boutons
refuse.onclick = () => { modal.style.display = "none"; alert("Cookies refusés"); }
choose.onclick = () => { alert("Ouvrir options personnalisées"); }
accept.onclick = () => { modal.style.display = "none"; alert("Cookies acceptés"); }
})
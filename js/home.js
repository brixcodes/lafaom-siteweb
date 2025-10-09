// JavaScript spécifique à la page d'accueil
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 Initialisation de la page d\'accueil');

    // Slider elements
    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");
    const prevBtn = document.getElementById("prevSlide");
    const nextBtn = document.getElementById("nextSlide");
    const sliderContainer = document.querySelector(".slider-container");

    let currentSlide = 0;
    const totalSlides = slides.length;

    if (slides.length > 0) {
        showSlide(currentSlide); // Initialize first slide
    } else {
        console.warn('⚠️ Aucun slide trouvé pour le carrousel.');
    }

    function showSlide(index) {
        if (slides.length === 0) return;
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

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

    let autoPlayInterval;

    function startAutoPlay() {
        if (slides.length > 1) { // Only auto-play if there's more than one slide
            autoPlayInterval = setInterval(nextSlide, 4000);
        }
    }

    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }

    function restartAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    startAutoPlay(); // Start auto-play when page loads

    if (sliderContainer) {
        sliderContainer.addEventListener("mouseenter", stopAutoPlay);
        sliderContainer.addEventListener("mouseleave", startAutoPlay);
    }

    function handleUserInteraction() {
        restartAutoPlay();
    }

    if (nextBtn) nextBtn.addEventListener("click", () => {
        nextSlide();
        handleUserInteraction();
    });

    if (prevBtn) prevBtn.addEventListener("click", () => {
        prevSlide();
        handleUserInteraction();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener("click", () => {
            showSlide(index);
            handleUserInteraction();
        });
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "ArrowLeft") {
            prevSlide();
            handleUserInteraction();
        } else if (e.key === "ArrowRight") {
            nextSlide();
            handleUserInteraction();
        }
    });

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
    const videoUrl = "assets/videos/video.mp4";

    function openVideoModal() {
        if (videoModal) {
            videoModal.classList.add("active");
            if (videoFrame) {
                videoFrame.currentTime = 0; // Remettre la vidéo au début
                videoFrame.play(); // Lancer la lecture
            }
            document.body.style.overflow = "hidden";
        }
    }

    function closeVideoModalFunc() {
        if (videoModal) {
            videoModal.classList.remove("active");
            if (videoFrame) {
                videoFrame.pause(); // Pause la vidéo
                videoFrame.currentTime = 0; // Remettre au début
            }
            document.body.style.overflow = "";
        }
    }

    if (playVideoBtn) {
        playVideoBtn.addEventListener("click", openVideoModal);
    }

    if (closeVideoModal) {
        closeVideoModal.addEventListener("click", closeVideoModalFunc);
    }

    if (videoModalOverlay) {
        videoModalOverlay.addEventListener("click", closeVideoModalFunc);
    }

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && videoModal && videoModal.classList.contains("active")) {
            closeVideoModalFunc();
        }
    });

    document.querySelector(".video-modal-content")?.addEventListener("click", (e) => {
        e.stopPropagation();
    });

    // Counter animation for stats
    function animateCounter(element, target, duration = 2000) {
        let start = 0;
        const increment = target / (duration / 16);

        element.classList.add('counting', 'animating');

        function updateCounter() {
            start += increment;
            if (start < target) {
                element.textContent = Math.floor(start);
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target;
                element.classList.remove('counting', 'animating');
            }
        }
        updateCounter();
    }

    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                console.log('🎯 Section stats visible, déclenchement de l\'animation');
                
                // Try both selectors to be sure
                let statNumbers = entry.target.querySelectorAll('.stat-number[data-target]');
                if (statNumbers.length === 0) {
                    statNumbers = entry.target.querySelectorAll('.stat-number');
                }

                console.log(`📊 ${statNumbers.length} éléments .stat-number trouvés`);

                statNumbers.forEach((statNumber, index) => {
                    // Get target from data attribute or text content
                    let targetValue = statNumber.getAttribute('data-target');
                    if (!targetValue) {
                        targetValue = statNumber.textContent;
                    }
                    targetValue = parseInt(targetValue);

                    console.log(`🔢 Animation stat ${index + 1}: ${targetValue}`);

                    // Set initial value to 0
                    statNumber.textContent = '0';

                    // Delay animation slightly for each number
                    setTimeout(() => {
                        console.log(`▶️ Démarrage animation stat ${index + 1}`);
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
    console.log('🚀 DOM loaded, looking for stats section...');

    const statsSection = document.querySelector('.stats-section');
    const statNumbers = document.querySelectorAll('.stat-number');

    console.log('📊 Éléments trouvés:', {
        statsSection: !!statsSection,
        statNumbers: statNumbers.length
    });

    if (statsSection) {
        console.log('✅ Stats section found, starting observer');
        statsObserver.observe(statsSection);
    } else {
        console.log('❌ Stats section not found!');
    }

    if (statNumbers.length === 0) {
        console.log('❌ Aucun élément .stat-number trouvé');
    } else {
        console.log(`✅ ${statNumbers.length} éléments .stat-number trouvés`);
    }

    // Alternative: trigger animation after a delay for testing
    setTimeout(() => {
        console.log('🔄 Déclenchement manuel des animations après 3 secondes');
        const statNumbers = document.querySelectorAll('.stat-number');
        console.log(`🔍 Déclenchement manuel: ${statNumbers.length} éléments trouvés`);

        if (statNumbers.length > 0) {
            statNumbers.forEach((statNumber, index) => {
                let targetValue = statNumber.getAttribute('data-target') || statNumber.textContent;
                targetValue = parseInt(targetValue);

                console.log(`🔢 Déclenchement manuel stat ${index + 1}: ${targetValue}`);

                if (targetValue > 0) {
                    statNumber.textContent = '0';
                    setTimeout(() => {
                        console.log(`▶️ Démarrage animation manuelle stat ${index + 1}`);
                        animateCounter(statNumber, targetValue, 2000);
                    }, index * 500);
                }
            });
        } else {
            console.log('❌ Aucun élément .stat-number trouvé pour le déclenchement manuel');
        }
    }, 3000); // Trigger after 3 seconds for testing

    // Animation pour la section Technicien d'assistance
    const formationText = document.querySelector('.formation-text');
    if (formationText) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        observer.observe(formationText);
    }
});

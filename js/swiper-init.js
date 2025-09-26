$(document).ready(function() {
    const swiper = new Swiper('.swiper-container', {
        loop: true,
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        keyboard: {
            enabled: true,
            onlyInViewport: true,
        },
        navigation: {
            nextEl: ".swiper-button-next",
            prevEl: ".swiper-button-prev"
        },
        effect: 'slide',
        slidesPerView: 1,
        spaceBetween: 30,
        speed: 600,
        on: {
            init: function () {
                console.log('Swiper initialized successfully!');
            },
            slideChange: function () {
                console.log('Slide changed to:', this.activeIndex);
            }
        }
    });
});
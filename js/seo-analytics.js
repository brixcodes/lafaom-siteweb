// SEO Analytics and Tracking Script
// Institut de Formation Lafaom-Mao

(function() {
    'use strict';

    // Google Analytics 4 Configuration
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'GA_MEASUREMENT_ID', {
        // Configuration personnalisée pour l'institut
        custom_map: {
            'custom_parameter_1': 'formation_type',
            'custom_parameter_2': 'location',
            'custom_parameter_3': 'program_mao'
        }
    });

    // Track page views with enhanced ecommerce
    function trackPageView() {
        gtag('event', 'page_view', {
            page_title: document.title,
            page_location: window.location.href,
            page_path: window.location.pathname,
            content_group1: 'Institut Lafaom-Mao',
            content_group2: getPageCategory(),
            content_group3: 'Formation AVMJ'
        });
    }

    // Track form submissions
    function trackFormSubmission(formType) {
        gtag('event', 'form_submit', {
            event_category: 'engagement',
            event_label: formType,
            value: 1
        });
    }

    // Track file downloads
    function trackDownload(fileName, fileType) {
        gtag('event', 'file_download', {
            event_category: 'engagement',
            event_label: fileName,
            file_type: fileType,
            value: 1
        });
    }

    // Track video plays
    function trackVideoPlay(videoTitle) {
        gtag('event', 'video_play', {
            event_category: 'engagement',
            event_label: videoTitle,
            value: 1
        });
    }

    // Track external link clicks
    function trackExternalLink(url) {
        gtag('event', 'click', {
            event_category: 'outbound',
            event_label: url,
            transport_type: 'beacon'
        });
    }

    // Get page category for analytics
    function getPageCategory() {
        const path = window.location.pathname;
        if (path === '/' || path === '/index.html') return 'Accueil';
        if (path.includes('about')) return 'À propos';
        if (path.includes('formation')) return 'Formation';
        if (path.includes('recrutement')) return 'Recrutement';
        if (path.includes('actualite')) return 'Actualités';
        return 'Autre';
    }

    // Enhanced tracking for educational content
    function trackEducationalEngagement(action, content) {
        gtag('event', 'educational_engagement', {
            event_category: 'education',
            event_label: action,
            content_type: content,
            value: 1
        });
    }

    // Track search queries (if search functionality exists)
    function trackSearch(query) {
        gtag('event', 'search', {
            event_category: 'engagement',
            event_label: query,
            value: 1
        });
    }

    // Track contact form submissions
    function trackContactForm() {
        gtag('event', 'contact_form_submit', {
            event_category: 'conversion',
            event_label: 'Contact Form',
            value: 1
        });
    }

    // Track application form submissions
    function trackApplicationForm() {
        gtag('event', 'application_form_submit', {
            event_category: 'conversion',
            event_label: 'Application Form',
            value: 1
        });
    }

    // Initialize tracking when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        trackPageView();
        
        // Track form submissions
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            form.addEventListener('submit', function(e) {
                const formType = form.id || form.className || 'unknown';
                trackFormSubmission(formType);
            });
        });

        // Track external links
        const externalLinks = document.querySelectorAll('a[href^="http"]:not([href*="lafaom-mao.org"])');
        externalLinks.forEach(link => {
            link.addEventListener('click', function() {
                trackExternalLink(this.href);
            });
        });

        // Track file downloads
        const downloadLinks = document.querySelectorAll('a[href$=".pdf"], a[href$=".doc"], a[href$=".docx"]');
        downloadLinks.forEach(link => {
            link.addEventListener('click', function() {
                const fileName = this.href.split('/').pop();
                const fileType = fileName.split('.').pop();
                trackDownload(fileName, fileType);
            });
        });

        // Track video interactions
        const videos = document.querySelectorAll('video, iframe[src*="youtube"], iframe[src*="vimeo"]');
        videos.forEach(video => {
            video.addEventListener('play', function() {
                const videoTitle = this.title || this.alt || 'Unknown Video';
                trackVideoPlay(videoTitle);
            });
        });
    });

    // Expose tracking functions globally
    window.LafaomAnalytics = {
        trackFormSubmission,
        trackDownload,
        trackVideoPlay,
        trackExternalLink,
        trackEducationalEngagement,
        trackSearch,
        trackContactForm,
        trackApplicationForm
    };

})();

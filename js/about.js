// JavaScript spécifique à la page about
document.addEventListener("DOMContentLoaded", () => {
    console.log('🚀 Initialisation de la page about');

    const offcanvas = document.getElementById("mission-offcanvas");
    if (!offcanvas) {
        console.log("Offcanvas not found on about page");
        return;
    }

    const offcanvasOverlay = offcanvas.querySelector(".offcanvas-overlay");
    const offcanvasClose = offcanvas.querySelector(".offcanvas-close");
    const offcanvasTitle = document.getElementById("offcanvas-title");
    const offcanvasText = document.getElementById("offcanvas-text");

    console.log("About page offcanvas elements found:", { 
        offcanvas, 
        offcanvasOverlay, 
        offcanvasClose, 
        offcanvasTitle, 
        offcanvasText 
    });

    document.querySelectorAll(".mission-card-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            console.log("Mission card button clicked:", btn);
            const title = btn.getAttribute("data-title");
            const content = btn.getAttribute("data-content");

            console.log("Data extracted for offcanvas:", { title, content });

            if (offcanvasTitle) offcanvasTitle.textContent = title;
            if (offcanvasText) offcanvasText.innerHTML = content;

            offcanvas.classList.add("active");
            if (offcanvasOverlay) offcanvasOverlay.classList.add("active");
            document.body.style.overflow = "hidden"; // Prevent background scrolling
            console.log("Offcanvas should be active now on about page");
        });
    });

    [offcanvasClose, offcanvasOverlay].forEach(el => {
        if (el) {
            el.addEventListener("click", () => {
                console.log("Closing offcanvas on about page");
                offcanvas.classList.remove("active");
                if (offcanvasOverlay) offcanvasOverlay.classList.remove("active");
                document.body.style.overflow = ""; // Restore scrolling
            });
        }
    });
});

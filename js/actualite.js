async function loadNews() {
    const slidesContainer = document.getElementById("news-slides");
    const thumbsContainer = document.getElementById("news-thumbnails");
    const carousel = document.querySelector(".news-carousel");
  
    if (!slidesContainer || !thumbsContainer || !carousel) return;
  
    try {
      const response = await fetch(
        "https://lafaom.vertex-cam.com/api/v1/blog/posts?page=1&page_size=20&is_published=true&order_by=created_at&asc=asc",
        { headers: { accept: "application/json" } }
      );
  
      const result = await response.json();
      const posts = result.data || [];
  
      slidesContainer.innerHTML = "";
      thumbsContainer.innerHTML = "";
  
      // Nettoyer les anciens inputs radio
      carousel.querySelectorAll("input[name='news-slides']").forEach(el => el.remove());
  
      posts.forEach((post, index) => {
        const slideId = `news-slide-${index + 1}`;
  
        // === Créer input radio ===
        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "news-slides";
        radio.id = slideId;
        if (index === 0) radio.checked = true; // premier slide actif
        carousel.insertBefore(radio, slidesContainer);
  
        // === Slide ===
        const li = document.createElement("li");
        li.className = "news-carousel__slide";
        li.innerHTML = `
          <figure>
            <div class="news-image">
              <img src="${post.cover_image}" alt="${post.title}">
            </div>
            <figcaption>
              <h3>${post.title}</h3>
              <p>${post.summary ?? ""}</p>
              <span class="news-date">${new Date(post.published_at).toLocaleDateString("fr-FR", {
                day: "numeric", month: "long", year: "numeric"
              })}</span>
              <a href="actualite.html" class="news-link">
                Voir plus <i class="bx bx-arrow-right"></i>
              </a>
            </figcaption>
          </figure>
        `;
        slidesContainer.appendChild(li);
  
        // === Miniature reliée à l’input ===
        const thumb = document.createElement("li");
        thumb.innerHTML = `
          <label for="${slideId}">
            <img src="${post.cover_image}" alt="${post.title}">
          </label>
        `;
        thumbsContainer.appendChild(thumb);
      });
    } catch (error) {
      console.error("Erreur lors du chargement des actualités :", error);
    }
  }
  
  // Charger après DOM prêt
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", loadNews);
  } else {
    loadNews();
  }
  
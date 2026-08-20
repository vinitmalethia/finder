const track = document.querySelector(".product-track");
const prev = document.querySelector(".carousel-control.prev");
const next = document.querySelector(".carousel-control.next");
const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".site-nav");
const currentPage = window.location.pathname.split("/").pop() || "index.html";
const productModal = document.querySelector(".product-modal");
const modalTitle = document.querySelector("#modal-title");
const modalProducts = document.querySelector(".modal-products");
const modalClose = document.querySelector(".modal-close");
const modalImage = document.querySelector(".modal-image");
const hero = document.querySelector(".hero");
const heroSlides = [...document.querySelectorAll(".hero-slide")];
const heroDots = [...document.querySelectorAll(".hero-dots button")];
let activeHeroSlide = 0;
let heroTimer;

function showHeroSlide(index) {
  if (!heroSlides.length) return;

  activeHeroSlide = (index + heroSlides.length) % heroSlides.length;
  heroSlides.forEach((slide, slideIndex) => {
    slide.classList.toggle("active", slideIndex === activeHeroSlide);
  });
  heroDots.forEach((dot, dotIndex) => {
    dot.classList.toggle("active", dotIndex === activeHeroSlide);
  });
}

function startHeroSlider() {
  if (heroSlides.length < 2) return;
  stopHeroSlider();
  heroTimer = window.setInterval(() => showHeroSlide(activeHeroSlide + 1), 4000);
}

function stopHeroSlider() {
  window.clearInterval(heroTimer);
}

heroDots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    stopHeroSlider();
    showHeroSlide(index);
    startHeroSlider();
  });
});

showHeroSlide(0);
startHeroSlider();

function scrollProducts(direction) {
  if (!track) return;
  const card = track.querySelector(".product-card");
  const distance = card ? card.getBoundingClientRect().width + 20 : 240;
  track.scrollBy({ left: direction * distance, behavior: "smooth" });
}

prev?.addEventListener("click", () => scrollProducts(-1));
next?.addEventListener("click", () => scrollProducts(1));

menuToggle?.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav?.addEventListener("click", (event) => {
  const link = event.target.closest("a");
  if (!link) return;

  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
});

nav?.querySelectorAll("a").forEach((link) => {
  const linkPage = link.getAttribute("href")?.replace("./", "") || "";
  link.classList.toggle("active", linkPage === currentPage);
});

function openProductModal(card) {
  if (!productModal || !modalTitle || !modalProducts) return;

  const category = card.dataset.category || "Product Category";
  const products = (card.dataset.products || "")
    .split(",")
    .map((product) => product.trim())
    .filter(Boolean);

  modalTitle.textContent = category;
  if (modalImage) {
    modalImage.src = card.dataset.image || "";
    modalImage.alt = `${category} category image`;
  }
  modalProducts.innerHTML = products.map((product) => `<li>${product}</li>`).join("");
  productModal.classList.add("open");
  productModal.setAttribute("aria-hidden", "false");
  modalClose?.focus();
}

function closeProductModal() {
  productModal?.classList.remove("open");
  productModal?.setAttribute("aria-hidden", "true");
}

document.querySelectorAll(".product-card[data-category]").forEach((card) => {
  card.addEventListener("click", () => openProductModal(card));
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openProductModal(card);
    }
  });
});

modalClose?.addEventListener("click", closeProductModal);
productModal?.addEventListener("click", (event) => {
  if (event.target === productModal) closeProductModal();
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeProductModal();
});

// Store Product Slider Scroll
document.querySelectorAll(".slider-arrow").forEach((arrow) => {
  arrow.addEventListener("click", () => {
    const targetId = arrow.getAttribute("data-target");
    const track = document.getElementById(targetId);
    if (!track) return;
    const card = track.querySelector(".store-product-card");
    const distance = card ? card.getBoundingClientRect().width + 20 : 240;
    const direction = arrow.classList.contains("prev") ? -1 : 1;
    track.scrollBy({ left: direction * distance, behavior: "smooth" });
  });
});

// Dynamic Scroll Dots for Store Product Tracks (Mobile/Tablet view)
document.querySelectorAll(".store-product-track").forEach((track) => {
  const parent = track.parentElement;
  const dotsContainer = document.createElement("div");
  dotsContainer.className = "store-dots";
  
  const cards = track.querySelectorAll(".store-product-card");
  const dotCount = Math.min(cards.length, 4);
  
  for (let i = 0; i < dotCount; i++) {
    const dot = document.createElement("button");
    dot.type = "button";
    if (i === 0) dot.className = "active";
    dot.addEventListener("click", () => {
      const scrollAmount = (track.scrollWidth - track.clientWidth) * (i / (dotCount - 1));
      track.scrollTo({ left: scrollAmount, behavior: "smooth" });
    });
    dotsContainer.appendChild(dot);
  }
  
  parent.appendChild(dotsContainer);

  track.addEventListener("scroll", () => {
    const maxScroll = track.scrollWidth - track.clientWidth;
    if (maxScroll <= 0) return;
    const scrollPercentage = track.scrollLeft / maxScroll;
    const activeIndex = Math.min(
      Math.round(scrollPercentage * (dotCount - 1)),
      dotCount - 1
    );
    dotsContainer.querySelectorAll("button").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === activeIndex);
    });
  });
});


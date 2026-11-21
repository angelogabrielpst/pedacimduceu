
const menuToggle = document.querySelector(".menu-toggle");
const navMenu = document.querySelector(".nav-menu");

function closeMenu() {
    if (!menuToggle || !navMenu) return;
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
    navMenu.classList.remove("is-open");
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        menuToggle.setAttribute("aria-label", isOpen ? "Abrir menu" : "Fechar menu");
        navMenu.classList.toggle("is-open", !isOpen);
    });

    navMenu.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));
    window.addEventListener("resize", () => {
        if (window.innerWidth >= 768) closeMenu();
    });
}

const modal = document.querySelector(".gallery-modal");
const modalImage = document.querySelector(".modal-image");
const modalCaption = document.querySelector(".modal-caption");
const modalClose = document.querySelector(".modal-close");
const modalPrev = document.querySelector(".modal-prev");
const modalNext = document.querySelector(".modal-next");
const galleryItems = Array.from(document.querySelectorAll(".gallery-item"));
let currentGalleryIndex = 0;
let galleryTrigger = null;

function getGalleryData() {
    return galleryItems.map((item) => {
        const image = item.querySelector("img");
        return {
            src: image.getAttribute("src"),
            alt: image.getAttribute("alt"),
            caption: item.querySelector("span").textContent
        };
    });
}

function showGalleryImage(index) {
    const images = getGalleryData();
    if (!images.length) return;
    currentGalleryIndex = (index + images.length) % images.length;
    modalImage.src = images[currentGalleryIndex].src;
    modalImage.alt = images[currentGalleryIndex].alt;
    modalCaption.textContent = images[currentGalleryIndex].caption;
}

function openGallery(index, trigger) {
    galleryTrigger = trigger;
    showGalleryImage(index);
    modal.hidden = false;
    document.body.classList.add("modal-open");
    modalClose.focus();
}

function closeGallery() {
    if (modal.hidden) return;
    modal.hidden = true;
    document.body.classList.remove("modal-open");
    if (galleryTrigger) galleryTrigger.focus();
}

galleryItems.forEach((item, index) => item.addEventListener("click", () => openGallery(index, item)));
modalClose.addEventListener("click", closeGallery);
modalPrev.addEventListener("click", () => showGalleryImage(currentGalleryIndex - 1));
modalNext.addEventListener("click", () => showGalleryImage(currentGalleryIndex + 1));
modal.addEventListener("click", (event) => {
    if (event.target === modal) closeGallery();
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        closeGallery();
    }
    if (!modal.hidden && event.key === "ArrowLeft") showGalleryImage(currentGalleryIndex - 1);
    if (!modal.hidden && event.key === "ArrowRight") showGalleryImage(currentGalleryIndex + 1);

    if (!modal.hidden && event.key === "Tab") {
        const focusable = Array.from(modal.querySelectorAll("button"));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
});

let touchStartX = 0;

modal.addEventListener("touchstart", (event) => {
    touchStartX = event.changedTouches[0].clientX;
}, { passive: true });

modal.addEventListener("touchend", (event) => {
    const distance = event.changedTouches[0].clientX - touchStartX;
    if (Math.abs(distance) > 50) {
        showGalleryImage(currentGalleryIndex + (distance < 0 ? 1 : -1));
    }
}, { passive: true });

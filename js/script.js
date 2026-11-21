
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

const mascotWidget = document.querySelector(".mascot-widget");
const mascotToggle = document.querySelector(".mascot-toggle");
const mascotPanel = document.querySelector(".mascot-panel");
const mascotClose = document.querySelector(".mascot-close");
const mascotReply = document.querySelector("#mascot-reply");

const mascotAnswers = {
    flavors: "Temos trufas de maracujá, morango, coco, limão e café, além de brigadeiro e palha italiana.",
    prices: "As trufas custam R$ 5,00 cada e a palha italiana R$ 6,00 cada. Doces para aniversário: R$ 130,00 o cento.",
    order: "Encomende pelo WhatsApp. Para doces de aniversário, quantidades menores que um cento podem ser combinadas."
};

function closeMascot(returnFocus = false) {
    if (!mascotToggle || !mascotPanel) return;
    mascotPanel.hidden = true;
    mascotToggle.setAttribute("aria-expanded", "false");
    if (returnFocus) mascotToggle.focus();
}

if (mascotWidget && mascotToggle && mascotPanel && mascotClose && mascotReply) {
    mascotToggle.addEventListener("click", () => {
        const isOpen = mascotToggle.getAttribute("aria-expanded") === "true";
        mascotPanel.hidden = isOpen;
        mascotToggle.setAttribute("aria-expanded", String(!isOpen));
        if (!isOpen) mascotClose.focus();
    });

    mascotClose.addEventListener("click", () => closeMascot(true));

    mascotPanel.querySelectorAll("[data-answer]").forEach((button) => {
        button.addEventListener("click", () => {
            mascotReply.textContent = mascotAnswers[button.dataset.answer];
        });
    });

    document.addEventListener("pointerdown", (event) => {
        if (!mascotPanel.hidden && !mascotWidget.contains(event.target)) closeMascot();
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
        closeMenu();
        if (mascotPanel && !mascotPanel.hidden) closeMascot(true);
    }
});

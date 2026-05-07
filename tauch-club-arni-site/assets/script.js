const header = document.querySelector(".site-header");
const navToggle = document.querySelector(".nav-toggle");
const form = document.querySelector("[data-demo-form]");
const successMessage = document.querySelector("[data-form-success]");

if (navToggle && header) {
  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  document.addEventListener("click", (event) => {
    if (!header.contains(event.target)) {
      header.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    }
  });
}

if (form && successMessage) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    successMessage.classList.add("is-visible");
    form.reset();
  });
}

document.querySelectorAll(".nav-links a").forEach((link) => {
  if (link.href === window.location.href) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

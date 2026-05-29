const menuButton = document.getElementById("menu-button");
const siteNav = document.getElementById("site-nav");
const contactForm = document.getElementById("contact-form");
const header = document.querySelector(".site-header");
const hero = document.querySelector(".hero");
const revealTargets = document.querySelectorAll(
  ".section-intro, .section-heading, .about-copy, .image-pair, .feature-item, .stat-grid > div, .service-card, .location-copy, .map-frame, .review-card, .contact-info, .contact-form"
);

const setHeaderState = () => {
  const scrollY = window.scrollY;
  const heroHeight = hero ? hero.offsetHeight : 0;
  
  header.classList.toggle("scrolled", scrollY > 24);
  header.classList.toggle("transparent", scrollY > heroHeight);
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuButton.addEventListener("click", () => {
  const isOpen = siteNav.classList.toggle("active");
  menuButton.setAttribute("aria-expanded", String(isOpen));
  menuButton.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  document.body.classList.toggle("menu-open", isOpen);
});

siteNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    siteNav.classList.remove("active");
    menuButton.setAttribute("aria-expanded", "false");
    menuButton.setAttribute("aria-label", "Open navigation");
    document.body.classList.remove("menu-open");
  });
});

if ("IntersectionObserver" in window) {
  revealTargets.forEach((target, index) => {
    target.classList.add("reveal");
    target.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
  });

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16, rootMargin: "0px 0px -40px 0px" }
  );

  revealTargets.forEach((target) => revealObserver.observe(target));
} else {
  revealTargets.forEach((target) => target.classList.add("is-visible"));
}

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const form = new FormData(contactForm);
  const name = String(form.get("name") || "").trim();
  const email = String(form.get("email") || "").trim();
  const phone = String(form.get("phone") || "").trim();
  const vehicle = String(form.get("vehicle") || "").trim();
  const service = String(form.get("service") || "").trim();
  const message = String(form.get("message") || "").trim();

  if (!name || !email || !message) {
    alert("Please fill all required fields: name, email, and message.");
    return;
  }

  const subject = `New Service Request - ${name}`;
  const body = [
    `Customer Name: ${name}`,
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Vehicle: ${vehicle || "Not specified"}`,
    `Service Needed: ${service || "Not selected"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const gmailUrl =
    "https://mail.google.com/mail/?view=cm&fs=1&to=capital.ktpm@gmail.com" +
    `&su=${encodeURIComponent(subject)}` +
    `&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank");
  alert("Opening email to send request.");
  contactForm.reset();
});

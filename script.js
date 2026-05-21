document.addEventListener("DOMContentLoaded", () => {
  const reservationForm = document.querySelector(".reservation-form");
  const dateInput = document.querySelector('input[name="date"]');
  const navLinks = document.querySelectorAll(".nav-links a");
  const sections = document.querySelectorAll("main section[id]");
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const menuCards = document.querySelectorAll(".menu-card");
  const backToTopButton = document.querySelector(".back-to-top");

  if (dateInput) {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    const localDate = new Date(today - timezoneOffset).toISOString().split("T")[0];
    dateInput.min = localDate;
  }

  if (reservationForm) {
    const message = document.createElement("p");
    message.className = "form-message";
    message.setAttribute("role", "status");
    message.hidden = true;
    reservationForm.appendChild(message);

    reservationForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!reservationForm.checkValidity()) {
        reservationForm.reportValidity();
        return;
      }

      const formData = new FormData(reservationForm);
      const name = formData.get("name");
      const guests = formData.get("guests");
      const date = formData.get("date");
      const time = formData.get("time");

      message.textContent = `Thank you, ${name}. Your reservation request for ${guests} on ${date} at ${time} has been received. Our team will confirm shortly.`;
      message.hidden = false;
      reservationForm.reset();

      if (dateInput) {
        const today = new Date();
        const timezoneOffset = today.getTimezoneOffset() * 60000;
        dateInput.min = new Date(today - timezoneOffset).toISOString().split("T")[0];
      }
    });
  }

  menuCards.forEach((card) => {
    const menuItems = card.querySelectorAll(".menu-item");

    if (menuItems.length <= 3) return;

    menuItems.forEach((item, index) => {
      if (index >= 3) {
        item.classList.add("is-extra");
      }
    });

    const button = document.createElement("button");
    button.className = "menu-toggle";
    button.type = "button";
    button.textContent = "Show more";
    button.setAttribute("aria-expanded", "false");

    button.addEventListener("click", () => {
      const isExpanded = card.classList.toggle("is-expanded");
      button.textContent = isExpanded ? "Show less" : "Show more";
      button.setAttribute("aria-expanded", String(isExpanded));
    });

    card.appendChild(button);
  });

  if (revealItems.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -70px 0px" });

    revealItems.forEach((item, index) => {
      item.style.transitionDelay = `${Math.min(index % 3, 2) * 90}ms`;
      revealObserver.observe(item);
    });
  }

  if (backToTopButton) {
    const toggleBackToTop = () => {
      backToTopButton.classList.toggle("is-visible", window.scrollY > 520);
    };

    backToTopButton.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });

    toggleBackToTop();
    window.addEventListener("scroll", toggleBackToTop, { passive: true });
  }

  if (sections.length && navLinks.length) {
    const navObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle("is-active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    }, { threshold: 0.45 });

    sections.forEach((section) => navObserver.observe(section));
  }
});

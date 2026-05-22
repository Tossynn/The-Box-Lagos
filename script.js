document.addEventListener("DOMContentLoaded", () => {
  const reservationForm = document.querySelector(".reservation-form");
  const dateInput = document.querySelector('input[name="date"]');
  const navLinks = document.querySelectorAll(".nav-links a");
  const navMenu = document.querySelector("#navLinks");
  const navToggle = document.querySelector(".nav-toggle");
  const sections = document.querySelectorAll("main section[id]");
  const revealItems = document.querySelectorAll(".reveal-on-scroll");
  const menuCards = document.querySelectorAll(".menu-card");
  const backToTopButton = document.querySelector(".back-to-top");
  const orderToggle = document.querySelector("#orderToggle");
  const orderForm = document.querySelector("#orderPanel");
  const orderCategory = document.querySelector("#orderCategory");
  const orderItem = document.querySelector("#orderItem");
  const orderQuantity = document.querySelector('input[name="orderQuantity"]');
  const addOrderItem = document.querySelector("#addOrderItem");
  const orderItems = document.querySelector("#orderItems");
  const selectedOrderItems = [];

  const menuItemsByCategory = {
    "Breakfast & Salads": [
      "Akara",
      "Ceasar Salad",
      "Pancake",
      "Healthy",
      "Breakfast Platter",
      "Continental",
      "Homegrown Delight",
      "Greek Salad",
      "Seafood Noodles",
      "Waffles",
      "Chicken Wrap",
      "Chicken Sandwich",
    ],
    "The Box Starters & Sides": [
      "Crunchy Chicken Wings",
      "Gizdodo",
      "Fried Yam",
      "Beef Kebab",
      "Chicken Kebab",
      "Crunchy Prawns",
      "Shrimp French Fries",
      "The Box Burger",
      "Spring Rolls and Samosa",
      "Sides",
    ],
    "Grills & Peppered Options": [
      "Grilled Tilapia",
      "Grilled Turkey",
      "Grilled Catfish",
      "Grilled Croaker",
      "Grilled Chicken Thigh",
      "Peppered Turkey",
      "Peppered Snail",
      "Peppered Gizzard",
      "Peppered Chicken Thighs",
      "Peppered Goat Meat",
      "Peppered Chicken Wings",
      "Peppered Beef",
    ],
    "Peppersoups & Swallow": [
      "Catfish Peppersoup",
      "Croaker Peppersoup",
      "Goat Meat Peppersoup",
      "Chicken Peppersoup",
      "Turkey Peppersoup",
      "Seafood Peppersoup",
      "Swallow",
    ],
    "Soups & Sea Finish": [
      "Seafood Okro",
      "Fisherman Soup",
      "White Soup",
      "Seafood Egusi",
      "Afang Soup",
      "Assorted",
      "Vegetable Soup",
      "Ogbono Soup",
      "Oha Soup",
      "Seafood Boil",
      "Prawns Tempura",
    ],
    Grains: [
      "Seafood Alfredo Pasta",
      "Hot Penne Pasta",
      "Stir Fry Spaghetti",
      "Chicken Wings Spaghetti",
      "Spaghetti Bolognese",
      "Special Fried Rice",
      "Pork-Meal Rice",
      "Turkey Rice",
      "Shredded Chicken Jollof",
      "Village Rice",
      "Jambalaya Rice",
      "Herb Rice and Chicken Curry Sauce",
    ],
    "Platters & Buffets": [
      "The Box Platter",
      "Grill Platter",
      "Chicken Rice Royal Platter",
      "Pastries Platter",
      "Classic Buffet",
      "Premium Buffet",
      "Luxury Buffet",
    ],
    "Drinks Menu": [
      "Whiskey",
      "Tequila & Cognac",
      "Champagne, Wine & Vodka",
      "Cocktails & Mocktails",
      "Beer, Gin, Shots & Rum",
      "Soft Drinks, Coffee & Tea",
    ],
  };

  if (dateInput) {
    const today = new Date();
    const timezoneOffset = today.getTimezoneOffset() * 60000;
    const localDate = new Date(today - timezoneOffset).toISOString().split("T")[0];
    dateInput.min = localDate;
  }

  if (navToggle && navMenu) {
    navToggle.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("is-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
      navToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    });

    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("is-open");
        navToggle.setAttribute("aria-expanded", "false");
        navToggle.setAttribute("aria-label", "Open navigation menu");
      });
    });
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

  if (orderToggle && orderForm) {
    const orderMessage = document.createElement("p");
    orderMessage.className = "form-message";
    orderMessage.setAttribute("role", "status");
    orderMessage.hidden = true;
    orderForm.appendChild(orderMessage);

    const renderOrderItems = () => {
      if (!orderItems) return;

      if (!selectedOrderItems.length) {
        orderItems.innerHTML = "<p>No items added yet.</p>";
        return;
      }

      const listItems = selectedOrderItems.map((entry, index) => `
        <li>
          <span>${entry.quantity} x ${entry.item}</span>
          <small>${entry.category}</small>
          <button type="button" data-remove-order-item="${index}" aria-label="Remove ${entry.item}">Remove</button>
        </li>
      `).join("");

      orderItems.innerHTML = `<ul>${listItems}</ul>`;
    };

    orderToggle.addEventListener("click", () => {
      orderForm.hidden = false;
      orderToggle.setAttribute("aria-expanded", "true");
      orderForm.scrollIntoView({ behavior: "smooth", block: "start" });
    });

    if (orderCategory && orderItem) {
      orderCategory.addEventListener("change", () => {
        const selectedItems = menuItemsByCategory[orderCategory.value] || [];
        orderItem.innerHTML = "";

        const placeholder = document.createElement("option");
        placeholder.value = "";
        placeholder.textContent = selectedItems.length ? "Select item" : "Select a category first";
        orderItem.appendChild(placeholder);

        selectedItems.forEach((item) => {
          const option = document.createElement("option");
          option.textContent = item;
          orderItem.appendChild(option);
        });

        orderItem.disabled = selectedItems.length === 0;
      });
    }

    if (addOrderItem && orderCategory && orderItem && orderQuantity) {
      addOrderItem.addEventListener("click", () => {
        if (!orderCategory.value || !orderItem.value || !orderQuantity.value) {
          orderMessage.textContent = "Choose a category, item, and quantity before adding to the order.";
          orderMessage.hidden = false;
          return;
        }

        selectedOrderItems.push({
          category: orderCategory.value,
          item: orderItem.value,
          quantity: orderQuantity.value,
        });

        orderCategory.value = "";
        orderItem.innerHTML = '<option value="">Select a category first</option>';
        orderItem.disabled = true;
        orderQuantity.value = "1";
        orderMessage.hidden = true;
        renderOrderItems();
      });
    }

    if (orderItems) {
      orderItems.addEventListener("click", (event) => {
        const removeButton = event.target.closest("[data-remove-order-item]");
        if (!removeButton) return;

        selectedOrderItems.splice(Number(removeButton.dataset.removeOrderItem), 1);
        renderOrderItems();
      });
    }

    orderForm.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!selectedOrderItems.length) {
        orderMessage.textContent = "Please add at least one item to your order before submitting.";
        orderMessage.hidden = false;
        return;
      }

      if (!orderForm.checkValidity()) {
        orderForm.reportValidity();
        return;
      }

      const formData = new FormData(orderForm);
      const name = formData.get("orderName");
      const payment = formData.get("paymentOption");
      const orderSummary = selectedOrderItems.map((entry) => `${entry.quantity} x ${entry.item}`).join(", ");

      orderMessage.textContent = `Thank you, ${name}. Your order for ${orderSummary} has been received. Payment option: ${payment}.`;
      orderMessage.hidden = false;
      orderForm.reset();
      selectedOrderItems.length = 0;
      renderOrderItems();

      if (orderItem) {
        orderItem.innerHTML = '<option value="">Select a category first</option>';
        orderItem.disabled = true;
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

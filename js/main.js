document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");
  const header = document.querySelector(".header");

  function updateHeaderState() {
    header?.classList.toggle("is-scrolled", window.scrollY > 12);
  }

  function closeMenu() {
    if (!menuToggle || !navigation) {
      return;
    }

    navigation.classList.remove("active");
    menuToggle.classList.remove("active");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }

  updateHeaderState();
  window.addEventListener("scroll", updateHeaderState, { passive: true });

  function setupRevealAnimations() {
    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: no-preference)"
    );

    if (!motionQuery.matches) {
      return;
    }

    const revealSelectors = [
      ".about-image-wrapper",
      ".about-content",
      ".services-heading",
      ".service-card",
      ".services-cta",
      ".gallery-heading",
      ".gallery-video-text",
      ".gallery-video-card",
      ".gallery-item",
      ".gallery-instagram",
      ".gallery-cta",
      ".contact-heading",
      ".contact-card",
      ".contact-form-wrapper",
      ".contact-notice",
      ".home-section-heading",
      ".home-service-card",
      ".home-gallery-card",
      ".home-final-cta-inner",
    ];
    const revealElements = [
      ...document.querySelectorAll(revealSelectors.join(", ")),
    ];

    if (!revealElements.length) {
      return;
    }

    document.body.classList.add("has-motion");

    revealElements.forEach((element, index) => {
      element.classList.add("reveal");
      element.style.setProperty(
        "--reveal-delay",
        `${Math.min(index % 4, 3) * 70}ms`
      );
    });

    if (!("IntersectionObserver" in window)) {
      revealElements.forEach((element) => {
        element.classList.add("is-visible");
      });
      return;
    }

    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) {
            return;
          }

          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -32px",
      }
    );

    revealElements.forEach((element) => {
      revealObserver.observe(element);
    });
  }

  setupRevealAnimations();

  function setupGalleryLightbox() {
    const galleryItems = [
      ...document.querySelectorAll(".gallery-item"),
    ];

    if (!galleryItems.length) {
      return;
    }

    const lightbox = document.createElement("div");

    lightbox.className = "lightbox";
    lightbox.hidden = true;
    lightbox.innerHTML = [
      '<div class="lightbox-dialog" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">',
      '<button class="lightbox-close" type="button" aria-label="Fechar imagem">×</button>',
      '<div class="lightbox-media"><img src="" alt=""></div>',
      '<div class="lightbox-copy">',
      '<span class="lightbox-category"></span>',
      '<h2 id="lightbox-title"></h2>',
      "</div>",
      "</div>",
    ].join("");

    document.body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector(".lightbox-media img");
    const lightboxCategory = lightbox.querySelector(".lightbox-category");
    const lightboxTitle = lightbox.querySelector("#lightbox-title");
    const closeButton = lightbox.querySelector(".lightbox-close");
    let previousFocus;

    function closeLightbox() {
      if (lightbox.hidden) {
        return;
      }

      lightbox.hidden = true;
      document.body.classList.remove("lightbox-open");
      previousFocus?.focus();
    }

    function openLightbox(item) {
      const source = item.querySelector("img");
      const category = item.querySelector("figcaption span");
      const title = item.querySelector("figcaption strong");

      if (!source || !lightboxImage || !lightboxCategory || !lightboxTitle) {
        return;
      }

      lightboxImage.src = source.src;
      lightboxImage.alt = source.alt;
      lightboxCategory.textContent = category?.textContent || "Galeria";
      lightboxTitle.textContent =
        title?.textContent || "Trabalho Nara Nails";
      previousFocus = item;
      lightbox.hidden = false;
      document.body.classList.add("lightbox-open");
      closeButton?.focus();
    }

    closeButton?.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) {
        closeLightbox();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLightbox();
      }
    });

    galleryItems.forEach((item) => {
      const image = item.querySelector("img");

      if (!image) {
        return;
      }

      item.classList.add("is-lightbox");
      item.setAttribute("role", "button");
      item.setAttribute("tabindex", "0");
      item.setAttribute("aria-label", "Ampliar: " + image.alt);

      item.addEventListener("click", () => {
        openLightbox(item);
      });

      item.addEventListener("keydown", (event) => {
        if (event.key !== "Enter" && event.key !== " ") {
          return;
        }

        event.preventDefault();
        openLightbox(item);
      });
    });
  }

  setupGalleryLightbox();

  // Menu mobile
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = !navigation.classList.contains("active");

      navigation.classList.toggle("active", isOpen);
      menuToggle.classList.toggle("active", isOpen);
      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Fechar menu" : "Abrir menu"
      );
    });

    const currentPage =
      window.location.pathname.split("/").pop() || "index.html";

    navigation.querySelectorAll("a").forEach((link) => {
      const linkPage =
        new URL(link.href, window.location.href).pathname.split("/").pop() ||
        "index.html";

      if (linkPage === currentPage) {
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      }

      link.addEventListener("click", () => {
        closeMenu();
      });
    });

    document.addEventListener("click", (event) => {
      if (
        navigation.classList.contains("active") &&
        !navigation.contains(event.target) &&
        !menuToggle.contains(event.target)
      ) {
        closeMenu();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape" && navigation.classList.contains("active")) {
        closeMenu();
        menuToggle.focus();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });
  }

  // Formulário de contato
  const contactForm = document.querySelector("#contact-form");
  const dateInput = document.querySelector("#date");
  const timeSelect = document.querySelector("#time");
  const timeHelp = document.querySelector("#time-help");
  const formStatus = document.querySelector("#form-status");

  const whatsappNumber = "5584991350714";

  const availableTimes = [
    "08:00",
    "11:00",
    "14:00",
    "17:00",
  ];

  function setFormStatus(message, type = "") {
    if (!formStatus) {
      return;
    }

    formStatus.textContent = message;
    formStatus.className = type
      ? "form-status is-" + type
      : "form-status";
  }

  function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  }

  function resetTimeSelect(message = "Escolha primeiro uma data") {
    if (!timeSelect) {
      return;
    }

    timeSelect.innerHTML = "";

    const option = document.createElement("option");

    option.value = "";
    option.textContent = message;

    timeSelect.appendChild(option);
    timeSelect.disabled = true;
  }

  function loadAvailableTimes() {
    if (!dateInput || !timeSelect) {
      return;
    }

    const selectedDate = dateInput.value;

    if (!selectedDate) {
      resetTimeSelect();
      setFormStatus("");

      if (timeHelp) {
        timeHelp.textContent =
          "Horários disponíveis: 08h, 11h, 14h e 17h.";
      }

      return;
    }

    setFormStatus("");

    const [year, month, day] = selectedDate
      .split("-")
      .map(Number);

    const selectedDateObject = new Date(
      year,
      month - 1,
      day
    );

    const dayOfWeek = selectedDateObject.getDay();

    // Domingo
    if (dayOfWeek === 0) {
      dateInput.value = "";

      resetTimeSelect("Domingo não possui atendimento");

      if (timeHelp) {
        timeHelp.textContent =
          "A Nara atende apenas de segunda a sábado.";
      }

      setFormStatus(
        "A Nara não atende aos domingos. Escolha uma data entre segunda e sábado.",
        "error"
      );
      dateInput.focus();

      return;
    }

    timeSelect.innerHTML = "";

    const defaultOption = document.createElement("option");

    defaultOption.value = "";
    defaultOption.textContent = "Selecione um horário";

    timeSelect.appendChild(defaultOption);

    availableTimes.forEach((time) => {
      const option = document.createElement("option");

      option.value = time;
      option.textContent = time;

      timeSelect.appendChild(option);
    });

    timeSelect.disabled = false;

    if (timeHelp) {
      timeHelp.textContent =
        "Horários disponíveis: 08h, 11h, 14h e 17h. O horário será confirmado pelo WhatsApp.";
    }
  }

  if (dateInput) {
    const today = new Date();

    dateInput.min = formatDateForInput(today);

    dateInput.addEventListener(
      "change",
      loadAvailableTimes
    );
  }

  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();
      setFormStatus("");

      const nameInput = document.querySelector("#name");
      const serviceSelect =
        document.querySelector("#service");
      const messageInput =
        document.querySelector("#message");

      const name = nameInput?.value.trim() || "";
      const service = serviceSelect?.value || "";
      const date = dateInput?.value || "";
      const time = timeSelect?.value || "";
      const observations =
        messageInput?.value.trim() || "";

      if (!name) {
        setFormStatus("Por favor, informe seu nome.", "error");
        nameInput?.focus();
        return;
      }

      if (!service) {
        setFormStatus("Por favor, selecione um serviço.", "error");
        serviceSelect?.focus();
        return;
      }

      if (!date) {
        setFormStatus("Por favor, escolha uma data.", "error");
        dateInput?.focus();
        return;
      }

      if (!time) {
        setFormStatus("Por favor, escolha um horário.", "error");
        timeSelect?.focus();
        return;
      }

      const [year, month, day] = date.split("-");
      const formattedDate = `${day}/${month}/${year}`;

      const formattedObservations =
        observations || "Nenhuma observação";

      const whatsappMessage = [
        "Olá, Nara! Gostaria de solicitar um agendamento.",
        "",
        `*Nome:* ${name}`,
        `*Serviço desejado:* ${service}`,
        `*Data de preferência:* ${formattedDate}`,
        `*Horário de preferência:* ${time}`,
        `*Observações:* ${formattedObservations}`,
        "",
        "Se esse horário já estiver ocupado, pode me informar os próximos horários disponíveis?",
      ].join("\n");

      const whatsappUrl =
        `https://wa.me/${whatsappNumber}` +
        `?text=${encodeURIComponent(whatsappMessage)}`;

      window.open(
        whatsappUrl,
        "_blank",
        "noopener,noreferrer"
      );

      setFormStatus(
        "O WhatsApp foi aberto com sua mensagem pronta para confirmar o horário.",
        "success"
      );
    });
  }
});

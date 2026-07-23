document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".navigation");

  // Menu mobile
  if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
      const isOpen = navigation.classList.toggle("active");

      menuToggle.classList.toggle("active");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navigation.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navigation.classList.remove("active");
        menuToggle.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Formulário de contato
  const contactForm = document.querySelector("#contact-form");
  const dateInput = document.querySelector("#date");
  const timeSelect = document.querySelector("#time");
  const timeHelp = document.querySelector("#time-help");

  const whatsappNumber = "5584991350714";

  const availableTimes = [
    "08:00",
    "11:00",
    "14:00",
    "17:00",
  ];

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

      if (timeHelp) {
        timeHelp.textContent =
          "Horários disponíveis: 08h, 11h, 14h e 17h.";
      }

      return;
    }

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

      alert(
        "A Nara não atende aos domingos. Escolha uma data entre segunda e sábado."
      );

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
        alert("Por favor, informe seu nome.");
        nameInput?.focus();
        return;
      }

      if (!service) {
        alert("Por favor, selecione um serviço.");
        serviceSelect?.focus();
        return;
      }

      if (!date) {
        alert("Por favor, escolha uma data.");
        dateInput?.focus();
        return;
      }

      if (!time) {
        alert("Por favor, escolha um horário.");
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
    });
  }
});
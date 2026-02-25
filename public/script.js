// Contact Form JavaScript
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  const submitBtn = document.getElementById("submitBtn");
  const submitText = document.getElementById("submitText");
  const submitSpinner = document.getElementById("submitSpinner");
  const formMessage = document.getElementById("formMessage");

  // Error message elements
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const messageError = document.getElementById("messageError");

  // Form validation
  function validateField(field, errorElement, validationFn, errorMessage) {
    const value = field.value.trim();
    const isValid = validationFn(value);

    if (!isValid) {
      field.classList.add("error");
      errorElement.textContent = errorMessage;
      errorElement.style.display = "block";
      return false;
    } else {
      field.classList.remove("error");
      errorElement.textContent = "";
      errorElement.style.display = "none";
      return true;
    }
  }

  // Validation functions
  const validations = {
    name: {
      fn: (value) => value.length >= 2,
      msg: "Name must be at least 2 characters long",
    },
    email: {
      fn: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
      msg: "Please enter a valid email address",
    },
    phone: {
      fn: (value) => {
        const digitsOnly = value.replace(/\D/g, "");
        return digitsOnly.length >= 10 && digitsOnly.length <= 15;
      },
      msg: "Please enter a valid phone number (10-15 digits)",
    },
    message: {
      fn: (value) => value.length >= 10,
      msg: "Message must be at least 10 characters long",
    },
  };

  // Real-time validation
  document.getElementById("name").addEventListener("input", function () {
    validateField(this, nameError, validations.name.fn, validations.name.msg);
  });

  document.getElementById("email").addEventListener("input", function () {
    validateField(
      this,
      emailError,
      validations.email.fn,
      validations.email.msg,
    );
  });

  document.getElementById("phone").addEventListener("input", function () {
    validateField(
      this,
      phoneError,
      validations.phone.fn,
      validations.phone.msg,
    );
  });

  document.getElementById("message").addEventListener("input", function () {
    validateField(
      this,
      messageError,
      validations.message.fn,
      validations.message.msg,
    );
  });

  // Form submission
  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    // Get form data
    const formData = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      phone: document.getElementById("phone").value.trim(),
      message: document.getElementById("message").value.trim(),
    };

    // Validate all fields
    const isNameValid = validateField(
      document.getElementById("name"),
      nameError,
      validations.name.fn,
      validations.name.msg,
    );

    const isEmailValid = validateField(
      document.getElementById("email"),
      emailError,
      validations.email.fn,
      validations.email.msg,
    );

    const isPhoneValid = validateField(
      document.getElementById("phone"),
      phoneError,
      validations.phone.fn,
      validations.phone.msg,
    );

    const isMessageValid = validateField(
      document.getElementById("message"),
      messageError,
      validations.message.fn,
      validations.message.msg,
    );

    // If any validation fails, don't submit
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isMessageValid) {
      showMessage("Please fix the errors above before submitting.", "error");
      return;
    }

    // Disable form and show loading state
    disableForm(true);
    showMessage("Sending your message...", "info");

    try {
      // Send POST request to API
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Success
        showMessage(result.message, "success");
        form.reset();
        // Remove any remaining error styles
        document
          .querySelectorAll(".form-group input, .form-group textarea")
          .forEach((field) => {
            field.classList.remove("error");
          });
        document.querySelectorAll(".error-message").forEach((el) => {
          el.style.display = "none";
        });

        // Reset form after success (optional delay)
        setTimeout(() => {
          hideMessage();
        }, 5000);
      } else {
        // Server validation errors
        if (result.errors && Array.isArray(result.errors)) {
          // Handle server-side validation errors
          result.errors.forEach((error) => {
            if (error.includes("Name")) {
              nameError.textContent = error;
              nameError.style.display = "block";
              document.getElementById("name").classList.add("error");
            } else if (error.includes("email")) {
              emailError.textContent = error;
              emailError.style.display = "block";
              document.getElementById("email").classList.add("error");
            } else if (error.includes("phone")) {
              phoneError.textContent = error;
              phoneError.style.display = "block";
              document.getElementById("phone").classList.add("error");
            } else if (error.includes("Message")) {
              messageError.textContent = error;
              messageError.style.display = "block";
              document.getElementById("message").classList.add("error");
            }
          });
          showMessage(
            "Please fix the errors above before submitting.",
            "error",
          );
        } else {
          // Generic server error
          showMessage(
            result.message || "An error occurred. Please try again.",
            "error",
          );
        }
      }
    } catch (error) {
      console.error("Fetch error:", error);
      showMessage(
        "Network error. Please check your connection and try again.",
        "error",
      );
    } finally {
      // Re-enable form
      disableForm(false);
    }
  });

  // Utility functions
  function disableForm(disabled) {
    const inputs = form.querySelectorAll("input, textarea, button");
    inputs.forEach((input) => {
      input.disabled = disabled;
    });

    if (disabled) {
      submitText.style.display = "none";
      submitSpinner.style.display = "inline-block";
    } else {
      submitText.style.display = "inline-block";
      submitSpinner.style.display = "none";
    }
  }

  function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = "block";

    // Auto-hide success messages after 5 seconds
    if (type === "success") {
      setTimeout(() => {
        if (formMessage.classList.contains("success")) {
          hideMessage();
        }
      }, 5000);
    }
  }

  function hideMessage() {
    formMessage.style.display = "none";
    formMessage.textContent = "";
    formMessage.className = "form-message";
  }

  // Navigation mobile menu toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      navMenu.classList.toggle("active");
      hamburger.classList.toggle("active");
    });

    // Close menu when clicking on a link
    document.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // Scroll animation for navbar
  window.addEventListener("scroll", function () {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
      if (window.scrollY > 50) {
        navbar.style.background = "rgba(255, 255, 255, 0.98)";
        navbar.style.boxShadow = "0 2px 20px rgba(0,0,0,0.1)";
      } else {
        navbar.style.background = "rgba(255, 255, 255, 0.95)";
        navbar.style.boxShadow = "none";
      }
    }
  });

  // Add error styling for invalid inputs
  const style = document.createElement("style");
  style.textContent = `
        .form-group input.error,
        .form-group textarea.error {
            border-color: var(--error-color) !important;
            box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1) !important;
        }
        
        .form-message.info {
            background: #dbeafe;
            color: #1e40af;
            border: 1px solid #bfdbfe;
        }
    `;
  document.head.appendChild(style);
});

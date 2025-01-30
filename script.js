document.addEventListener("DOMContentLoaded", function () {
  const scriptURL =
    "https://script.google.com/macros/s/AKfycbyR4D12bPWSvdeEnvdYONHEWbnnCWEIPGpT1kQGlJszTV2tqnaliqiVNxyhwiKVOzJzUw/exec";
  const form = document.getElementById("contactForm");
  const alertContainer = document.getElementById("notification-container");
  const submitBtn = form.querySelector("#send");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    submitBtn.disabled = true;

    // Perform custom validation
    if (!form.checkValidity()) {
      validateForm();
      submitBtn.disabled = false;
      return;
    }

    // If form is valid, submit via fetch
    fetch(scriptURL, { method: "POST", body: new FormData(form) })
      .then((response) => {
        if (response.ok) {
          showNotification(
            "Form submitted successfully. We'll get back to you soon.",
            "success"
          );
          form.reset();

          // Re-enable submit button after delay
          setTimeout(() => {
            submitBtn.disabled = false;
          }, 3000);
        } else {
          throw new Error("Form submission failed!");
        }
      })
      .catch((error) => {
        showNotification(
          "There was an error submitting the form. Please try again.",
          "danger"
        );
        console.error("Error!", error.message);
        submitBtn.disabled = false;
      });
  });

  function validateForm() {
    const name = form.elements["Name"];
    const email = form.elements["Email"];
    const mobile = form.elements["Mobile"];
    const location = form.elements["Location"];
    const message = form.elements["Message"];

    let errorMessage = "";
    if (!name.checkValidity()) {
      errorMessage =
        "Name must be at least 4 characters and contain only letters.";
    } else if (email.value && !email.checkValidity()) {
      errorMessage = "Enter a valid email address.";
    } else if (!mobile.checkValidity()) {
      errorMessage = "Mobile number must be 10 digits.";
    } else if (location.value && !location.checkValidity()) {
      errorMessage =
        "Location should contain at least five characters and no numbers.";
    } else if (!message.checkValidity()) {
      errorMessage = "Message should contain at least 10 characters.";
    }

    if (errorMessage) {
      showNotification(errorMessage, "danger");
    }
  }

  function showNotification(message, type) {
    // Clear existing alerts
    const alertContainer = document.getElementById("notification-container");
    alertContainer.innerHTML = "";

    const alertDiv = document.createElement("div");
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.setAttribute("role", "alert");
    alertDiv.innerHTML = `
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;

    // Append alert to floating container
    alertContainer.appendChild(alertDiv);

    // Automatically remove alert after 3 seconds
    setTimeout(() => {
      alertDiv.classList.remove("show");
      setTimeout(() => alertDiv.remove(), 500);
    }, 3000);
  }
});

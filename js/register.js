document.addEventListener('DOMContentLoaded', function () {

const registrationForm = document.getElementById('registrationForm');
      const successMessage = document.getElementById('successMessage');

      registrationForm.addEventListener('submit', function(event) {
        event.preventDefault();
        // Simulate a successful registration
        successMessage.style.display = 'block';
      });
});

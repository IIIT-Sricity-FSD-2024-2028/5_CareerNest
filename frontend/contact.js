document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('contactForm');
    const fullNameInput = document.getElementById('fullName');
    const phoneInput = document.getElementById('phone');
    const statusMessage = document.getElementById('statusMessage');
    const confirmCheckbox = document.getElementById('confirmData');

    // 1. Real-time Sanitization for Full Name (No special characters or numbers)
    fullNameInput.addEventListener('input', (e) => {
        const originalValue = e.target.value;
        const sanitizedValue = originalValue.replace(/[^a-zA-Z\s]/g, '');
        if (originalValue !== sanitizedValue) {
            e.target.value = sanitizedValue;
        }
    });

    // 2. Real-time Sanitization for Mobile Number (No alphabets or special characters)
    phoneInput.addEventListener('input', (e) => {
        const originalValue = e.target.value;
        const sanitizedValue = originalValue.replace(/[^0-9]/g, '');
        if (originalValue !== sanitizedValue) {
            e.target.value = sanitizedValue;
        }
    });

    // 3. Form Submission Handling
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear previous status
        statusMessage.textContent = '';
        statusMessage.className = 'status-message';

        // Get all required fields
        const requiredFields = form.querySelectorAll('[required]');
        let isFormValid = true;

        requiredFields.forEach(field => {
            if (!field.value.trim() || (field.type === 'checkbox' && !field.checked)) {
                isFormValid = false;
                field.style.borderColor = 'var(--error-color)';

                // Add shake animation to invalid fields
                field.style.animation = 'none';
                void field.offsetWidth; // Trigger reflow
                field.style.animation = 'shake 0.4s ease-in-out';
            } else {
                field.style.borderColor = 'var(--border-color)';
                field.style.animation = 'none';
            }
        });

        // Additional Logic for Success/Error display
        if (isFormValid) {
            showStatus('Submission Successful', 'success');
            form.reset();
            // Reset borders
            requiredFields.forEach(field => field.style.borderColor = 'var(--border-color)');
        } else {
            showStatus('Submission Error', 'error');
        }
    });

    // Helper function to show status messages
    function showStatus(text, type) {
        statusMessage.textContent = text;
        statusMessage.className = `status-message ${type}`;

        // Auto-scroll to message
        statusMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Add CSS Animation for shaking invalid fields
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(styleSheet);
});

// Signup Form Submission
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', async function (e) {
        e.preventDefault();
        
        const formData = new FormData(signupForm);
        const password = formData.get('password');
        const confirmPassword = formData.get('confirm_password');

        // Check if passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/signup', {
                method: 'POST',
                body: formData, // Send the FormData directly
            });

            const result = await response.json();
            if (response.ok) {
                alert(result.message);
                signupForm.reset();
            } else {
                alert('Signup failed: ' + result.error);
            }
        } catch (error) {
            alert('Error: ' + error.message);
        }
    });
}
document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signup-form');
  const signinForm = document.getElementById('signin-form');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const name = document.getElementById('signup-name').value;
      const email = document.getElementById('signup-email').value;
      const password = document.getElementById('signup-password').value;

      try {
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();
        alert(data.msg);
        if (res.ok) window.location.href = 'signin';
      } catch (err) {
        alert("❌ Error during registration");
      }
    });
  }

  if (signinForm) {
    signinForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('signin-email').value;
      const password = document.getElementById('signin-password').value;

      try {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        alert(data.msg);
        if (res.ok) window.location.href = 'index';
      } catch (err) {
        alert("❌ Error during login");
      }
    });
  }
});


// Load cart from localStorage or start empty
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add event listeners to all "Add to Cart" buttons
document.querySelectorAll(".add-to-cart").forEach(btn => {
    btn.addEventListener("click", function (e) {
        e.preventDefault(); // ✅ Prevents the link from jumping to the top of the page

        const name = this.dataset.name;
        const price = parseFloat(this.dataset.price);
        const img = this.dataset.img;

        cart.push({ name, price, img });
        localStorage.setItem("cart", JSON.stringify(cart));

        // Optional: redirect to cart page
        window.location.href = "cart";
    });
});

document.addEventListener('DOMContentLoaded', () => {

  // ... (your existing signupForm and signinForm code) ...

  // ✅ ADD THIS LOGOUT LOGIC
  const logoutBtn = document.getElementById('logout-btn');

  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();

      // Clear user data (like the cart) from storage
      localStorage.removeItem('cart');
      // If you store an authentication token, remove it too:
      // localStorage.removeItem('authToken');

      alert("You have been successfully logged out.");

      // Redirect to the sign-in page
      window.location.href = 'signin';
    });
  }
});

document.addEventListener('DOMContentLoaded', () => {

    // ... (your existing signup, signin, and logout logic) ...

    // ✅ NEW: CONTACT FORM SUBMISSION LOGIC
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevent the form from reloading the page

            // Get the data from the form inputs
            const name = contactForm.querySelector('input[name="name"]').value;
            const email = contactForm.querySelector('input[name="email"]').value;
            const phone = contactForm.querySelector('input[name="phone"]').value;

            try {
                const res = await fetch('/api/contact', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, phone })
                });

                const data = await res.json();

                if (res.ok) {
                    alert('✅ Thank you for your message! We will be in touch soon.');
                    contactForm.reset(); // Clear the form fields
                } else {
                    alert(`❌ Error: ${data.msg}`);
                }

            } catch (err) {
                console.error('Contact form error:', err);
                alert('❌ There was a problem sending your message. Please try again.');
            }
        });
    }
});
const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const btnPopup = document.querySelector('.btnLogin-popup'); 
const iconClose = document.querySelector('.icon-close');
const loginForm = document.querySelector(".form-box.login form");
const registerForm = document.querySelector(".form-box.register form");

// Switch to registration form
registerLink.addEventListener('click', () => {
    wrapper.classList.add('active');
});

// Switch to login form
loginLink.addEventListener('click', () => {
    wrapper.classList.remove('active');
});

// Open popup
btnPopup.addEventListener('click', () => {
    wrapper.classList.add('active-popup');
});

// Close popup
iconClose.addEventListener('click', () => {
    wrapper.classList.remove('active-popup');
});

loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const role = document.getElementById("user-role").value;
    alert(`Logged in as ${role}`);
});

registerForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const role = document.getElementById("register-role").value;
    alert(`Registered as ${role}`);
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.createElement('div');
    mobileMenu.className = 'mobile-menu';
    document.body.appendChild(mobileMenu);

    hamburger.addEventListener('click', function() {
        mobileMenu.classList.toggle('active');
    });

    // Initialize cart functionality
    const cart = {
        items: [],
        count: document.querySelector('.cart-count'),
        total: 0,
        
        updateCount() {
            if (this.count) {
                this.count.textContent = this.items.length;
            }
        },
        
        addItem(item) {
            // Check if item already exists in cart
            const existingItem = this.items.find(i => i.name === item.name);
            if (existingItem) {
                existingItem.quantity += item.quantity;
                existingItem.total = existingItem.price * existingItem.quantity;
            } else {
                item.total = item.price * item.quantity;
                this.items.push(item);
            }
            this.updateCount();
            this.updateCartDisplay();
            this.showAddedToCartMessage();
        },
        
        updateCartDisplay() {
            const cartItems = document.querySelector('.cart-items');
            const subtotalAmount = document.querySelector('.subtotal-amount');
            
            if (cartItems) {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item">
                        <div class="cart-item-details">
                            <h4>${item.name}</h4>
                            <p>₹${item.price} x ${item.quantity}</p>
                        </div>
                        <div class="cart-item-total">₹${item.total.toFixed(2)}</div>
                    </div>
                `).join('');
                
                // Calculate and update subtotal
                this.total = this.items.reduce((sum, item) => sum + item.total, 0);
                if (subtotalAmount) {
                    subtotalAmount.textContent = `₹${this.total.toFixed(2)}`;
                }
            }
        },
        
        showAddedToCartMessage() {
            const message = document.createElement('div');
            message.className = 'cart-message';
            message.textContent = 'Added to cart!';
            document.body.appendChild(message);
            
            setTimeout(() => {
                message.remove();
            }, 2000);
        },
        
        clear() {
            this.items = [];
            this.total = 0;
            this.updateCount();
            this.updateCartDisplay();
        }
    };

    // Location tracking
    const userLocation = document.getElementById('user-location');
    
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Use a geocoding service to get the address
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                .then(response => response.json())
                .then(data => {
                    userLocation.textContent = data.display_name.split(',')[0];
                });
        });
    }

    // Add to cart functionality
    document.querySelectorAll('.view-menu-btn').forEach(button => {
        button.addEventListener('click', function() {
            const restaurantCard = this.closest('.restaurant-card');
            const restaurantName = restaurantCard.querySelector('h3').textContent;
            
            // Simulate menu items
            const menuItems = [
                { name: 'Margherita Pizza', price: 12.99 },
                { name: 'Pepperoni Pizza', price: 14.99 },
                { name: 'Vegetarian Pizza', price: 13.99 }
            ];

            // Show menu modal
            showMenuModal(restaurantName, menuItems);
        });
    });

    function showMenuModal(restaurantName, menuItems) {
        const modal = document.createElement('div');
        modal.className = 'menu-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <h2>${restaurantName} Menu</h2>
                <div class="menu-items">
                    ${menuItems.map(item => `
                        <div class="menu-item">
                            <h3>${item.name}</h3>
                            <p>$${item.price.toFixed(2)}</p>
                            <button class="add-to-cart" data-name="${item.name}" data-price="${item.price}">
                                Add to Cart
                            </button>
                        </div>
                    `).join('')}
                </div>
                <button class="close-modal">Close</button>
            </div>
        `;

        document.body.appendChild(modal);

        // Add to cart functionality
        modal.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const name = this.dataset.name;
                const price = parseFloat(this.dataset.price);
                
                cart.addItem({
                    name: name,
                    price: price
                });
            });
        });

        // Close modal
        modal.querySelector('.close-modal').addEventListener('click', function() {
            document.body.removeChild(modal);
        });
    }

    // FAQ Functionality
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.parentElement;
            faqItem.classList.toggle('active');
        });
    });

    // Contact Form Submission
    const supportForm = document.getElementById('support-form');
    if (supportForm) {
        supportForm.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message. We will get back to you soon!');
            supportForm.reset();
        });
    }

    // Live Chat Functionality
    window.startChat = function() {
        // Add your chat implementation here
        alert('Live chat feature coming soon!');
    };

    // Food Filters
    const filterButtons = document.querySelectorAll('.filter-btn');
    if (filterButtons) {
        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                // Add your filtering logic here
            });
        });
    }

    // Location Selection
    const locationButton = document.querySelector('.location');
    if (locationButton) {
        locationButton.addEventListener('click', () => {
            // Get user's location
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        // Here you would typically make an API call to get the address
                        // For now, we'll just show the coordinates
                        alert(`Location detected at: ${latitude}, ${longitude}`);
                    },
                    (error) => {
                        console.error('Error getting location:', error);
                        alert('Please enter your location manually');
                    }
                );
            } else {
                alert('Geolocation is not supported by your browser');
            }
        });
    }

    // Add to Cart Button Click Handlers
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.dish-card');
            const itemName = card.querySelector('h3').textContent;
            const itemPrice = card.querySelector('p').textContent;
            
            cart.addItem({
                name: itemName,
                price: itemPrice
            });
            
            // Show confirmation
            const originalText = button.textContent;
            button.textContent = 'Added!';
            button.disabled = true;
            
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        });
    });

    // Menu Navigation
    document.querySelectorAll('.view-menu-btn').forEach(button => {
        button.addEventListener('click', () => {
            const restaurantCard = button.closest('.restaurant-card');
            const restaurantName = restaurantCard.querySelector('h3').textContent;
            // Navigate to the restaurant's menu page
            window.location.href = `menu.html?restaurant=${encodeURIComponent(restaurantName)}`;
        });
    });

    // Update existing cart functionality
    const cartIcon = document.querySelector('.cart-icon');
    const cartSidebar = document.querySelector('.cart-sidebar');
    const cartItems = document.querySelector('.cart-items');
    const subtotalAmount = document.querySelector('.subtotal-amount');

    if (cartIcon && cartSidebar) {
        cartIcon.addEventListener('click', function() {
            cartSidebar.classList.toggle('active');
        });

        // Close cart when clicking outside
        document.addEventListener('click', function(e) {
            if (!cartIcon.contains(e.target) && !cartSidebar.contains(e.target)) {
                cartSidebar.classList.remove('active');
            }
        });

        // Checkout functionality
        document.querySelector('.checkout-btn').addEventListener('click', function() {
            if (cart.items.length === 0) {
                alert('Your cart is empty!');
                return;
            }

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal';
            modal.innerHTML = `
                <div class="modal-content">
                    <h2>Checkout</h2>
                    <form id="payment-form">
                        <div class="form-group">
                            <label>Card Number</label>
                            <input type="text" required>
                        </div>
                        <div class="form-group">
                            <label>Expiry Date</label>
                            <input type="text" placeholder="MM/YY" required>
                        </div>
                        <div class="form-group">
                            <label>CVV</label>
                            <input type="text" required>
                        </div>
                        <button type="submit">Pay Now</button>
                    </form>
                </div>
            `;

            document.body.appendChild(modal);

            // Handle payment form submission
            modal.querySelector('form').addEventListener('submit', function(e) {
                e.preventDefault();
                // Add payment processing logic here
                
                setTimeout(() => {
                    alert('Payment successful! Your order has been placed.');
                    cart.clear();
                    document.body.removeChild(modal);
                    cartSidebar.classList.remove('active');
                }, 1000);
            });
        });
    }

    // Tab switching functionality
    const tabButtons = document.querySelectorAll('.tab-btn');
    const loginForms = document.querySelectorAll('.login-form');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tab = this.dataset.tab;
            
            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding form
            loginForms.forEach(form => {
                form.classList.remove('active');
                if (form.id === `${tab}-login`) {
                    form.classList.add('active');
                }
            });
        });
    });

    // Password visibility toggle
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function() {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.classList.remove('fa-eye');
                this.classList.add('fa-eye-slash');
            } else {
                input.type = 'password';
                this.classList.remove('fa-eye-slash');
                this.classList.add('fa-eye');
            }
        });
    });

    // User login form submission
    const userLoginForm = document.getElementById('userLoginForm');
    if (userLoginForm) {
        userLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('user-email').value;
            const password = document.getElementById('user-password').value;
            
            // Simulate API call
            loginUser(email, password, 'user');
        });
    }

    // Owner login form submission
    const ownerLoginForm = document.getElementById('ownerLoginForm');
    if (ownerLoginForm) {
        ownerLoginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('owner-email').value;
            const password = document.getElementById('owner-password').value;
            
            // Simulate API call
            loginUser(email, password, 'owner');
        });
    }

    function loginUser(email, password, role) {
        // In a real application, this would be an API call
        // For demo purposes, we'll simulate a successful login
        const validCredentials = {
            'user@example.com': { password: 'password123', role: 'user' },
            'owner@example.com': { password: 'password123', role: 'owner' }
        };

        if (validCredentials[email] && 
            validCredentials[email].password === password && 
            validCredentials[email].role === role) {
            
            // Store login state
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('userRole', role);
            localStorage.setItem('userEmail', email);

            // Show success message
            showMessage('Login successful! Redirecting...', 'success');

            // Redirect based on role
            setTimeout(() => {
                if (role === 'owner') {
                    window.location.href = 'pages/owner-dashboard.html';
                } else {
                    window.location.href = 'pages/food.html';
                }
            }, 1000);
        } else {
            showMessage('Invalid email or password', 'error');
        }
    }

    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        document.querySelector('.login-box').appendChild(messageDiv);

        // Remove message after 3 seconds
        setTimeout(() => {
            messageDiv.remove();
        }, 3000);
    }

    // Check if user is already logged in
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const role = localStorage.getItem('userRole');
        if (role === 'owner') {
            window.location.href = 'pages/owner-dashboard.html';
        } else {
            window.location.href = 'pages/food.html';
        }
    }

    // Function to handle quantity controls and add to cart
    function initQuantityControls() {
        const quantityControls = document.querySelectorAll('.quantity-control');
        
        quantityControls.forEach(control => {
            const minusBtn = control.querySelector('.qty-btn.minus');
            const plusBtn = control.querySelector('.qty-btn.plus');
            const input = control.querySelector('.qty-input');
            const addToCartBtn = control.closest('.product-actions').querySelector('.add-to-cart-btn');
            
            if (minusBtn && plusBtn && input) {
                minusBtn.addEventListener('click', () => {
                    let value = parseInt(input.value);
                    if (value > 1) {
                        input.value = value - 1;
                    }
                });
                
                plusBtn.addEventListener('click', () => {
                    let value = parseInt(input.value);
                    input.value = value + 1;
                });
                
                input.addEventListener('change', () => {
                    let value = parseInt(input.value);
                    if (value < 1 || isNaN(value)) {
                        input.value = 1;
                    }
                });

                // Add to cart functionality
                if (addToCartBtn) {
                    addToCartBtn.addEventListener('click', () => {
                        const productCard = control.closest('.product-card');
                        const name = productCard.querySelector('h3').textContent;
                        const priceText = productCard.querySelector('.current-price').textContent;
                        const price = parseFloat(priceText.replace('₹', ''));
                        const quantity = parseInt(input.value);

                        cart.addItem({
                            name: name,
                            price: price,
                            quantity: quantity,
                            total: price * quantity
                        });
                    });
                }
            }
        });
    }

    // Add CSS for cart message
    const style = document.createElement('style');
    style.textContent = `
        .cart-message {
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: var(--primary-color);
            color: white;
            padding: 10px 20px;
            border-radius: 5px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);

    // Initialize quantity controls when DOM is loaded
    document.addEventListener('DOMContentLoaded', () => {
        initQuantityControls();
    });
});


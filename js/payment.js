/* global google */

// Google Maps API Key
const GOOGLE_MAPS_API_KEY = 'AIzaSyBNQg5wnkwQxBbBmBXfPzxpgGrPE-0N5Vk';

// Cart functionality
let cartItems = [];
let cartTotal = 0;

// Authentication state
let isLoggedIn = false;

// Load Google Maps API
function loadGoogleMapsAPI() {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    script.onerror = handleMapError;
    document.head.appendChild(script);
}

// Document Ready Handler
document.addEventListener('DOMContentLoaded', function() {
    // Load Google Maps API
    loadGoogleMapsAPI();

    // Initialize Authentication
    checkAuthState();

    // Initialize Cart
    loadCart();

    // Add event listeners
    setupEventListeners();

    // Initialize payment methods
    initializePaymentMethods();

    updateOrderSummary();
});

// Authentication Functions
function checkAuthState() {
    const user = localStorage.getItem('user');
    isLoggedIn = !!user;
    updateAuthUI();
}

function updateAuthUI() {
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const userDisplay = document.getElementById('userDisplay');

    if (isLoggedIn) {
        const user = JSON.parse(localStorage.getItem('user'));
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        if (userDisplay) {
            userDisplay.style.display = 'block';
            userDisplay.textContent = `Welcome, ${user.name}`;
        }
    } else {
        if (loginBtn) loginBtn.style.display = 'block';
        if (signupBtn) signupBtn.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
        if (userDisplay) userDisplay.style.display = 'none';
    }
}

function showLoginModal() {
    const modal = document.getElementById('loginModal');
    if (modal) modal.style.display = 'block';
}

function showSignupModal() {
    const modal = document.getElementById('signupModal');
    if (modal) modal.style.display = 'block';
}

function closeAuthModals() {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    if (loginModal) loginModal.style.display = 'none';
    if (signupModal) signupModal.style.display = 'none';
}

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    // Basic validation
    if (!email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll use localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        isLoggedIn = true;
        updateAuthUI();
        closeAuthModals();
        alert('Login successful!');
    } else {
        alert('Invalid credentials');
    }
}

function handleSignup(event) {
    event.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;

    // Basic validation
    if (!name || !email || !password) {
        alert('Please fill in all fields');
        return;
    }

    // Here you would typically make an API call to your backend
    // For demo purposes, we'll use localStorage
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(u => u.email === email)) {
        alert('Email already registered');
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('user', JSON.stringify(newUser));
    isLoggedIn = true;
    updateAuthUI();
    closeAuthModals();
    alert('Signup successful!');
}

function handleLogout() {
    localStorage.removeItem('user');
    isLoggedIn = false;
    updateAuthUI();
    window.location.href = 'index.html';
}

// Cart Functions
function loadCart() {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
        updateCartUI();
    }
}

function updateCartUI() {
    const cartCount = document.getElementById('cartCount');
    const cartTotalElement = document.getElementById('cartTotal');
    
    if (cartCount) {
        cartCount.textContent = cartItems.length;
    }

    if (cartTotalElement) {
        cartTotal = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
        cartTotalElement.textContent = `₹${cartTotal.toFixed(2)}`;
    }
}

function showCart() {
    const modal = document.getElementById('cartModal');
    const cartItemsList = document.getElementById('cartItems');
    
    if (modal && cartItemsList) {
        cartItemsList.innerHTML = '';
        cartItems.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <span>${item.name}</span>
                <span>₹${item.price.toFixed(2)} x ${item.quantity}</span>
                <button onclick="removeFromCart('${item.id}')">Remove</button>
            `;
            cartItemsList.appendChild(itemElement);
        });
        modal.style.display = 'block';
    }
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) modal.style.display = 'none';
}

function addToCart(item) {
    const existingItem = cartItems.find(i => i.id === item.id);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cartItems.push({ ...item, quantity: 1 });
    }
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
}

function removeFromCart(itemId) {
    cartItems = cartItems.filter(item => item.id !== itemId);
    localStorage.setItem('cart', JSON.stringify(cartItems));
    updateCartUI();
    showCart(); // Refresh cart display
}

// Event Listeners Setup
function setupEventListeners() {
    // Auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const cartBtn = document.getElementById('cartBtn');

    if (loginBtn) loginBtn.addEventListener('click', showLoginModal);
    if (signupBtn) signupBtn.addEventListener('click', showSignupModal);
    if (logoutBtn) logoutBtn.addEventListener('click', handleLogout);
    if (cartBtn) cartBtn.addEventListener('click', showCart);

    // Form submissions
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    // Close buttons for modals
    const closeButtons = document.querySelectorAll('.close-button');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            this.closest('.modal').style.display = 'none';
        });
    });
}

// Initialize payment methods
function initializePaymentMethods() {
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentDetails = document.querySelectorAll('.payment-details');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            paymentDetails.forEach(details => {
                details.classList.remove('active');
            });

            const selectedDetails = document.querySelector(`#${this.value}Details`);
            if (selectedDetails) {
                selectedDetails.classList.add('active');
            }
        });
    });
}

// Payment Method Selection
document.addEventListener('DOMContentLoaded', function() {
    // Load Google Maps API when the document is ready
    loadGoogleMapsAPI();

    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentDetails = document.querySelectorAll('.payment-details');

    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment details sections
            paymentDetails.forEach(details => {
                details.classList.remove('active');
            });

            // Show the selected payment details section
            const selectedDetails = document.querySelector(`#${this.value}Details`);
            if (selectedDetails) {
                selectedDetails.classList.add('active');
            }
        });
    });
});

// Form Validation
function validatePaymentForm() {
    const selectedMethod = document.querySelector('input[name="paymentMethod"]:checked');
    
    if (!selectedMethod) {
        alert('Please select a payment method');
        return false;
    }

    const method = selectedMethod.value;

    if (method === 'card') {
        const cardNumber = document.getElementById('cardNumber').value;
        const cardName = document.getElementById('cardName').value;
        const expiry = document.getElementById('expiry').value;
        const cvv = document.getElementById('cvv').value;

        if (!cardNumber || !cardName || !expiry || !cvv) {
            alert('Please fill in all card details');
            return false;
        }

        // Basic card number validation
        if (!/^\d{16}$/.test(cardNumber.replace(/\s/g, ''))) {
            alert('Please enter a valid 16-digit card number');
            return false;
        }

        // Basic CVV validation
        if (!/^\d{3,4}$/.test(cvv)) {
            alert('Please enter a valid CVV');
            return false;
        }

        // Basic expiry date validation
        if (!/^\d{2}\/\d{2}$/.test(expiry)) {
            alert('Please enter expiry date in MM/YY format');
            return false;
        }
    }

    if (method === 'upi') {
        const upiId = document.getElementById('upiId').value;
        if (!upiId || !/^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/.test(upiId)) {
            alert('Please enter a valid UPI ID');
            return false;
        }
    }

    if (method === 'netbanking') {
        const bank = document.getElementById('bank').value;
        if (!bank || bank === 'select') {
            alert('Please select a bank');
            return false;
        }
    }

    return true;
}

// Format Card Number
function formatCardNumber(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = '';
    
    for(let i = 0; i < value.length; i++) {
        if(i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }
    
    input.value = formattedValue.substring(0, 19); // Limit to 16 digits + 3 spaces
}

// Format Expiry Date
function formatExpiryDate(input) {
    let value = input.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if(value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    
    input.value = value.substring(0, 5); // Limit to MM/YY format
}

// Initialize Location Modal
/** @type {google.maps.Map} */
let map;
/** @type {google.maps.Marker} */
let marker;
/** @type {google.maps.places.Autocomplete} */
let autocomplete;
let isMapInitialized = false;

// Declare Google Maps initialization function
function initMap() {
    // Check if Google Maps API is loaded and not already initialized
    if (typeof google === 'undefined' || !google.maps || isMapInitialized) {
        handleMapError();
        return;
    }

    try {
        const defaultLocation = { lat: 20.5937, lng: 78.9629 }; // Default to India's center
        const mapContainer = document.getElementById('locationMap');
        
        if (!mapContainer) {
            console.error('Map container not found');
            return;
        }

        map = new google.maps.Map(mapContainer, {
            center: defaultLocation,
            zoom: 5,
            mapTypeControl: true,
            fullscreenControl: true,
            streetViewControl: true,
            mapTypeControlOptions: {
                style: google.maps.MapTypeControlStyle.DROPDOWN_MENU
            }
        });

        marker = new google.maps.Marker({
            map: map,
            draggable: true,
            position: defaultLocation,
            animation: google.maps.Animation.DROP
        });

        // Initialize the autocomplete input
        const searchInput = document.getElementById('locationSearch');
        if (searchInput) {
            autocomplete = new google.maps.places.Autocomplete(searchInput, {
                types: ['geocode'],
                componentRestrictions: { country: 'IN' } // Restrict to India
            });

            // Bind autocomplete to map
            autocomplete.bindTo('bounds', map);

            // Add event listeners
            autocomplete.addListener('place_changed', function() {
                const place = autocomplete.getPlace();
                if (!place.geometry) {
                    alert("No details available for this location");
                    return;
                }

                updateMapAndMarker(place.geometry.location);
            });

            marker.addListener('dragend', function() {
                reverseGeocode(marker.getPosition());
            });

            // Add place_changed event listener
            google.maps.event.addListener(map, 'click', function(event) {
                marker.setPosition(event.latLng);
                reverseGeocode(event.latLng);
            });

            isMapInitialized = true;
        }
    } catch (error) {
        console.error('Error initializing Google Maps:', error);
        handleMapError();
    }
}

function searchLocation() {
    if (typeof google === 'undefined') {
        handleMapError();
        return;
    }

    const input = document.getElementById('locationSearch');
    if (!input.value) {
        alert('Please enter a location to search');
        return;
    }

    try {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: input.value }, function(results, status) {
            if (status === 'OK') {
                updateMapAndMarker(results[0].geometry.location);
                input.value = results[0].formatted_address;
            } else {
                alert('Location search failed: ' + status);
            }
        });
    } catch (error) {
        console.error('Error searching location:', error);
        handleMapError();
    }
}

function updateMapAndMarker(location) {
    if (map && marker) {
        map.setCenter(location);
        map.setZoom(15);
        marker.setPosition(location);
    }
}

function reverseGeocode(position) {
    if (typeof google === 'undefined') {
        return;
    }

    try {
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ location: position }, function(results, status) {
            if (status === 'OK' && results[0]) {
                document.getElementById('locationSearch').value = results[0].formatted_address;
            }
        });
    } catch (error) {
        console.error('Error reverse geocoding:', error);
    }
}

function showLocationModal() {
    const modal = document.getElementById('locationModal');
    if (modal) {
        modal.style.display = 'block';
        // Initialize map if not already initialized
        if (!map) {
            initMap();
        }
    }
}

function closeLocationModal() {
    const modal = document.getElementById('locationModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function confirmLocation() {
    const locationInput = document.getElementById('locationSearch');
    const locationDisplay = document.getElementById('selectedLocation');
    
    if (locationInput && locationInput.value) {
        if (locationDisplay) {
            locationDisplay.textContent = locationInput.value;
        }
        closeLocationModal();
    } else {
        alert('Please select a location first');
    }
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('locationModal');
    if (event.target === modal) {
        closeLocationModal();
    }
}

// Handle Google Maps loading error
function handleMapError() {
    const mapContainer = document.getElementById('locationMap');
    if (mapContainer) {
        mapContainer.innerHTML = '<div class="map-error">Failed to load Google Maps. Please check your internet connection and try again.</div>';
    }
}

// Get cart data from localStorage
function getCartData() {
    const cartData = localStorage.getItem('cart');
    return cartData ? JSON.parse(cartData) : { items: [], total: 0 };
}

// Update order summary
function updateOrderSummary() {
    const cart = getCartData();
    const summaryItems = document.querySelector('.summary-items');
    const subtotalElement = document.querySelector('.subtotal .amount');
    const taxElement = document.querySelector('.tax .amount');
    const totalElement = document.querySelector('.total .amount');
    
    if (!summaryItems || !subtotalElement || !taxElement || !totalElement) {
        console.error('Required elements not found');
        return;
    }
    
    // Update items list
    summaryItems.innerHTML = cart.items.map(item => `
        <div class="summary-item">
            <span>${item.name} x ${item.quantity}</span>
            <span>₹${item.total.toFixed(2)}</span>
        </div>
    `).join('');
    
    // Calculate totals
    const subtotal = cart.items.reduce((sum, item) => sum + item.total, 0);
    const tax = subtotal * 0.05; // 5% tax
    const deliveryFee = 40;
    const total = subtotal + tax + deliveryFee;
    
    // Update amounts
    subtotalElement.textContent = `₹${subtotal.toFixed(2)}`;
    taxElement.textContent = `₹${tax.toFixed(2)}`;
    totalElement.textContent = `₹${total.toFixed(2)}`;
}

// Initialize payment page
document.addEventListener('DOMContentLoaded', function() {
    // Update order summary when page loads
    updateOrderSummary();
    
    // Handle payment method selection
    const paymentMethods = document.querySelectorAll('input[name="paymentMethod"]');
    const paymentDetails = document.querySelectorAll('.payment-details');
    
    paymentMethods.forEach(method => {
        method.addEventListener('change', function() {
            // Hide all payment details
            paymentDetails.forEach(detail => detail.style.display = 'none');
            
            // Show selected payment details
            const selectedMethod = this.value;
            const selectedDetails = document.getElementById(`${selectedMethod}Details`);
            if (selectedDetails) {
                selectedDetails.style.display = 'block';
            }
        });
    });
    
    // Handle form submission
    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = {
                fullName: document.getElementById('fullName').value,
                address: document.getElementById('address').value,
                city: document.getElementById('city').value,
                pincode: document.getElementById('pincode').value,
                phone: document.getElementById('phone').value,
                paymentMethod: document.querySelector('input[name="paymentMethod"]:checked')?.value
            };
            
            // Validate payment method
            if (!formData.paymentMethod) {
                alert('Please select a payment method');
                return;
            }
            
            // Validate payment details based on selected method
            const selectedMethod = formData.paymentMethod;
            let isValid = true;
            
            if (selectedMethod === 'card') {
                const cardNumber = document.getElementById('cardNumber').value;
                const expiry = document.getElementById('expiry').value;
                const cvv = document.getElementById('cvv').value;
                
                if (!cardNumber || !expiry || !cvv) {
                    alert('Please fill in all card details');
                    isValid = false;
                }
            } else if (selectedMethod === 'upi') {
                const upiId = document.getElementById('upiId').value;
                if (!upiId) {
                    alert('Please enter your UPI ID');
                    isValid = false;
                }
            } else if (selectedMethod === 'netbanking') {
                const bank = document.getElementById('bank').value;
                if (!bank) {
                    alert('Please select your bank');
                    isValid = false;
                }
            }
            
            if (!isValid) return;
            
            // Process payment (simulated)
            alert('Order placed successfully! Thank you for your purchase.');
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Redirect to home page
            window.location.href = '../index.html';
        });
    }
}); 
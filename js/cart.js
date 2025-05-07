// Cart functionality
const cart = {
    items: [],
    count: 0,
    total: 0,

    init() {
        this.loadFromLocalStorage();
        this.updateCartCount();
    },

    addItem(item) {
        const existingItem = this.items.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += item.quantity;
            existingItem.total = existingItem.price * existingItem.quantity;
        } else {
            item.total = item.price * item.quantity;
            this.items.push(item);
        }
        this.updateCartCount();
        this.saveToLocalStorage();
        this.showAddedToCartMessage();
    },

    removeItem(itemId) {
        this.items = this.items.filter(item => item.id !== itemId);
        this.updateCartCount();
        this.saveToLocalStorage();
    },

    updateQuantity(itemId, quantity) {
        const item = this.items.find(i => i.id === itemId);
        if (item) {
            item.quantity = quantity;
            item.total = item.price * quantity;
            this.updateCartCount();
            this.saveToLocalStorage();
        }
    },

    updateCartCount() {
        this.count = this.items.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElements = document.querySelectorAll('.cart-count');
        cartCountElements.forEach(element => {
            element.textContent = this.count;
        });
    },

    calculateTotal() {
        this.total = this.items.reduce((sum, item) => sum + item.total, 0);
        return this.total;
    },

    saveToLocalStorage() {
        localStorage.setItem('cart', JSON.stringify({
            items: this.items,
            total: this.total
        }));
    },

    loadFromLocalStorage() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            const { items, total } = JSON.parse(savedCart);
            this.items = items;
            this.total = total;
        }
    },

    clear() {
        this.items = [];
        this.total = 0;
        this.updateCartCount();
        localStorage.removeItem('cart');
    },

    showAddedToCartMessage() {
        const message = document.createElement('div');
        message.className = 'cart-message';
        message.textContent = 'Added to cart!';
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.remove();
        }, 2000);
    }
};

// Initialize cart when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    cart.init();

    // Add to cart button click handlers
    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', function() {
            const card = this.closest('.product-card, .food-item, .recommended-item');
            if (!card) return;

            const name = card.querySelector('h3').textContent;
            const priceText = card.querySelector('.current-price, .food-item-price, .recommended-price').textContent;
            const price = parseFloat(priceText.replace('₹', ''));
            const quantityInput = card.querySelector('.qty-input');
            const quantity = quantityInput ? parseInt(quantityInput.value) : 1;
            const id = card.dataset.id || name; // Use data-id if available, otherwise use name

            cart.addItem({
                id: id,
                name: name,
                price: price,
                quantity: quantity
            });
        });
    });

    // Quantity control handlers
    document.querySelectorAll('.quantity-control').forEach(control => {
        const minusBtn = control.querySelector('.minus');
        const plusBtn = control.querySelector('.plus');
        const input = control.querySelector('.qty-input');

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
        }
    });
}); 
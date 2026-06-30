var cartStorageKey = 'webshopCart';
var paymentForm = document.getElementById('paymentForm');
var payNowButton = document.getElementById('payNowButton');
var paymentMessage = document.getElementById('paymentMessage');
var summaryItems = document.getElementById('summaryItems');
var emptySummaryText = document.getElementById('emptySummaryText');
var summaryTotal = document.getElementById('summaryTotal');
var checkoutCart = [];
var hasCheckoutCartFromQuery = false;
var paymentSuccessModal = document.getElementById('paymentSuccessModal');
var orderNumberElement = document.getElementById('orderNumber');
var bootstrapModal = bootstrap.Modal.getOrCreateInstance(paymentSuccessModal);

// Add these variables for currency and shipping // Default currency
var deliveryPrices = {
    standard: 5.99,
    express: 12.99,
    pickup: 1000.00,
};

function readCartFromQuery(
) {
    var params = new URLSearchParams(window.location.search);
    var serializedCart = params.get('cart');

    if (!serializedCart) {
        return null;
    }

    try {
        var parsed = JSON.parse(serializedCart);
        if (Array.isArray(parsed)) {
            return parsed;
        }
    } catch (error) {
        return null;
    }

    return null;
}

function getCart(
) {
    if (hasCheckoutCartFromQuery) {
        return checkoutCart;
    }

    try {
        return JSON.parse(localStorage.getItem(cartStorageKey)) || [];
    } catch (error) {
        return [];
    }
}

function saveCart(cart) {
    checkoutCart = cart;
    try {
        localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    } catch (error) {
        return false;
    }

    return true;
}

// Modified function to format price with correct currency

function formatPrice(value) {
    return '€' + value.toFixed(2);
}

function showMessage(type, text) {
    paymentMessage.className = 'alert alert-' + type;
    paymentMessage.textContent = text;
    paymentMessage.classList.remove('d-none');
}

function clearMessage(
) {
    paymentMessage.className = 'alert d-none';
    paymentMessage.textContent = '';
}

// Add this function to get currency from localStorage


// Add this function to calculate shipping cost
function calculateShippingCost(subtotal) {
    const deliveryType = document.querySelector('input[name="deliveryType"]:checked');
    if (!deliveryType) return 0;
    
    const type = deliveryType.value;
    const basePrice = deliveryPrices[type];
    
    // Free shipping for orders over 100 (except for special/CEO delivery)
if (subtotal >= 100 && type !== 'pickup') {
        return 0;
    }
    
    return basePrice;
}

// Add this function to update the order summary with shipping
function updateOrderSummaryWithShipping(
) {
 const cart = getCart();
 let subtotal = 0;
 
 cart.forEach(item => {
 subtotal += item.price * item.quantity;
 });
 
 const shippingCost = calculateShippingCost(subtotal);
 const total = subtotal + shippingCost;
 
 // Update ALL total displays
const summaryTotalElements = document.querySelectorAll('.summary-total');
 summaryTotalElements.forEach(el => {
 el.textContent = formatPrice(total);
 });
 
 // Update ALL shipping displays
const shippingDisplayElements = document.querySelectorAll('.summary-shipping-cost');
 shippingDisplayElements.forEach(el => {
 if (shippingCost === 0) {
 el.textContent = 'FREE';
 } else {
 el.textContent = formatPrice(shippingCost);
 }
 });
}





function renderSummary(options = {}) {
 const cart = getCart();
 const summaryItems = document.querySelectorAll('.summary-items');
 const emptySummaryText = document.querySelectorAll('.empty-summary-text');
 
 // Clear all summary lists first
summaryItems.forEach(list => {
 list.innerHTML = '';
 });
 
 if (cart.length === 0) {
 // Show empty state on both summaries
emptySummaryText.forEach(el => {
 el.classList.remove('d-none');
 });
 summaryItems.forEach(list => {
 list.classList.add('d-none');
 });
 return;
 }
 
 // Hide empty state
emptySummaryText.forEach(el => {
 el.classList.add('d-none');
 });
 summaryItems.forEach(list => {
 list.classList.remove('d-none');
 });
 
 // Render items to both summaries
cart.forEach(item => {
 const li = document.createElement('li');
 li.className = 'list-group-item d-flex justify-content-between align-items-center';
 li.innerHTML = `
 <span>
 ${item.name} × ${item.quantity}
 </span>
 <span>${formatPrice(item.price * item.quantity)}</span>
 `;
 summaryItems.forEach(list => {
 list.appendChild(li.cloneNode(true));
 });
 });
 
 // Update shipping and totals
updateOrderSummaryWithShipping();
}



function sanitizeNumeric(value) {
    return value.replace(/\D/g, '');
}

function fakeOrderNumber(
) {
    return 'WS-' + Date.now().toString().slice(-8);
}

// Add event listeners for delivery type changes
document.querySelectorAll('input[name="deliveryType"]').forEach(radio => {
    radio.addEventListener('change', function(
) {
        updateOrderSummaryWithShipping();
    });
});

paymentForm.addEventListener('submit', function (event) {
 event.preventDefault();
 clearMessage();

 // 1. Apply Bootstrap visual validation for name/address
paymentForm.classList.add('was-validated');

 if (!paymentForm.checkValidity()) {
 // Stops if name/address are empty
return;
 }

 // 2. Now run your custom payment validations
var cardNumber = sanitizeNumeric(document.getElementById('cardNumber').value);
 var expiry = document.getElementById('expiry').value.trim();
 var cvc = sanitizeNumeric(document.getElementById('cvc').value);

 // Card number
if (cardNumber.length < 12 || cardNumber.length > 19) {
 showMessage('danger', 'Please enter a valid card number.');
 return;
 }

 // Expiry format: MM/YY
if (!/^\d{2}\/\d{2}$/.test(expiry)) {
 showMessage('danger', 'Please enter expiry as MM/YY.');
 return;
 }

 // Optional: Add expiry logic (not expired)
const [month, year] = expiry.split('/').map(Number);
 const currentYear = new Date().getFullYear() % 100;
 const currentMonth = new Date().getMonth() + 1;
 if (year < currentYear || (year === currentYear && month < currentMonth)) {
 showMessage('danger', 'Card has expired.');
 return;
 }

 // CVC
if (cvc.length < 3 || cvc.length > 4) {
 showMessage('danger', 'Please enter a valid CVC.');
 return;
 }

 // 3. If all good, proceed
payNowButton.disabled = true;
 payNowButton.textContent = 'Processing...';

 window.setTimeout(function (
) {
 var cart = getCart();
 if (cart.length === 0) {
 showMessage('warning', 'Your cart is empty. Please add an item before checkout.');
 payNowButton.disabled = false;
 payNowButton.textContent = 'Pay Now';
 return;
 }

 var orderId = fakeOrderNumber();
 saveCart([]);
 renderSummary({ silentEmptyState: true });

 orderNumberElement.textContent = orderId;
 bootstrapModal.show();

 paymentForm.reset();
 payNowButton.textContent = 'Pay Now';
 paymentForm.classList.remove('was-validated');
 }, 1300);
});


document.getElementById('cardNumber').addEventListener('input', function (event) {
    var digits = sanitizeNumeric(event.target.value).slice(0, 19);
    event.target.value = digits.replace(/(.{4})/g, '$1 ').trim();
});

document.getElementById('cvc').addEventListener('input', function (event) {
    event.target.value = sanitizeNumeric(event.target.value).slice(0, 4);
});

document.getElementById('expiry').addEventListener('input', function (event) {
    var digits = sanitizeNumeric(event.target.value).slice(0, 4);
    if (digits.length > 2) {
        event.target.value = digits.slice(0, 2) + '/' + digits.slice(2);
        return;
    }
    event.target.value = digits;
});

var queryCart = readCartFromQuery();
if (queryCart !== null) {
    checkoutCart = queryCart;
    hasCheckoutCartFromQuery = true;
}

// Set the currency on page load


// Initial render
renderSummary();




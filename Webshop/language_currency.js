// Currency only — simple and reliable
document.addEventListener('DOMContentLoaded', () => {
 const currencySelect = document.getElementById('currencySelect');

 // Load saved currency or default to EUR
const savedCurrency = localStorage.getItem('siteCurrency') || 'EUR';
 currencySelect.value = savedCurrency;

 // Apply the currency formatting
applyCurrency(savedCurrency);

 // Update when user changes selection
currencySelect.addEventListener('change', (e) => {
 const selectedCurrency = e.target.value;
 localStorage.setItem('siteCurrency', selectedCurrency);
 applyCurrency(selectedCurrency);
 document.dispatchEvent(new Event('currencyChange'));
 });
});

// Format all prices
function applyCurrency(currency) {
 const formatter = new Intl.NumberFormat('de-DE', {
 style: 'currency',
 currency: currency
 });

 document.querySelectorAll('.price').forEach(el => {
 const amount = parseFloat(el.getAttribute('data-amount')) || 0;
 el.textContent = formatter.format(amount);
 });
}

// Export a format function for reuse
function formatPrice(value) {
 const currency = localStorage.getItem('siteCurrency') || 'EUR';
 return new Intl.NumberFormat('de-DE', {
 style: 'currency',
 currency: currency
 }).format(value);
}

// Make it available globally
window.formatPrice = formatPrice;

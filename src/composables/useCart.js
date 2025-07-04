import { ref, computed, watch } from 'vue';

// Define a key for local storage
const CART_STORAGE_KEY = 'inventory_client_cart';

// Initialize cart from local storage or as an empty array
const initialCart = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || '[]');
const cartItems = ref(initialCart);

// Watch for changes in cartItems and persist to local storage
watch(cartItems, (newCart) => {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newCart));
}, { deep: true }); // Deep watch is important for nested object changes (e.g., quantity)

export function useCart() {

  // Computed property for total items in cart
  const cartTotalItems = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0);
  });

  // Computed property for total price of items in cart
  const cartTotalPrice = computed(() => {
    return cartItems.value.reduce((total, item) => total + (item.price_incl_vat * item.quantity), 0);
  });

  /**
   * Adds a product to the cart or updates its quantity if already present.
   * @param {Object} product - The product object to add. Must have id, name, price_incl_vat.
   * @param {number} quantity - The quantity to add.
   */
  const addToCart = (product, quantity = 1) => {
    const existingItem = cartItems.value.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cartItems.value.push({
        id: product.id,
        name: product.name,
        price_incl_vat: product.price_incl_vat,
        unit: product.unit, // Include unit for display
        quantity: quantity,
      });
    }
    // Optional: Add a small visual feedback (e.g., toast notification)
    console.log(`Added ${quantity} x ${product.name} to cart.`);
  };

  /**
   * Updates the quantity of a product in the cart.
   * @param {number} productId - The ID of the product.
   * @param {number} newQuantity - The new quantity. Must be >= 0.
   */
  const updateCartItemQuantity = (productId, newQuantity) => {
    const itemIndex = cartItems.value.findIndex(item => item.id === productId);

    if (itemIndex !== -1) {
      if (newQuantity <= 0) {
        // If new quantity is 0 or less, remove the item
        cartItems.value.splice(itemIndex, 1);
      } else {
        cartItems.value[itemIndex].quantity = newQuantity;
      }
    }
  };

  /**
   * Removes a product from the cart.
   * @param {number} productId - The ID of the product to remove.
   */
  const removeFromCart = (productId) => {
    cartItems.value = cartItems.value.filter(item => item.id !== productId);
    console.log(`Removed product ID ${productId} from cart.`);
  };

  /**
   * Clears all items from the cart.
   */
  const clearCart = () => {
    cartItems.value = [];
    console.log('Cart cleared.');
  };

  return {
    cartItems,
    cartTotalItems,
    cartTotalPrice,
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
  };
}

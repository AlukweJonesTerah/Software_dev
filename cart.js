// Cart management system using localStorage
const CART_KEY = 'nocturne_cart';
const PRODUCTS = [
  {
    id: 1,
    name: 'Glassroot',
    price: 24.99,
    description: 'Transparent stems storing thunderwater in tiny green chambers.',
    glow: 'Soft mint',
    scent: 'Ozone',
    soil: 'Quartz sand'
  },
  {
    id: 2,
    name: 'Embercap Moss',
    price: 18.99,
    description: 'Glows briefly when touched, then cools into a rust-colored velvet mat.',
    glow: 'Warm coral',
    scent: 'Burnt amber',
    soil: 'Ash and clay'
  },
  {
    id: 3,
    name: 'Clockvine',
    price: 22.99,
    description: 'Blooms in twelve small pulses, one for each hour before sunrise.',
    glow: 'Deep blue',
    scent: 'Bell metal',
    soil: 'Silver mica'
  },
  {
    id: 4,
    name: 'Whispergrain',
    price: 19.99,
    description: 'Records footsteps as pale rings and releases soft clicks at dawn.',
    glow: 'Pale gold',
    scent: 'Dry honey',
    soil: 'Chalk ridge'
  },
  {
    id: 5,
    name: 'Aurora Bean',
    price: 26.99,
    description: 'Paints small ribbons of color across nearby walls after midnight.',
    glow: 'Rose gold',
    scent: 'Burnt citrus',
    soil: 'Loam and mica'
  },
  {
    id: 6,
    name: 'Blue Hour Lily',
    price: 21.99,
    description: 'Opens for exactly seven minutes while the sky forgets its color.',
    glow: 'Cold blue',
    scent: 'Rain slate',
    soil: 'Shallow glass'
  }
];

function getCart() {
  const cart = localStorage.getItem(CART_KEY);
  return cart ? JSON.parse(cart) : [];
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(productId, quantity = 1) {
  const cart = getCart();
  const product = PRODUCTS.find(p => p.id === productId);
  if (!product) return;

  const existingItem = cart.find(item => item.id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.push({
      ...product,
      quantity
    });
  }
  saveCart(cart);
  return cart;
}

function removeFromCart(productId) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== productId);
  saveCart(cart);
  return cart;
}

function updateCartQuantity(productId, quantity) {
  const cart = getCart();
  const item = cart.find(i => i.id === productId);
  if (item) {
    if (quantity <= 0) {
      return removeFromCart(productId);
    }
    item.quantity = quantity;
    saveCart(cart);
  }
  return cart;
}

function getCartTotal() {
  const cart = getCart();
  return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

function getCartCount() {
  const cart = getCart();
  return cart.reduce((count, item) => count + item.quantity, 0);
}

function clearCart() {
  localStorage.removeItem(CART_KEY);
}

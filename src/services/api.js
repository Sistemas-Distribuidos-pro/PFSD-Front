import { authApi, orderApi, catalogApi } from './httpClient';

export const authService = {
  exchangeGoogleToken: (idToken) =>
    authApi.post('/auth/exchange', {
      provider: 'google',
      idToken,
    }),

  getCurrentUser: () => authApi.get('/auth/me'),
};

// ==================== PRODUCTS ====================
export const productService = {
  createProduct: (name, description, price, stock, category) =>
    catalogApi.post('/products', { name, description, price, stock, category }),

  getAllProducts: () =>
    catalogApi.get('/products'),

  getProductById: (id) =>
    catalogApi.get(`/products/${id}`),

  getByCategory: (category) =>
    catalogApi.get(`/products/category/${category}`),

  updateStock: (id, stock) =>
    catalogApi.put(`/products/${id}/stock?stock=${stock}`),

  updatePrice: (id, price) =>
    catalogApi.put(`/products/${id}/price?price=${price}`),
};

// ==================== CART ====================
export const cartService = {
  addToCart: (userId, productId, quantity) =>
    orderApi.post('/cart/add', { userId, productId, quantity }),

  getCart: (userId) =>
    orderApi.get(`/cart/${userId}`),

  removeFromCart: (userId, productId) =>
    orderApi.delete(`/cart/${userId}/item/${productId}`),

  clearCart: (userId) =>
    orderApi.delete(`/cart/${userId}`),
};

// ==================== ORDERS ====================
export const orderService = {
  createOrder: (userId) =>
    orderApi.post('/orders', { userId }),

  getOrderById: (id) =>
    orderApi.get(`/orders/${id}`),

  getUserOrders: (userId) =>
    orderApi.get(`/orders/user/${userId}`),

  getAllOrders: () =>
    orderApi.get('/orders'),
};

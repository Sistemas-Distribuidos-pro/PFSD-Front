import axios from 'axios';

const ORDER_API_URL = 'http://localhost:8081/api';
const AUTH_API_URL = 'http://localhost:8082/api';
const CATALOG_API_URL = 'http://localhost:8083/api';

const orderApi = axios.create({
  baseURL: ORDER_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const authApi = axios.create({
  baseURL: AUTH_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

const catalogApi = axios.create({
  baseURL: CATALOG_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== USERS ====================
export const userService = {
  register: (username, email, password, fullName) =>
    authApi.post('/users/register', { username, email, password, fullName }),
  
  login: (username, password) =>
    authApi.post('/users/login', { username, password }),
  
  getAllUsers: () =>
    authApi.get('/users'),
  
  getUserById: (id) =>
    authApi.get(`/users/${id}`),
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

export default orderApi;

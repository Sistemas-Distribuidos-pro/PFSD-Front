import React, { useState, useEffect, useCallback } from 'react';
import { productService, cartService, orderService, notificationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import './Shop.css';

const Shop = () => {
  const { user, logout } = useAuth();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutStatus, setCheckoutStatus] = useState('');
  const [checkoutMessage, setCheckoutMessage] = useState('');
  const [showCart, setShowCart] = useState(false);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    category: '',
  });

  const loadNotifications = useCallback(async () => {
    try {
      const response = await notificationService.getNotifications();
      setNotifications(response.data.data || []);
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    if (!user?.id) return;
    loadProducts();
    loadCart();
    loadNotifications();
  }, [user?.id, loadNotifications]);

  if (!user) return null;

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data.data || []);
    } catch (err) {
      console.error(err);
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const loadCart = async () => {
    try {
      const response = await cartService.getCart(user.id);
      setCart(response.data.data || []);
    } catch {
      setCart([]);
    }
  };

  const handleAddToCart = async (productId) => {
    try {
      await cartService.addToCart(user.id, productId, 1);
      loadCart();
      setError('');
      setCheckoutStatus('');
      setCheckoutMessage('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al agregar al carrito');
    }
  };

  const handleRemoveFromCart = async (productId) => {
    try {
      await cartService.removeFromCart(user.id, productId);
      loadCart();
    } catch {
      setError('Error al eliminar del carrito');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await productService.createProduct(
        newProduct.name,
        newProduct.description,
        Number.parseFloat(newProduct.price),
        Number.parseInt(newProduct.stock, 10),
        newProduct.category,
      );
      loadProducts();
      setNewProduct({ name: '', description: '', price: '', stock: '', category: '' });
      setShowAddProduct(false);
      setError('');
    } catch {
      setError('Error al crear producto');
    }
  };

  const handleCheckout = async () => {
    if (!cart.items || cart.items.length === 0 || checkoutLoading) return;
    try {
      setCheckoutLoading(true);
      setCheckoutStatus('');
      setCheckoutMessage('');
      setError('');
      await orderService.createOrder();
      await loadCart();
      setCheckoutStatus('success');
      setCheckoutMessage('Compra realizada correctamente.');
      setTimeout(() => loadNotifications(), 2000);
    } catch (err) {
      setCheckoutStatus('error');
      setCheckoutMessage(err.response?.data?.message || 'No se pudo completar el checkout.');
    } finally {
      setCheckoutLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const cartTotal = cart.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const cartCount = cart.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <div className="shop-container">
      {/* Header */}
      <header className="shop-header">
        <div className="header-content">
          <h1>🛍️ E-Commerce Frontend</h1>
          <div className="header-actions">
            <div className="user-info">
              <span>👤 {user.fullName || user.username}</span>
            </div>

            {/* Notificaciones */}
            <button
              className="btn-notifications"
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowCart(false);
              }}
            >
              🔔
              {notifications.length > 0 && (
                <span className="notification-badge">{notifications.length}</span>
              )}
            </button>

            <button
              className="btn-cart"
              onClick={() => {
                setShowCart(!showCart);
                setShowNotifications(false);
              }}
            >
              🛒 Carrito ({cartCount})
            </button>
            <button className="btn-logout" onClick={logout}>
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Panel de Notificaciones */}
      {showNotifications && (
        <div className="notifications-panel">
          <h3>🔔 Mis Alertas ({notifications.length})</h3>
          {notifications.length === 0 ? (
            <p className="no-notifications">No tienes alertas recientes</p>
          ) : (
            <ul className="notifications-list">
              {notifications.map((n, index) => (
                <li key={index} className="notification-item">
                  <div className="notification-header">
                    <strong>Orden #{n.orderId}</strong>
                    <span className="notification-date">{formatDate(n.detectedAt)}</span>
                  </div>
                  <ul className="notification-reasons">
                    {n.razones.map((razon, i) => (
                      <li key={i}>⚠️ {razon}</li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {/* Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* Main Content */}
      <div className="shop-content">
        {!showCart ? (
          <>
            <div className="add-product-section">
              <button
                className="btn-add-product"
                onClick={() => setShowAddProduct(!showAddProduct)}
              >
                {showAddProduct ? '✕ Cancelar' : '➕ Agregar Producto'}
              </button>
            </div>

            {showAddProduct && (
              <div className="add-product-form">
                <h3>Agregar Nuevo Producto</h3>
                <form onSubmit={handleCreateProduct}>
                  <input
                    type="text"
                    placeholder="Nombre"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    required
                  />
                  <textarea
                    placeholder="Descripción"
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Precio"
                    step="0.01"
                    value={newProduct.price}
                    onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                    required
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    value={newProduct.stock}
                    onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                    required
                  />
                  <input
                    type="text"
                    placeholder="Categoría (ej: Electrónica)"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                    required
                  />
                  <button type="submit" className="btn-primary">
                    Crear Producto
                  </button>
                </form>
              </div>
            )}

            <div className="products-grid">
              <h2>Catálogo de Productos</h2>
              {loading ? (
                <p className="loading">Cargando productos...</p>
              ) : products.length === 0 ? (
                <p className="no-products">No hay productos disponibles</p>
              ) : (
                <div className="products-list">
                  {products.map((product) => (
                    <div key={product.id} className="product-card">
                      <div className="product-header">
                        <h3>{product.name}</h3>
                        <span className="category">{product.category}</span>
                      </div>
                      <p className="description">{product.description}</p>
                      <div className="product-info">
                        <span className="price">${product.price.toFixed(2)}</span>
                        <span
                          className={`stock ${product.stock > 0 ? 'available' : 'unavailable'}`}
                        >
                          Stock: {product.stock}
                        </span>
                      </div>
                      <button
                        className="btn-add-cart"
                        onClick={() => handleAddToCart(product.id)}
                        disabled={product.stock === 0}
                      >
                        {product.stock === 0 ? 'Agotado' : 'Agregar al Carrito'}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="cart-view">
            <h2>🛒 Mi Carrito</h2>
            {checkoutMessage && (
              <div className={`checkout-message ${checkoutStatus}`}>{checkoutMessage}</div>
            )}
            {!cart.items || cart.items.length === 0 ? (
              <p className="empty-cart">Tu carrito está vacío</p>
            ) : (
              <>
                <div className="cart-items">
                  {cart.items.map((item) => (
                    <div key={item.productId} className="cart-item">
                      <div className="item-info">
                        <h4>{item.productName}</h4>
                        <p>
                          Precio: ${item.price.toFixed(2)} × {item.quantity} unidades
                        </p>
                        <strong>Subtotal: ${item.subtotal.toFixed(2)}</strong>
                      </div>
                      <button
                        className="btn-remove"
                        onClick={() => handleRemoveFromCart(item.productId)}
                      >
                        ✕ Eliminar
                      </button>
                    </div>
                  ))}
                </div>
                <div className="cart-summary">
                  <h3>Total: ${cartTotal.toFixed(2)}</h3>
                  <button
                    className="btn-checkout"
                    onClick={handleCheckout}
                    disabled={checkoutLoading}
                  >
                    {checkoutLoading ? 'Procesando...' : '💳 Proceder al Pago'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Shop;

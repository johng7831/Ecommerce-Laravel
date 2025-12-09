import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'
import FeaturedProduct from './FeaturedProduct'
import { useCart } from '../../context/CartContext'
import { CustomerAuthContext } from '../../context/CustomerAuth'
import './Shop.css'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, getCartTotal } = useCart()
  const { user } = useContext(CustomerAuthContext)

  const handleProceedToCheckout = () => {
    if (cartItems.length > 0) {
      if (user) {
        navigate('/checkout')
      } else {
        navigate('/login?redirect=/checkout')
      }
    }
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="cart-page">
          <div className="cart-container">
            <h1 className="cart-title">Shopping Cart</h1>
            <div className="cart-empty">
              <p>Your cart is empty</p>
              <button onClick={() => navigate('/shop')} className="shop-now-button">
                Shop Now
              </button>
            </div>
          </div>
        </div>
        <FeaturedProduct />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="cart-page">
        <div className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>
          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img 
                      src={item.image || 'https://via.placeholder.com/300x400?text=No+Image'} 
                      alt={item.title || 'Product'} 
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'
                      }}
                    />
                  </div>
                  <div className="cart-item-details">
                    <h3 className="cart-item-title">{item.title}</h3>
                    <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                  <button
                    className="cart-item-delete"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
            <div className="cart-summary">
              <div className="cart-subtotal">
                <span className="subtotal-label">Subtotal:</span>
                <span className="subtotal-amount">${getCartTotal().toFixed(2)}</span>
              </div>
              <button
                className="proceed-to-checkout-button"
                onClick={handleProceedToCheckout}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
        <FeaturedProduct />
      </div>
    </Layout>
  )
}

export default Cart

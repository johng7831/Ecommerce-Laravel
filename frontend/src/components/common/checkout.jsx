import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Layout from './Layout'
import FeaturedProduct from './FeaturedProduct'
import { useCart } from '../../context/CartContext'
import { CustomerAuthContext } from '../../context/CustomerAuth'
import api from '../../utils/api'
import './Shop.css'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getCartTotal, clearCart } = useCart()
  const { user } = useContext(CustomerAuthContext)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    phone: ''
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      navigate('/login?redirect=/checkout')
    } else {
      // Pre-fill form with user data
      setFormData(prev => ({
        ...prev,
        name: user.name || '',
        email: user.email || ''
      }))
    }
  }, [user, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // Prepare order items
      const items = cartItems.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
        name: item.title || item.name || '',
        image: item.image || '',
        size: item.size || '',
        color: item.color || ''
      }))

      // Calculate shipping
      const subtotal = getCartTotal()
      const shipping = 5.00 // Default shipping
      const totalPrice = subtotal + shipping

      // Prepare order data
      const orderData = {
        items: items,
        name: formData.name,
        email: formData.email,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip: formData.zip,
        phone: formData.phone,
        payment_method: paymentMethod,
        shipping: shipping,
        total_price: totalPrice
      }

      // Call API to save order
      const response = await api.post('/save-order', orderData)

      if (response.data && response.data.order_id) {
        // Clear cart after successful order
        clearCart()
        // Navigate to thank you page with order ID
        navigate(`/order/confirmed/${response.data.order_id}`)
      } else {
        setError('Failed to place order. Please try again.')
      }
    } catch (err) {
      console.error('Order submission error:', err)
      setError(err.response?.data?.message || 'Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null // Will redirect in useEffect
  }

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="checkout-page">
          <div className="checkout-container">
            <h1 className="checkout-title">Checkout</h1>
            <div className="checkout-empty">
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
      <div className="checkout-page">
        <div className="checkout-container">
          <h1 className="checkout-title">Checkout</h1>
          <div className="checkout-content">
            <div className="checkout-form-section">
              <h2 className="checkout-section-title">Shipping Information</h2>
              <form onSubmit={handleSubmit} className="checkout-form">
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="address">Address</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="zip">Zip Code</label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={formData.zip}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </form>
            </div>

            <div className="checkout-summary-section">
              <h2 className="checkout-section-title">Order Summary</h2>
              <div className="checkout-products">
                {cartItems.map((item) => (
                  <div key={item.id} className="checkout-product-item">
                    <div className="checkout-product-image">
                      <img 
                        src={item.image || 'https://via.placeholder.com/300x400?text=No+Image'} 
                        alt={item.title || 'Product'} 
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400?text=No+Image'
                        }}
                      />
                    </div>
                    <div className="checkout-product-details">
                      <h3 className="checkout-product-title">{item.title}</h3>
                      <p className="checkout-product-price">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="payment-method-section">
                <h3 className="payment-method-title">Payment Method</h3>
                <div className="payment-options">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Cash on Delivery (COD)</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === 'stripe'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>Stripe</span>
                  </label>
                </div>
              </div>

              <div className="checkout-total">
                <div className="checkout-total-row">
                  <span className="total-label">Subtotal:</span>
                  <span className="total-amount">${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="checkout-total-row">
                  <span className="total-label">Shipping:</span>
                  <span className="total-amount">$5.00</span>
                </div>
                <div className="checkout-total-row checkout-grand-total">
                  <span className="total-label">Total:</span>
                  <span className="total-amount">${(getCartTotal() + 5.00).toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <div className="error-message" style={{ color: 'red', marginBottom: '10px' }}>
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="pay-now-button"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>
        <FeaturedProduct />
      </div>
    </Layout>
  )
}

export default Checkout


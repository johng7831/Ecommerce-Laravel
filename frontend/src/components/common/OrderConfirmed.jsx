import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from './Layout'
import FeaturedProduct from './FeaturedProduct'
import api from '../../utils/api'
import './Shop.css'

const OrderConfirmed = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await api.get(`/order/${id}`)
        if (response.data && response.data.order) {
          setOrder(response.data.order)
        }
      } catch (err) {
        console.error('Error fetching order:', err)
        setError('Failed to load order details')
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchOrder()
  }, [id])

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)

    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const calculateSubtotal = () => {
    if (!order) return 0
    const items = order.order_items || order.orderItems || []

    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0
      const qty = Number(item.quantity) || 0
      return sum + price * qty
    }, 0)
  }

  const calculateShipping = () => {
    if (!order) return 0
    const subtotal = calculateSubtotal()
    return Number(order.total_price) - subtotal
  }

  if (loading) {
    return (
      <Layout>
        <div className="order-confirmed-page">
          <div className="order-confirmed-container">
            <p>Loading order details...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="order-confirmed-page">
          <div className="order-confirmed-container">
            <p>{error || 'Order not found'}</p>
            <button onClick={() => navigate('/')} className="continue-shopping-button">
              Continue Shopping
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const subtotal = calculateSubtotal()
  const shipping = calculateShipping()
  const grandTotal = Number(order.total_price) || 0

  return (
    <Layout>
      <div className="order-confirmed-page">
        <div className="order-confirmed-container">

          <div className="thank-you-section">
            <h1 className="thank-you-title">Thank You!</h1>
            <p className="thank-you-message">Your order has been successfully placed.</p>
          </div>

          <div className="order-summary-card">
            <h2 className="order-summary-title">Order Summary</h2>

            <div className="order-summary-content">
              <div className="order-details-section">
                <div className="order-detail-item">
                  <span className="order-detail-label">Order ID:</span>
                  <span className="order-detail-value">#{order.id}</span>
                </div>

                <div className="order-detail-item">
                  <span className="order-detail-label">Date:</span>
                  <span className="order-detail-value">{formatDate(order.created_at)}</span>
                </div>

                <div className="order-detail-item">
                  <span className="order-detail-label">Status:</span>
                  <span className={`order-status order-status-${order.status.toLowerCase()}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-detail-item">
                  <span className="order-detail-label">Payment Method:</span>
                  <span className="order-detail-value">
                    {order.payment_method === 'cod'
                      ? 'Cash On Delivery'
                      : order.payment_method.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="customer-info-section">
                <div className="customer-info-item">
                  <span className="customer-info-label">Customer:</span>
                  <span className="customer-info-value">{order.name}</span>
                </div>

                <div className="customer-info-item">
                  <span className="customer-info-label">Address:</span>
                  <span className="customer-info-value">
                    {order.address}, {order.city}, {order.state}, {order.zip}
                  </span>
                </div>

                <div className="customer-info-item">
                  <span className="customer-info-label">Contact:</span>
                  <span className="customer-info-value">{order.phone}</span>
                </div>
              </div>
            </div>

            <div className="order-items-section">
              <table className="order-items-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>

                <tbody>
                  {(order.order_items || order.orderItems || []).map((item) => {
                    const price = Number(item.price) || 0
                    const quantity = Number(item.quantity) || 0

                    return (
                      <tr key={item.id}>
                        <td>{item.name}</td>
                        <td>{quantity}</td>
                        <td>${price.toFixed(2)}</td>
                        <td>${(price * quantity).toFixed(2)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>

            <div className="order-pricing-section">
              <div className="pricing-row">
                <span className="pricing-label">Subtotal</span>
                <span className="pricing-value">${subtotal.toFixed(2)}</span>
              </div>

              <div className="pricing-row">
                <span className="pricing-label">Shipping</span>
                <span className="pricing-value">${shipping.toFixed(2)}</span>
              </div>

              <div className="pricing-row pricing-grand-total">
                <span className="pricing-label">Grand Total</span>
                <span className="pricing-value">${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="order-actions">
            <button
              onClick={() => navigate('/account/dashboard')}
              className="order-details-button"
            >
              Order Details
            </button>

            <button
              onClick={() => navigate('/shop')}
              className="continue-shopping-button"
            >
              Continue Shopping
            </button>
          </div>
        </div>

        <FeaturedProduct />
      </div>
    </Layout>
  )
}

export default OrderConfirmed

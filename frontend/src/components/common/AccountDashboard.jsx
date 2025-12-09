import React, { useContext, useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomerAuthContext } from '../../context/CustomerAuth'
import Layout from './Layout'
import api from '../../utils/api'
import './Auth.css'

const AccountDashboard = () => {
  const { user, logout } = useContext(CustomerAuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('account')
  const [orders, setOrders] = useState([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [ordersError, setOrdersError] = useState(null)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  useEffect(() => {
    if (activeTab === 'orders' && user) {
      fetchOrders()
    }
  }, [activeTab, user])

  const fetchOrders = async () => {
    try {
      setOrdersLoading(true)
      setOrdersError(null)
      const response = await api.get('/user/orders')
      if (response.data && response.data.status === 200) {
        setOrders(response.data.data || [])
      } else {
        setOrdersError('Failed to load orders')
      }
    } catch (err) {
      console.error('Error fetching orders:', err)
      setOrdersError('Failed to load orders')
    } finally {
      setOrdersLoading(false)
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    })
  }

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || ''
    if (statusLower === 'pending') return 'order-status-pending'
    if (statusLower === 'completed' || statusLower === 'delivered') return 'order-status-delivered'
    if (statusLower === 'processing' || statusLower === 'shipped') return 'order-status-shipped'
    return 'order-status-pending'
  }

  const handleOrderClick = (orderId) => {
    navigate(`/order/confirmed/${orderId}`)
  }

  if (!user) {
    return (
      <Layout>
        <div className="auth-page">
          <div className="dashboard-container">
            <p>Please login to view your dashboard.</p>
            <Link to="/login" className="auth-link">Go to Login</Link>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="dashboard-page">
        <div className="dashboard-container">
          <div className="dashboard-header">
            <h1 className="dashboard-title">My Account</h1>
          </div>

          <div className="dashboard-content">
            <div className="dashboard-sidebar">
              <div className="dashboard-sidebar-card">
                <button 
                  className={`dashboard-nav-item ${activeTab === 'account' ? 'active' : ''}`}
                  onClick={() => setActiveTab('account')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  My Account
                </button>
                <div className="dashboard-nav-divider"></div>
                <button 
                  className={`dashboard-nav-item ${activeTab === 'orders' ? 'active' : ''}`}
                  onClick={() => setActiveTab('orders')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11l3 3L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Orders
                </button>
                <div className="dashboard-nav-divider"></div>
                <button 
                  className={`dashboard-nav-item ${activeTab === 'password' ? 'active' : ''}`}
                  onClick={() => setActiveTab('password')}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Change Password
                </button>
                <div className="dashboard-nav-divider"></div>
                <button 
                  className="dashboard-nav-item logout-nav-item"
                  onClick={handleLogout}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Logout
                </button>
              </div>
            </div>

            <div className="dashboard-main">
              {activeTab === 'account' && (
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h2>Account Information</h2>
                  </div>
                  <div className="dashboard-card-body">
                    <div className="info-row">
                      <span className="info-label">Name:</span>
                      <span className="info-value">{user.name}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Email:</span>
                      <span className="info-value">{user.email}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Account Type:</span>
                      <span className="info-value">Customer</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && (
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h2>My Orders</h2>
                  </div>
                  <div className="dashboard-card-body">
                    {ordersLoading && (
                      <p style={{ textAlign: 'center', padding: '20px' }}>Loading orders...</p>
                    )}
                    {ordersError && (
                      <p style={{ textAlign: 'center', padding: '20px', color: '#ef4444' }}>
                        {ordersError}
                      </p>
                    )}
                    {!ordersLoading && !ordersError && orders.length === 0 && (
                      <p style={{ textAlign: 'center', padding: '20px' }}>No orders found.</p>
                    )}
                    {!ordersLoading && !ordersError && orders.length > 0 && (
                      <div className="orders-grid">
                        {orders.map((order) => {
                          const orderItems = order.order_items || order.orderItems || []
                          const firstItem = orderItems[0]
                          const imageUrl = firstItem?.image
                            ? `http://localhost:8000/upload/products/${firstItem.image}`
                            : 'https://via.placeholder.com/150'
                          
                          return (
                            <div
                              key={order.id}
                              className="order-card"
                              onClick={() => handleOrderClick(order.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <div className="order-image">
                                <img
                                  src={imageUrl}
                                  alt={firstItem?.name || 'Order Product'}
                                  onError={(e) => {
                                    if (firstItem?.image) {
                                      e.target.src = `http://localhost:8000/upload/products/thumb_${firstItem.image}`
                                    } else {
                                      e.target.src = 'https://via.placeholder.com/150'
                                    }
                                  }}
                                />
                              </div>
                              <div className="order-info">
                                <h3 className="order-title">Order #{order.id}</h3>
                                <p className="order-date">
                                  Placed on {formatDate(order.created_at)}
                                </p>
                                <p className={`order-status ${getStatusClass(order.status)}`}>
                                  {order.status || 'Pending'}
                                </p>
                                <p style={{ fontSize: '14px', fontWeight: '600', marginTop: '8px', color: '#111827' }}>
                                  ${Number(order.total_price || 0).toFixed(2)}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'password' && (
                <div className="dashboard-card">
                  <div className="dashboard-card-header">
                    <h2>Change Password</h2>
                  </div>
                  <div className="dashboard-card-body">
                    <p>Password change functionality coming soon.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AccountDashboard

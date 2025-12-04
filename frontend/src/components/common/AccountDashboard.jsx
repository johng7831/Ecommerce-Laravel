import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { CustomerAuthContext } from '../../context/CustomerAuth'
import Layout from './Layout'
import './Auth.css'

const AccountDashboard = () => {
  const { user, logout } = useContext(CustomerAuthContext)
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('account')

  const handleLogout = () => {
    logout()
    navigate('/')
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
                    <div className="orders-grid">
                      <div className="order-card">
                        <div className="order-image">
                          <img src="https://via.placeholder.com/150" alt="Order Product" />
                        </div>
                        <div className="order-info">
                          <h3 className="order-title">Order #12345</h3>
                          <p className="order-date">Placed on Jan 15, 2024</p>
                          <p className="order-status">Delivered</p>
                        </div>
                      </div>
                      <div className="order-card">
                        <div className="order-image">
                          <img src="https://via.placeholder.com/150" alt="Order Product" />
                        </div>
                        <div className="order-info">
                          <h3 className="order-title">Order #12346</h3>
                          <p className="order-date">Placed on Jan 10, 2024</p>
                          <p className="order-status">Shipped</p>
                        </div>
                      </div>
                      <div className="order-card">
                        <div className="order-image">
                          <img src="https://via.placeholder.com/150" alt="Order Product" />
                        </div>
                        <div className="order-info">
                          <h3 className="order-title">Order #12347</h3>
                          <p className="order-date">Placed on Jan 5, 2024</p>
                          <p className="order-status">Processing</p>
                        </div>
                      </div>
                    </div>
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

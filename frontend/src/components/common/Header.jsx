import React, { useContext, useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { CustomerAuthContext } from '../../context/CustomerAuth'

const Header = () => {
  const navigate = useNavigate()
  const { getCartItemsCount } = useCart()
  const { user, logout } = useContext(CustomerAuthContext)
  const cartCount = getCartItemsCount()
  const [showAccountMenu, setShowAccountMenu] = useState(false)
  const accountMenuRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (accountMenuRef.current && !accountMenuRef.current.contains(event.target)) {
        setShowAccountMenu(false)
      }
    }

    if (showAccountMenu) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showAccountMenu])

  return (
    <header className="site-header">
      <nav className="nav">
        <div className="nav-left">
          <Link to="/" className="logo" aria-label="Homepage">ShopMate</Link>
          <ul className="nav-categories" role="menubar" aria-label="Product categories">
            <li role="none"><Link to="/shop" role="menuitem" className="nav-link">Shop</Link></li>
            <li role="none"><a role="menuitem" href="#" className="nav-link">Man</a></li>
            <li role="none"><a role="menuitem" href="#" className="nav-link">Women</a></li>
            <li role="none"><a role="menuitem" href="#" className="nav-link">Child</a></li>
          </ul>
        </div>

        <div className="nav-right">
          <button className="icon-button" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M21 21l-3.5-3.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <div className="account-menu-wrapper" ref={accountMenuRef}>
            {user ? (
              <>
                <button 
                  className="icon-button" 
                  aria-label="User account"
                  onClick={() => setShowAccountMenu(!showAccountMenu)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 22a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showAccountMenu && (
                  <div className="account-dropdown">
                    <div className="account-dropdown-header">
                      <p className="account-name">{user.name}</p>
                      <p className="account-email">{user.email}</p>
                    </div>
                    <div className="account-dropdown-divider"></div>
                    <Link 
                      to="/account/dashboard" 
                      className="account-dropdown-item"
                      onClick={() => setShowAccountMenu(false)}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M9 22V12h6v10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      My Account
                    </Link>
                    <button 
                      className="account-dropdown-item logout-item"
                      onClick={() => {
                        logout()
                        setShowAccountMenu(false)
                        navigate('/')
                      }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4m7 14l5-5-5-5m5 5H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <button 
                className="icon-button" 
                aria-label="Login"
                onClick={() => navigate('/login')}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                  <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M20 22a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            )}
          </div>
          <button 
            className="icon-button" 
            aria-label="Cart"
            onClick={() => navigate('/cart')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path d="M6 6h15l-1.5 9H8L6 3H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="9" cy="21" r="1.5" fill="currentColor"/>
              <circle cx="18" cy="21" r="1.5" fill="currentColor"/>
            </svg>
            {cartCount > 0 && (
              <span className="cart-count" aria-hidden="true">{cartCount}</span>
            )}
          </button>
        </div>
      </nav>
    </header>
  )
}

export default Header



import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AdminAuthContext } from "../../context/AdminAuth";
import "./Admin.css";

const AdminLayout = ({ children }) => {
  const { logout } = useContext(AdminAuthContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/admin/login");
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getPageTitle = () => {
    const path = location.pathname;
    if (path.includes('/categories')) return 'Categories';
    if (path.includes('/brands')) return 'Brands';
    if (path.includes('/products')) return 'Products';
    if (path.includes('/orders')) return 'Orders';
    if (path.includes('/users')) return 'Users';
    if (path.includes('/shipping')) return 'Shipping';
    if (path.includes('/change-password')) return 'Change Password';
    return 'Dashboard';
  };

  return (
    <div className="admin-layout">
      {/* Top Banner */}
      <div className="admin-banner">
        <span>Your fashion partner</span>
      </div>

      {/* Main Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <span className="logo-icon">🏷️</span>
            <span className="logo-text">Pure Wear</span>
          </div>
          <div className="admin-header-nav">
            <Link to="/shop" className="header-nav-link">Mens</Link>
            <Link to="/shop" className="header-nav-link">Women</Link>
            <Link to="/shop" className="header-nav-link">Kids</Link>
            <button className="header-icon-btn" aria-label="Account">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M20 22a8 8 0 1 0-16 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="header-icon-btn" aria-label="Cart">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 6h15l-1.5 9H8L6 3H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <circle cx="9" cy="21" r="1.5" fill="currentColor"/>
                <circle cx="18" cy="21" r="1.5" fill="currentColor"/>
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="admin-main">
        <div className="admin-container">
          {/* Sidebar Navigation */}
          <aside className="admin-sidebar">
            <h2 className="admin-page-title">{getPageTitle()}</h2>
            <nav className="admin-nav">
              <Link 
                to="/admin/dashboard" 
                className={`admin-nav-link ${isActive("/admin/dashboard") ? "active" : ""}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/admin/categories" 
                className={`admin-nav-link ${isActive("/admin/categories") ? "active" : ""}`}
              >
                Categories
              </Link>
              <Link 
                to="/admin/brands" 
                className={`admin-nav-link ${isActive("/admin/brands") ? "active" : ""}`}
              >
                Brands
              </Link>
              <Link 
                to="/admin/products" 
                className={`admin-nav-link ${isActive("/admin/products") ? "active" : ""}`}
              >
                Products
              </Link>
              <Link 
                to="/admin/orders" 
                className={`admin-nav-link ${isActive("/admin/orders") ? "active" : ""}`}
              >
                Orders
              </Link>
              <Link 
                to="/admin/users" 
                className={`admin-nav-link ${isActive("/admin/users") ? "active" : ""}`}
              >
                Users
              </Link>
              <Link 
                to="/admin/shipping" 
                className={`admin-nav-link ${isActive("/admin/shipping") ? "active" : ""}`}
              >
                Shipping
              </Link>
              <Link 
                to="/admin/change-password" 
                className={`admin-nav-link ${isActive("/admin/change-password") ? "active" : ""}`}
              >
                Change Password
              </Link>
              <button 
                onClick={handleLogout}
                className="admin-nav-link logout-link"
              >
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="admin-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;


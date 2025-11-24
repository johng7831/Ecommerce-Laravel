import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../admin/AdminLayout";
import "../admin/Admin.css";

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    products: 0
  });

  // TODO: Fetch actual stats from API
  useEffect(() => {
    // This would fetch from API
    // For now, using placeholder values
    setStats({
      users: 0,
      orders: 0,
      products: 0
    });
  }, []);

  return (
    <AdminLayout>
      <div className="dashboard-summary">
        <div className="summary-card">
          <div className="summary-card-number">{stats.users}</div>
          <div className="summary-card-label">Users</div>
          <Link to="/admin/users" className="summary-card-link">
            View Users
          </Link>
        </div>

        <div className="summary-card">
          <div className="summary-card-number">{stats.orders}</div>
          <div className="summary-card-label">Orders</div>
          <Link to="/admin/orders" className="summary-card-link">
            View Orders
          </Link>
        </div>

        <div className="summary-card">
          <div className="summary-card-number">{stats.products}</div>
          <div className="summary-card-label">Products</div>
          <Link to="/admin/products" className="summary-card-link">
            View Products
          </Link>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;

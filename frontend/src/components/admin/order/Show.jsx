import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminInfo");
      const adminInfo = token ? JSON.parse(token) : null;

      if (!adminInfo || !adminInfo.token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/admin/orders", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const data = await response.json();
      if (data.status === 200) {
        setOrders(data.data || []);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "pending") return "status-pending";
    if (statusLower === "completed" || statusLower === "delivered") return "status-completed";
    if (statusLower === "processing" || statusLower === "shipped") return "status-processing";
    return "status-pending";
  };

  const handleOrderClick = (orderId) => {
    navigate(`/admin/orders/${orderId}`);
  };

  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <p className="categories-subtitle">
              View and manage all customer orders from your store.
            </p>
            <h1 className="categories-title">Orders</h1>
          </div>
        </div>

        {loading && (
          <div className="empty-state">
            <p>Loading orders...</p>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <p style={{ color: "#ef4444" }}>Error: {error}</p>
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="empty-state">
            <p>No orders found.</p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="categories-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Payment Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} style={{ cursor: "pointer" }}>
                    <td>#{order.id}</td>
                    <td>{order.name || order.user?.name || "-"}</td>
                    <td>{order.email || order.user?.email || "-"}</td>
                    <td>${Number(order.total_price || 0).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {order.status || "Pending"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.payment_status)}`}>
                        {order.payment_status || "Pending"}
                      </span>
                    </td>
                    <td>{formatDate(order.created_at)}</td>
                    <td>
                      <button
                        className="action-btn edit-btn"
                        onClick={() => handleOrderClick(order.id)}
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Orders;


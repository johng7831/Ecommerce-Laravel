import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminInfo");
      const adminInfo = token ? JSON.parse(token) : null;

      if (!adminInfo || !adminInfo.token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:8000/api/admin/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch order details");
      }

      const data = await response.json();
      if (data.status === 200) {
        setOrder(data.data);
      } else {
        setError("Failed to load order details");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch order details");
      console.error("Error fetching order details:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    const statusLower = status?.toLowerCase() || "";
    if (statusLower === "pending") return "status-pending";
    if (statusLower === "completed" || statusLower === "delivered") return "status-completed";
    if (statusLower === "processing" || statusLower === "shipped") return "status-processing";
    return "status-pending";
  };

  const calculateSubtotal = () => {
    if (!order) return 0;
    const items = order.order_items || order.orderItems || [];
    return items.reduce((sum, item) => {
      const price = Number(item.price) || 0;
      const qty = Number(item.quantity) || 0;
      return sum + price * qty;
    }, 0);
  };

  const calculateShipping = () => {
    if (!order) return 0;
    const subtotal = calculateSubtotal();
    return Number(order.total_price) - subtotal;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="categories-page">
          <div className="empty-state">
            <p>Loading order details...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !order) {
    return (
      <AdminLayout>
        <div className="categories-page">
          <div className="empty-state">
            <p style={{ color: "#ef4444" }}>{error || "Order not found"}</p>
            <Link to="/admin/orders" className="action-btn edit-btn" style={{ marginTop: "16px", display: "inline-block" }}>
              Back to Orders
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const subtotal = calculateSubtotal();
  const shipping = calculateShipping();
  const grandTotal = Number(order.total_price) || 0;
  const orderItems = order.order_items || order.orderItems || [];

  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <p className="categories-subtitle">Order Details</p>
            <h1 className="categories-title">Order #{order.id}</h1>
          </div>
          <Link to="/admin/orders" className="add-category-btn">
            Back to Orders
          </Link>
        </div>

        <div style={{ background: "#fff", borderRadius: "8px", padding: "24px", marginTop: "24px" }}>
          {/* Order Information */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>
              Order Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Order ID</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>#{order.id}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Date</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{formatDate(order.created_at)}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Status</p>
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {order.status || "Pending"}
                </span>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Payment Method</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                  {order.payment_method === "cod" ? "Cash On Delivery" : order.payment_method?.toUpperCase() || "-"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Payment Status</p>
                <span className={`status-badge ${getStatusClass(order.payment_status)}`}>
                  {order.payment_status || "Pending"}
                </span>
              </div>
            </div>
          </div>

          {/* Customer Information */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>
              Customer Information
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Name</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{order.name || order.user?.name || "-"}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Email</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{order.email || order.user?.email || "-"}</p>
              </div>
              <div>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Phone</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{order.phone || "-"}</p>
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <p style={{ fontSize: "12px", color: "#6b7280", marginBottom: "4px" }}>Address</p>
                <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                  {order.address ? `${order.address}, ${order.city}, ${order.state} ${order.zip}` : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div style={{ marginBottom: "32px" }}>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>
              Order Items
            </h2>
            <div style={{ overflowX: "auto" }}>
              <table className="categories-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Size</th>
                    <th>Color</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderItems.map((item) => {
                    const price = Number(item.price) || 0;
                    const quantity = Number(item.quantity) || 0;
                    return (
                      <tr key={item.id}>
                        <td>
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            {item.image && (
                              <img
                                src={`http://localhost:8000/upload/products/${item.image}`}
                                alt={item.name}
                                style={{
                                  width: "50px",
                                  height: "50px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                                onError={(e) => {
                                  e.target.src = `http://localhost:8000/upload/products/thumb_${item.image}`;
                                }}
                              />
                            )}
                            <span>{item.name || "-"}</span>
                          </div>
                        </td>
                        <td>{item.size || "-"}</td>
                        <td>{item.color || "-"}</td>
                        <td>{quantity}</td>
                        <td>${price.toFixed(2)}</td>
                        <td>${(price * quantity).toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "16px", color: "#111827" }}>
              Order Summary
            </h2>
            <div style={{ maxWidth: "400px", marginLeft: "auto" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>Subtotal</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #e5e7eb" }}>
                <span style={{ fontSize: "14px", color: "#6b7280" }}>Shipping</span>
                <span style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>${shipping.toFixed(2)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "16px 0", borderTop: "2px solid #111827" }}>
                <span style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>Grand Total</span>
                <span style={{ fontSize: "16px", fontWeight: "600", color: "#111827" }}>${grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;


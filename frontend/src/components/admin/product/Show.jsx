import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const ShowProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const location = useLocation();

  useEffect(() => {
    fetchProducts();
  }, [location.pathname]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");

      const stored = localStorage.getItem("adminInfo");
      const adminInfo = stored ? JSON.parse(stored) : null;

      if (!adminInfo?.token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/products", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.message || "Failed to fetch products");
      }

      if (payload.status === 200 && payload.data) {
        setProducts(Array.isArray(payload.data) ? payload.data : []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      setError(err.message || "Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }

    try {
      const stored = localStorage.getItem("adminInfo");
      const adminInfo = stored ? JSON.parse(stored) : null;

      if (!adminInfo?.token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/products/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.status) {
        throw new Error(payload.message || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((product) => product.id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      console.error("Error deleting product:", err);
      alert(err.message || "Failed to delete product");
    }
  };

  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <p className="categories-subtitle">
              Manage your product catalog and inventory.
            </p>
            <h1 className="categories-title">Products</h1>
          </div>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
            <button
              onClick={fetchProducts}
              className="add-category-btn"
              style={{ backgroundColor: "#6b7280" }}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>
            <Link to="/admin/products/create" className="add-category-btn">
              Add Product
            </Link>
          </div>
        </div>

        {loading && (
          <div className="empty-state">
            <p>Loading products...</p>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <p style={{ color: "#ef4444" }}>Error: {error}</p>
          </div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="empty-state">
            <p>No products found. Add your first product!</p>
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <div style={{ overflowX: "auto" }}>
            <table className="categories-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Price</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Status</th>
                  <th>Featured</th>
                  <th>Created At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product.id}>
                    <td>{product.id}</td>
                    <td>
                      {product.image ? (
                        <img
                          src={`http://localhost:8000/upload/products/thumb_${product.image}`}
                          alt={product.title}
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            e.target.src = `http://localhost:8000/upload/products/${product.image}`;
                          }}
                        />
                      ) : (
                        <span style={{ color: "#999" }}>No Image</span>
                      )}
                    </td>
                    <td>{product.title}</td>
                    <td>${product.price?.toFixed(2) || "0.00"}</td>
                    <td>{product.sku || "-"}</td>
                    <td>{product.qty || 0}</td>
                    <td>{product.status === 1 ? "Active" : "Hidden"}</td>
                    <td>{product.is_featured === "yes" ? "Yes" : "No"}</td>
                    <td>
                      {product.created_at
                        ? new Date(product.created_at).toLocaleDateString()
                        : "-"}
                    </td>
                    <td>
                      <div className="category-actions">
                        <Link
                          className="action-btn edit-btn"
                          to={`/admin/products/${product.id}/edit`}
                        >
                          Edit
                        </Link>
                        <button
                          className="action-btn delete-btn"
                          onClick={() => handleDelete(product.id)}
                        >
                          Delete
                        </button>
                      </div>
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

export default ShowProduct;
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
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

      const response = await fetch("http://localhost:8000/api/brands", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.status !== 200) {
        throw new Error(payload.message || "Failed to fetch brands");
      }

      setBrands(payload.data || []);
    } catch (err) {
      setError(err.message || "Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this brand?")) {
      return;
    }

    try {
      const stored = localStorage.getItem("adminInfo");
      const adminInfo = stored ? JSON.parse(stored) : null;

      if (!adminInfo?.token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/brands/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => ({}));
        throw new Error(payload.message || "Failed to delete brand");
      }

      setBrands((prev) => prev.filter((brand) => brand.id !== id));
      alert("Brand deleted successfully");
    } catch (err) {
      console.error("Error deleting brand:", err);
      alert(err.message || "Failed to delete brand");
    }
  };

  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <p className="categories-subtitle">
              Manage manufacturers and labels offered in the store.
            </p>
            <h1 className="categories-title">Brands</h1>
          </div>
          <Link to="/admin/brands/create" className="add-category-btn">
            Add Brand
          </Link>
        </div>

        {loading && (
          <div className="empty-state">
            <p>Loading brands...</p>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <p style={{ color: "#ef4444" }}>Error: {error}</p>
          </div>
        )}

        {!loading && !error && brands.length === 0 && (
          <div className="empty-state">
            <p>No brands found. Add your first brand!</p>
          </div>
        )}

        {!loading && !error && brands.length > 0 && (
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {brands.map((brand) => (
                <tr key={brand.id}>
                  <td>{brand.id}</td>
                  <td>{brand.name}</td>
                  <td>{brand.status === 1 ? "Active" : "Hidden"}</td>
                  <td>
                    {brand.created_at
                      ? new Date(brand.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <div className="category-actions">
                      <Link
                        className="action-btn edit-btn"
                        to={`/admin/brands/${brand.id}/edit`}
                      >
                        Edit
                      </Link>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(brand.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default Brands;

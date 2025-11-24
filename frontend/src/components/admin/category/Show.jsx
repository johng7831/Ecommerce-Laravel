import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminInfo");
      const adminInfo = token ? JSON.parse(token) : null;

      if (!adminInfo || !adminInfo.token) {
        setError("Not authenticated");
        setLoading(false);
        return;
      }

      const response = await fetch("http://localhost:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }

      const data = await response.json();
      if (data.status === 200) {
        setCategories(data.data || []);
      } else {
        setError("Failed to load categories");
      }
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      const token = localStorage.getItem("adminInfo");
      const adminInfo = token ? JSON.parse(token) : null;

      if (!adminInfo || !adminInfo.token) {
        alert("Not authenticated");
        return;
      }

      const response = await fetch(`http://localhost:8000/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        setCategories((prev) => prev.filter((cat) => cat.id !== id));
        alert("Category deleted successfully");
      } else {
        alert("Failed to delete category");
      }
    } catch (err) {
      console.error("Error deleting category:", err);
      alert("Failed to delete category");
    }
  };

  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <p className="categories-subtitle">
              Manage the taxonomy powering storefront navigation and filters.
            </p>
            <h1 className="categories-title">Categories</h1>
          </div>
          <Link to="/admin/categories/create" className="add-category-btn">
            Add Category
          </Link>
        </div>

        {loading && (
          <div className="empty-state">
            <p>Loading categories...</p>
          </div>
        )}

        {error && (
          <div className="empty-state">
            <p style={{ color: "#ef4444" }}>Error: {error}</p>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="empty-state">
            <p>No categories found. Add your first category!</p>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Slug</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.id}</td>
                  <td>{category.name}</td>
                  <td>{category.slug || "-"}</td>
                  <td>
                    {category.created_at
                      ? new Date(category.created_at).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <div className="category-actions">
                      <Link
                        className="action-btn edit-btn"
                        to={`/admin/categories/${category.id}/edit`}
                      >
                        Edit
                      </Link>
                      <button
                        className="action-btn delete-btn"
                        onClick={() => handleDelete(category.id)}
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

export default Categories;


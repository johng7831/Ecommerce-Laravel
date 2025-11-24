import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    const fetchCategory = async () => {
      setLoading(true);
      setError("");

      try {
        const stored = localStorage.getItem("adminInfo");
        const adminInfo = stored ? JSON.parse(stored) : null;

        if (!adminInfo?.token) {
          throw new Error("You need to log in before editing categories.");
        }

        const response = await fetch(
          `http://localhost:8000/api/categories/${id}`,
          {
            headers: {
              Authorization: `Bearer ${adminInfo.token}`,
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || payload.status !== 200) {
          throw new Error(payload.message || "Failed to load category");
        }

        const category = payload.data || {};
        setFormData({
          name: category.name || "",
          slug: category.slug || "",
          description: category.description || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const stored = localStorage.getItem("adminInfo");
      const adminInfo = stored ? JSON.parse(stored) : null;

      if (!adminInfo?.token) {
        throw new Error("You need to log in before editing categories.");
      }

      const response = await fetch(
        `http://localhost:8000/api/categories/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.status !== 200) {
        throw new Error(payload.message || "Failed to update category");
      }

      navigate("/admin/categories");
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="categories-page">
        <div className="categories-header">
          <div>
            <p className="categories-subtitle">Update category details</p>
            <h1 className="categories-title">Edit Category</h1>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading category...</p>
          </div>
        ) : (
          <form className="category-form" onSubmit={handleSubmit}>
            {error && <p className="form-error">{error}</p>}
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="E.g. New Arrivals"
              />
            </div>
            <div className="form-group">
              <label htmlFor="slug">Slug</label>
              <input
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                placeholder="new-arrivals"
              />
            </div>
            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short description for internal reference."
              />
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/admin/categories")}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Update category"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditCategory;

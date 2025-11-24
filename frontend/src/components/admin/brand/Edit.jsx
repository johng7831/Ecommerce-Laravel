import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const EditBrand = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    status: "1",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchBrand = async () => {
      setLoading(true);
      setError("");

      try {
        const stored = localStorage.getItem("adminInfo");
        const adminInfo = stored ? JSON.parse(stored) : null;

        if (!adminInfo?.token) {
          throw new Error("You need to log in before editing brands.");
        }

        const response = await fetch(`http://localhost:8000/api/brands/${id}`, {
          headers: {
            Authorization: `Bearer ${adminInfo.token}`,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const payload = await response.json().catch(() => ({}));

        if (!response.ok || payload.status !== 200) {
          throw new Error(payload.message || "Failed to load brand");
        }

        const brand = payload.data || {};
        setFormData({
          name: brand.name || "",
          status: String(brand.status ?? 1),
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBrand();
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
        throw new Error("You need to log in before editing brands.");
      }

      const response = await fetch(`http://localhost:8000/api/brands/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          status: Number(formData.status),
        }),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || payload.status !== 200) {
        throw new Error(payload.message || "Failed to update brand");
      }

      navigate("/admin/brands");
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
            <p className="categories-subtitle">Update brand details</p>
            <h1 className="categories-title">Edit Brand</h1>
          </div>
        </div>

        {loading ? (
          <div className="empty-state">
            <p>Loading brand...</p>
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
                placeholder="E.g. PureWear Essentials"
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="1">Active</option>
                <option value="0">Hidden</option>
              </select>
            </div>
            <div className="form-actions">
              <button
                type="button"
                className="secondary-btn"
                onClick={() => navigate("/admin/brands")}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="primary-btn"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Update brand"}
              </button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default EditBrand;

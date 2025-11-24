import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const CreateBrand = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    status: "1",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

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
        throw new Error("You need to log in before creating brands.");
      }

      const response = await fetch("http://localhost:8000/api/brands", {
        method: "POST",
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
        throw new Error(payload.message || "Failed to create brand");
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
            <p className="categories-subtitle">Create a new brand</p>
            <h1 className="categories-title">Add Brand</h1>
          </div>
        </div>

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
              onClick={() => navigate(-1)}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Saving..." : "Create brand"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateBrand;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../AdminLayout";
import "../Admin.css";

const CreateProduct = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    compare_price: "",
    category: "",
    brand: "",
    sku: "",
    qty: "",
    description: "",
    short_description: "",
    is_featured: "no",
    status: "1",
  });
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchBrands();
    fetchSizes();
  }, []);

  const fetchCategories = async () => {
    try {
      const stored = localStorage.getItem("adminInfo");
      const adminInfo = stored ? JSON.parse(stored) : null;

      if (!adminInfo?.token) return;

      const response = await fetch("http://localhost:8000/api/categories", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.status === 200) {
        setCategories(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
    }
  };

  const fetchBrands = async () => {
    try {
      const stored = localStorage.getItem("adminInfo");
      const adminInfo = stored ? JSON.parse(stored) : null;

      if (!adminInfo?.token) return;

      const response = await fetch("http://localhost:8000/api/brands", {
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.status === 200) {
        setBrands(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching brands:", err);
    }
  };

  const fetchSizes = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/sizes", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (data.status === 200) {
        setSizes(data.data || []);
      }
    } catch (err) {
      console.error("Error fetching sizes:", err);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("http://localhost:8000/api/temp-images", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.status === 200 && data.data) {
        setGallery((prev) => [...prev, { id: data.data.id, name: data.data.name }]);
      } else {
        alert("Failed to upload image");
      }
    } catch (err) {
      console.error("Error uploading image:", err);
      alert("Failed to upload image");
    } finally {
      setUploadingImage(false);
      event.target.value = ""; // Reset file input
    }
  };

  const removeImage = (index) => {
    setGallery((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const stored = localStorage.getItem("adminInfo");
      const adminInfo = stored ? JSON.parse(stored) : null;

      if (!adminInfo?.token) {
        throw new Error("You need to log in before creating products.");
      }

      const submitData = {
        ...formData,
        price: parseFloat(formData.price),
        compare_price: formData.compare_price
          ? parseFloat(formData.compare_price)
          : null,
        category: parseInt(formData.category),
        brand: parseInt(formData.brand),
        qty: parseInt(formData.qty),
        status: parseInt(formData.status),
        gallery: gallery.map((img) => img.id),
        sizes: selectedSizes.map((sizeId) => parseInt(sizeId)),
      };

      const response = await fetch("http://localhost:8000/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${adminInfo.token}`,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.status) {
        const errorMessage =
          payload.errors && Object.keys(payload.errors).length > 0
            ? Object.values(payload.errors)[0][0]
            : payload.message || "Failed to create product";
        throw new Error(errorMessage);
      }

      navigate("/admin/products");
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
            <p className="categories-subtitle">Create a new product</p>
            <h1 className="categories-title">Add Product</h1>
          </div>
        </div>

        <form className="category-form" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}

          <div className="form-group">
            <label htmlFor="title">Title *</label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Product title"
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="price">Price *</label>
              <input
                id="price"
                name="price"
                type="number"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                required
                placeholder="0.00"
              />
            </div>

            <div className="form-group">
              <label htmlFor="compare_price">Compare Price</label>
              <input
                id="compare_price"
                name="compare_price"
                type="number"
                step="0.01"
                value={formData.compare_price}
                onChange={handleChange}
                placeholder="0.00"
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="brand">Brand *</label>
              <select
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                required
              >
                <option value="">Select Brand</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.id}>
                    {brand.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="sku">SKU *</label>
              <input
                id="sku"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="Product SKU"
              />
            </div>

            <div className="form-group">
              <label htmlFor="qty">Quantity *</label>
              <input
                id="qty"
                name="qty"
                type="number"
                value={formData.qty}
                onChange={handleChange}
                required
                placeholder="0"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sizes">Sizes</label>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "0.5rem" }}>
              {sizes.map((size) => (
                <label
                  key={size.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    cursor: "pointer",
                    padding: "0.5rem 1rem",
                    border: selectedSizes.includes(size.id.toString())
                      ? "2px solid #3b82f6"
                      : "2px solid #e5e7eb",
                    borderRadius: "4px",
                    backgroundColor: selectedSizes.includes(size.id.toString())
                      ? "#eff6ff"
                      : "white",
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedSizes.includes(size.id.toString())}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedSizes([...selectedSizes, size.id.toString()]);
                      } else {
                        setSelectedSizes(
                          selectedSizes.filter((id) => id !== size.id.toString())
                        );
                      }
                    }}
                    style={{ cursor: "pointer" }}
                  />
                  <span>{size.name}</span>
                </label>
              ))}
            </div>
            {sizes.length === 0 && (
              <p style={{ color: "#6b7280", fontSize: "0.875rem", marginTop: "0.5rem" }}>
                No sizes available. Please add sizes first.
              </p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="short_description">Short Description</label>
            <textarea
              id="short_description"
              name="short_description"
              rows="2"
              value={formData.short_description}
              onChange={handleChange}
              placeholder="Brief product description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              placeholder="Detailed product description"
            />
          </div>

          <div className="form-group">
            <label htmlFor="gallery">Product Images</label>
            <input
              id="gallery"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
            />
            {uploadingImage && <p>Uploading image...</p>}
            {gallery.length > 0 && (
              <div
                style={{
                  display: "flex",
                  gap: "1rem",
                  marginTop: "1rem",
                  flexWrap: "wrap",
                }}
              >
                {gallery.map((imageId, index) => (
                  <div
                    key={index}
                    style={{
                      position: "relative",
                      width: "100px",
                      height: "100px",
                    }}
                  >
                    <img
                      src={`http://localhost:8000/upload/temp/thumb_${imageId.name}`}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        borderRadius: "4px",
                      }}
                      onError={(e) => {
                        e.target.src = `http://localhost:8000/upload/temp/${imageId.name}`;
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      style={{
                        position: "absolute",
                        top: "-8px",
                        right: "-8px",
                        background: "#ef4444",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "24px",
                        height: "24px",
                        cursor: "pointer",
                        fontSize: "16px",
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <div className="form-group">
              <label htmlFor="is_featured">Featured</label>
              <select
                id="is_featured"
                name="is_featured"
                value={formData.is_featured}
                onChange={handleChange}
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
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
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() => navigate("/admin/products")}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="primary-btn" disabled={submitting}>
              {submitting ? "Creating..." : "Create Product"}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default CreateProduct;
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../../utils/api'

const FeaturedProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await api.get('/featured-products');
      
      if (response.data.status === 200) {
        setProducts(response.data.data || []);
      }
    } catch (err) {
      console.error('Error fetching featured products:', err);
    } finally {
      setLoading(false);
    }
  };

  const getProductImage = (product) => {
    if (product.image) {
      return `http://localhost:8000/upload/products/thumb_${product.image}`;
    }
    if (product.images && product.images.length > 0) {
      return `http://localhost:8000/upload/products/thumb_${product.images[0].image}`;
    }
    return 'https://via.placeholder.com/300x300?text=No+Image';
  };

  // Don't render section if no products available (after loading)
  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="featured-products" aria-label="Featured products">
      <div className="section-header">
        <h2 className="section-title">Featured Products</h2>
        <Link to="/shop" className="section-cta">View all</Link>
      </div>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading products...</div>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <article key={p.id} className="product-card">
              <Link to={`/product/${p.id}`} className="product-image-wrap">
                <img 
                  src={getProductImage(p)} 
                  alt={p.title} 
                  className="product-image"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/300x300?text=No+Image';
                  }}
                />
              </Link>
              <div className="product-info">
                <Link to={`/product/${p.id}`} className="product-title-link">
                  <h3 className="product-title">{p.title}</h3>
                </Link>
                <div className="product-price-container">
                  <span className="product-price">${parseFloat(p.price).toFixed(2)}</span>
                  {p.compare_price && (
                    <span className="product-compare-price" style={{ textDecoration: 'line-through', color: '#6b7280', marginLeft: '0.5rem' }}>
                      ${parseFloat(p.compare_price).toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  )
}

export default FeaturedProduct


import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from './Layout'
import FeaturedProduct from './FeaturedProduct'
import api from '../../utils/api'
import { useCart } from '../../context/CartContext'
import './Shop.css'

const Product = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [brand, setBrand] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (id) {
      fetchProduct()
    }
  }, [id])

  const fetchProduct = async () => {
    try {
      setLoading(true)
      setError('')
      
      const response = await api.get(`/get-product/${id}`)
      
      if (response.data.status === 200 && response.data.data) {
        const productData = response.data.data
        setProduct(productData)
        
        // Fetch brand information if brand_id exists
        if (productData.brand_id) {
          try {
            const brandResponse = await api.get(`/brands/${productData.brand_id}`)
            if (brandResponse.data.status === 200) {
              setBrand(brandResponse.data.data)
            }
          } catch (err) {
            console.error('Error fetching brand:', err)
          }
        }
      } else {
        setError('Product not found')
      }
    } catch (err) {
      console.error('Error fetching product:', err)
      setError('Failed to load product. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  const getProductImage = (product) => {
    if (product.image) {
      return `http://localhost:8000/upload/products/${product.image}`
    }
    if (product.images && product.images.length > 0) {
      return `http://localhost:8000/upload/products/${product.images[0].image}`
    }
    return 'https://via.placeholder.com/600x600?text=No+Image'
  }

  const handleAddToCart = () => {
    if (product) {
      // Ensure product has all necessary data with proper image URL
      const productForCart = {
        ...product,
        image: getProductImage(product)
      }
      addToCart(productForCart)
      navigate('/cart')
    }
  }

  if (loading) {
    return (
      <Layout>
        <div className="product-page">
          <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>
            <p>Loading product...</p>
          </div>
        </div>
      </Layout>
    )
  }

  if (error || !product) {
    return (
      <Layout>
        <div className="product-page">
          <div className="product-not-found">
            <h2>{error || 'Product not found'}</h2>
            <button onClick={() => navigate('/shop')} className="back-to-shop-button">
              Back to Shop
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  const brandName = brand?.name || product.brand?.name || 'Unknown'

  return (
    <Layout>
      <div className="product-page">
        <div className="product-container">
          <div className="product-media">
            <img 
              src={getProductImage(product)} 
              alt={product.title} 
              className="product-hero-image"
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/600x600?text=No+Image'
              }}
            />
          </div>
          <div className="product-details">
            <span className="product-brand">{brandName.toUpperCase()}</span>
            <h1 className="product-title">{product.title}</h1>
            <div className="product-price-container">
              <p className="product-price">${parseFloat(product.price).toFixed(2)}</p>
              {product.compare_price && (
                <span className="product-compare-price" style={{ textDecoration: 'line-through', color: '#6b7280', marginLeft: '0.5rem' }}>
                  ${parseFloat(product.compare_price).toFixed(2)}
                </span>
              )}
            </div>
            {product.short_description && (
              <p className="product-short-description" style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1rem' }}>
                {product.short_description}
              </p>
            )}
            {product.description && (
              <p className="product-description">{product.description}</p>
            )}
            {product.qty > 0 ? (
              <button className="add-to-cart-button" type="button" onClick={handleAddToCart}>
                Add to Cart
              </button>
            ) : (
              <button className="add-to-cart-button" type="button" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                Out of Stock
              </button>
            )}
          </div>
        </div>
        <FeaturedProduct />
      </div>
    </Layout>
  )
}

export default Product
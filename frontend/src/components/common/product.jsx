import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Layout from './Layout'
import FeaturedProduct from './FeaturedProduct'
import { products } from './Shop'
import { useCart } from '../../context/CartContext'
import './Shop.css'

const Product = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const product = products.find(p => p.id === parseInt(id))

  const handleAddToCart = () => {
    if (product) {
      addToCart(product)
      navigate('/cart')
    }
  }

  if (!product) {
    return (
      <Layout>
        <div className="product-page">
          <div className="product-not-found">
            <h2>Product not found</h2>
            <button onClick={() => navigate('/shop')} className="back-to-shop-button">
              Back to Shop
            </button>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="product-page">
        <div className="product-container">
          <div className="product-media">
            <img src={product.image} alt={product.title} className="product-hero-image" />
          </div>
          <div className="product-details">
            <span className="product-brand">{product.brand.toUpperCase()}</span>
            <h1 className="product-title">{product.title}</h1>
            <p className="product-price">${product.price.toFixed(2)}</p>
            <p className="product-description">{product.description}</p>
            <button className="add-to-cart-button" type="button" onClick={handleAddToCart}>
              Add to Cart
            </button>
          </div>
        </div>
        <FeaturedProduct />
      </div>
    </Layout>
  )
}

export default Product
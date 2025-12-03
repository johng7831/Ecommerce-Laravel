import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout'
import FeaturedProduct from './FeaturedProduct'
import './Shop.css'
import classicTShirt from '../../assets/classic-t-shirt.png'
import runningShoes from '../../assets/running-shoes.webp'
import summerDress from '../../assets/summer-dress.png'
import sneakers from '../../assets/sneakers.jpg'
import kidsTShirt from '../../assets/kids-tshirt.png'
import kidsSneakers from '../../assets/kids-sneakers.avif'

// Local product data with asset images
export const products = [
  { 
    id: 1, 
    title: 'Classic T-Shirt', 
    price: 29.99, 
    category: 'men', 
    brand: 'nike', 
    image: classicTShirt,
    description: 'A timeless classic made from soft, breathable cotton for everyday comfort. Perfect for layering or wearing solo. This premium t-shirt features a modern fit and durable construction that will last through countless washes.'
  },
  { 
    id: 2, 
    title: 'Running Shoes', 
    price: 89.99, 
    category: 'men', 
    brand: 'puma', 
    image: runningShoes,
    description: 'High-performance running shoes designed for maximum comfort and support. Features advanced cushioning technology and breathable mesh upper for optimal ventilation during long runs.'
  },
  { 
    id: 3, 
    title: 'Summer Dress', 
    price: 49.99, 
    category: 'women', 
    brand: 'nike', 
    image: summerDress,
    description: 'Elegant and comfortable summer dress perfect for any occasion. Made from lightweight, flowy fabric that keeps you cool and stylish. Features a flattering silhouette and versatile design.'
  },
  { 
    id: 4, 
    title: 'Sneakers', 
    price: 79.99, 
    category: 'women', 
    brand: 'puma', 
    image: sneakers,
    description: 'Stylish and comfortable sneakers that combine fashion with function. Perfect for everyday wear, these sneakers offer excellent support and a modern design that complements any outfit.'
  },
  { 
    id: 5, 
    title: 'Kids T-Shirt', 
    price: 19.99, 
    category: 'kids', 
    brand: 'nike', 
    image: kidsTShirt,
    description: 'Durable and comfortable t-shirt designed specifically for kids. Made from soft, hypoallergenic cotton that is gentle on sensitive skin. Perfect for playtime and everyday adventures.'
  },
  { 
    id: 6, 
    title: 'Kids Sneakers', 
    price: 59.99, 
    category: 'kids', 
    brand: 'puma', 
    image: kidsSneakers,
    description: 'Fun and functional sneakers for active kids. Features easy-to-use velcro closures, durable construction, and comfortable cushioning. Perfect for school, play, and sports activities.'
  },
]

const Shop = () => {
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')

  // Filter products based on selected filters
  const filteredProducts = products.filter(product => {
    const categoryMatch = selectedCategory === 'all' || product.category === selectedCategory
    const brandMatch = selectedBrand === 'all' || product.brand === selectedBrand
    return categoryMatch && brandMatch
  })

  return (
    <Layout>
      <div className="shop-page">
        <div className="shop-container">
          {/* Filters Sidebar */}
          <aside className="shop-filters">
            <h2 className="filters-title">Filters</h2>
            
            {/* Category Filter */}
            <div className="filter-group">
              <h3 className="filter-group-title">Category</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="all"
                    checked={selectedCategory === 'all'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>All</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="men"
                    checked={selectedCategory === 'men'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>Men</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="women"
                    checked={selectedCategory === 'women'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>Women</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="category"
                    value="kids"
                    checked={selectedCategory === 'kids'}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  />
                  <span>Kids</span>
                </label>
              </div>
            </div>

            {/* Brand Filter */}
            <div className="filter-group">
              <h3 className="filter-group-title">Brand</h3>
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="radio"
                    name="brand"
                    value="all"
                    checked={selectedBrand === 'all'}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  />
                  <span>All</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="brand"
                    value="nike"
                    checked={selectedBrand === 'nike'}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  />
                  <span>Nike</span>
                </label>
                <label className="filter-option">
                  <input
                    type="radio"
                    name="brand"
                    value="puma"
                    checked={selectedBrand === 'puma'}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                  />
                  <span>Puma</span>
                </label>
              </div>
            </div>
          </aside>

          {/* Products Grid */}
          <main className="shop-content">
            <div className="shop-header">
              <h1 className="shop-title">Shop</h1>
              <p className="shop-results">
                Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
              </p>
            </div>

            {filteredProducts.length > 0 ? (
              <div className="shop-product-grid">
                {filteredProducts.map((product) => (
                  <article key={product.id} className="shop-product-card">
                    <Link to={`/product/${product.id}`} className="product-image-wrap">
                      <img 
                        src={product.image} 
                        alt={product.title} 
                        className="product-image"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(product.title)
                        }}
                      />
                    </Link>
                    <div className="product-info">
                      <span className="product-brand">{product.brand.toUpperCase()}</span>
                      <h3 className="product-title">{product.title}</h3>
                      <span className="product-price">${product.price.toFixed(2)}</span>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="no-products">
                <p>No products found matching your filters.</p>
              </div>
            )}
          </main>
        </div>
        <FeaturedProduct />
      </div>
    </Layout>
  )
}

export default Shop

import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Layout from './Layout'
import FeaturedProduct from './FeaturedProduct'
import api from '../../utils/api'
import './Shop.css'

const Shop = () => {
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedBrand, setSelectedBrand] = useState('all')

  useEffect(() => {
    fetchCategories()
    fetchBrands()
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError('')
        
        // Build query parameters for filtering
        const params = {
          category_id: selectedCategory === 'all' ? 'all' : selectedCategory,
          brand_id: selectedBrand === 'all' ? 'all' : selectedBrand
        }
        
        console.log('Fetching products with filters:', params)
        
        const response = await api.get('/filter-products', { params })
        
        console.log('Products API Response:', response.data)
        
        if (response.data && response.data.status === 200) {
          const productsData = response.data.data || []
          setProducts(Array.isArray(productsData) ? productsData : [])
          console.log('Products loaded:', productsData.length)
        } else {
          setProducts([])
          setError('Failed to load products.')
        }
      } catch (err) {
        console.error('Error fetching products:', err)
        console.error('Error details:', err.response?.data || err.message)
        setError('Failed to load products. Please try again later.')
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    
    fetchProducts()
  }, [selectedCategory, selectedBrand])

  const fetchCategories = async () => {
    try {
      console.log('Fetching categories from: /categories')
      const response = await api.get('/categories')
      
      console.log('Categories API Full Response:', response)
      console.log('Categories API Response Data:', response.data)
      console.log('Categories Response Status:', response.status)
      
      // Handle different response formats
      let categoriesData = []
      
      if (response.data) {
        // Check if response has status and data
        if (response.data.status === 200 && response.data.data) {
          categoriesData = Array.isArray(response.data.data) ? response.data.data : []
        } 
        // Check if response.data is directly an array
        else if (Array.isArray(response.data)) {
          categoriesData = response.data
        }
        // Check if response.data.data exists and is array
        else if (response.data.data && Array.isArray(response.data.data)) {
          categoriesData = response.data.data
        }
      }
      
      console.log('Parsed categories:', categoriesData)
      console.log('Categories count:', categoriesData.length)
      
      setCategories(categoriesData)
      
      if (categoriesData.length === 0) {
        console.warn('No categories found in response')
      }
    } catch (err) {
      console.error('Error fetching categories:', err)
      console.error('Error response:', err.response)
      console.error('Error response data:', err.response?.data)
      console.error('Error message:', err.message)
      setCategories([])
    }
  }

  const fetchBrands = async () => {
    try {
      console.log('Fetching brands from: /brands')
      const response = await api.get('/brands')
      
      console.log('Brands API Full Response:', response)
      console.log('Brands API Response Data:', response.data)
      console.log('Brands Response Status:', response.status)
      
      // Handle different response formats
      let brandsData = []
      
      if (response.data) {
        // Check if response has status and data
        if (response.data.status === 200 && response.data.data) {
          brandsData = Array.isArray(response.data.data) ? response.data.data : []
        } 
        // Check if response.data is directly an array
        else if (Array.isArray(response.data)) {
          brandsData = response.data
        }
        // Check if response.data.data exists and is array
        else if (response.data.data && Array.isArray(response.data.data)) {
          brandsData = response.data.data
        }
      }
      
      console.log('Parsed brands:', brandsData)
      console.log('Brands count:', brandsData.length)
      
      setBrands(brandsData)
      
      if (brandsData.length === 0) {
        console.warn('No brands found in response')
      }
    } catch (err) {
      console.error('Error fetching brands:', err)
      console.error('Error response:', err.response)
      console.error('Error response data:', err.response?.data)
      console.error('Error message:', err.message)
      setBrands([])
    }
  }

  const getProductImage = (product) => {
    if (product.image) {
      return `http://localhost:8000/upload/products/thumb_${product.image}`
    }
    if (product.images && product.images.length > 0) {
      return `http://localhost:8000/upload/products/thumb_${product.images[0].image}`
    }
    return 'https://via.placeholder.com/300x400?text=No+Image'
  }

  // Products are already filtered by API, so use them directly
  const filteredProducts = products

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
                    onChange={(e) => {
                      console.log('Category changed to:', e.target.value)
                      setSelectedCategory(e.target.value)
                    }}
                  />
                  <span>All</span>
                </label>
                {categories && Array.isArray(categories) && categories.length > 0 ? (
                  categories.map((category) => {
                    if (!category || !category.id) {
                      console.warn('Invalid category:', category)
                      return null
                    }
                    return (
                      <label key={category.id} className="filter-option">
                        <input
                          type="radio"
                          name="category"
                          value={category.id.toString()}
                          checked={selectedCategory === category.id.toString()}
                          onChange={(e) => {
                            console.log('Category changed to:', e.target.value)
                            setSelectedCategory(e.target.value)
                          }}
                        />
                        <span>{category.name || 'Unnamed Category'}</span>
                      </label>
                    )
                  })
                ) : (
                  <div style={{ padding: '8px', color: '#6b7280', fontSize: '14px' }}>
                    {categories && categories.length === 0 ? 'No categories available' : 'Loading categories...'}
                  </div>
                )}
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
                    onChange={(e) => {
                      console.log('Brand changed to:', e.target.value)
                      setSelectedBrand(e.target.value)
                    }}
                  />
                  <span>All</span>
                </label>
                {brands && Array.isArray(brands) && brands.length > 0 ? (
                  brands.map((brand) => {
                    if (!brand || !brand.id) {
                      console.warn('Invalid brand:', brand)
                      return null
                    }
                    return (
                      <label key={brand.id} className="filter-option">
                        <input
                          type="radio"
                          name="brand"
                          value={brand.id.toString()}
                          checked={selectedBrand === brand.id.toString()}
                          onChange={(e) => {
                            console.log('Brand changed to:', e.target.value)
                            setSelectedBrand(e.target.value)
                          }}
                        />
                        <span>{brand.name || 'Unnamed Brand'}</span>
                      </label>
                    )
                  })
                ) : (
                  <div style={{ padding: '8px', color: '#6b7280', fontSize: '14px' }}>
                    {brands && brands.length === 0 ? 'No brands available' : 'Loading brands...'}
                  </div>
                )}
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

            {loading ? (
              <div className="loading-state" style={{ textAlign: 'center', padding: '3rem' }}>
                <p>Loading products...</p>
              </div>
            ) : error ? (
              <div className="error-state" style={{ textAlign: 'center', padding: '3rem', color: '#dc2626' }}>
                <p>{error}</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="shop-product-grid">
                {filteredProducts.map((product) => {
                  const brandName = brands.find(b => b.id === product.brand_id)?.name || 'Unknown'
                  return (
                    <article key={product.id} className="shop-product-card">
                      <Link to={`/product/${product.id}`} className="product-image-wrap">
                        <img 
                          src={getProductImage(product)} 
                          alt={product.title} 
                          className="product-image"
                          onError={(e) => {
                            e.target.src = 'https://via.placeholder.com/300x400?text=' + encodeURIComponent(product.title)
                          }}
                        />
                      </Link>
                      <div className="product-info">
                        <span className="product-brand">{brandName.toUpperCase()}</span>
                        <h3 className="product-title">{product.title}</h3>
                        <div className="product-price-container">
                          <span className="product-price">${parseFloat(product.price).toFixed(2)}</span>
                          {product.compare_price && (
                            <span className="product-compare-price" style={{ textDecoration: 'line-through', color: '#6b7280', marginLeft: '0.5rem' }}>
                              ${parseFloat(product.compare_price).toFixed(2)}
                            </span>
                          )}
                        </div>
                      </div>
                    </article>
                  )
                })}
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

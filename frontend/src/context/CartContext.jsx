import React, { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])

  // Helper function to get product image URL
  const getProductImageUrl = (product) => {
    if (!product) return 'https://via.placeholder.com/300x400?text=No+Image'
    
    // If already a full URL (from previous normalization or direct assignment), return it
    if (product.image && (product.image.startsWith('http://') || product.image.startsWith('https://'))) {
      return product.image
    }
    
    // If product has main image (filename only)
    if (product.image) {
      // Check if it already has thumb_ prefix to avoid double prefix
      const imageName = product.image.startsWith('thumb_') ? product.image : `thumb_${product.image}`
      return `http://localhost:8000/upload/products/${imageName}`
    }
    
    // If product has images array
    if (product.images && product.images.length > 0) {
      const firstImage = product.images[0]
      let imageName = ''
      
      if (typeof firstImage === 'string') {
        imageName = firstImage
      } else if (firstImage.image) {
        imageName = firstImage.image
      }
      
      if (imageName) {
        const thumbName = imageName.startsWith('thumb_') ? imageName : `thumb_${imageName}`
        return `http://localhost:8000/upload/products/${thumbName}`
      }
    }
    
    return 'https://via.placeholder.com/300x400?text=No+Image'
  }

  // Normalize product data for cart
  const normalizeProductForCart = (product) => {
    return {
      id: product.id,
      title: product.title || product.name || 'Product',
      price: parseFloat(product.price) || 0,
      quantity: product.quantity || 1,
      image: getProductImageUrl(product),
      category_id: product.category_id,
      brand_id: product.brand_id
    }
  }

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('cartItems')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Normalize cart items on load to ensure image URLs are correct
        const normalizedCart = parsedCart.map(item => normalizeProductForCart(item))
        setCartItems(normalizedCart)
      } catch (err) {
        console.error('Error loading cart from localStorage:', err)
        setCartItems([])
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems))
  }, [cartItems])

  const addToCart = (product) => {
    setCartItems(prevItems => {
      const normalizedProduct = normalizeProductForCart(product)
      const existingItem = prevItems.find(item => item.id === product.id)
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, normalizedProduct]
    })
  }

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    setCartItems([])
  }

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0)
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}


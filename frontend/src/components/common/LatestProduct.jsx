import React from 'react'
import img1 from '../../assets/new-arrival-1.png'
import img2 from '../../assets/new-arrival-2.png'
import img3 from '../../assets/new-arrival-3.png'
import img4 from '../../assets/new-arrival-4.png'

const products = [
  { id: 1, title: 'New Arrival 1', price: '$49.00', image: img1 },
  { id: 2, title: 'New Arrival 2', price: '$59.00', image: img2 },
  { id: 3, title: 'New Arrival 3', price: '$69.00', image: img3 },
  { id: 4, title: 'New Arrival 4', price: '$79.00', image: img4 },
]

const LatestProduct = () => {
  return (
    <section className="latest-products" aria-label="Latest products">
      <div className="section-header">
        <h2 className="section-title">New Arrivals</h2>
        <a href="#" className="section-cta">View all</a>
      </div>
      <div className="product-grid">
        {products.map((p) => (
          <article key={p.id} className="product-card">
            <a href="#" className="product-image-wrap">
              <img src={p.image} alt={p.title} className="product-image"/>
            </a>
            <div className="product-info">
              <h3 className="product-title">{p.title}</h3>
              <span className="product-price">{p.price}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export default LatestProduct






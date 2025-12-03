import React from 'react'
import './Shop.css'
import Layout from './Layout'
import Hero from './Hero'
import LatestProduct from './LatestProduct'
import FeaturedProduct from './FeaturedProduct'

const Home = () => {
  return (
    <Layout>
      <div className="home-page">
        <Hero/> 
        <LatestProduct/>
        <FeaturedProduct/>
      </div>
    </Layout>
  )
}

export default Home

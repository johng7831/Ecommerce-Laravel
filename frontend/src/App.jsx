import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { CartProvider } from './context/CartContext'
import { AdminAuthProvider } from './context/AdminAuth'
import { CustomerAuthProvider } from './context/CustomerAuth'
import Home from './components/common/Home.jsx'
import Shop from './components/common/Shop.jsx'
import Product from './components/common/product.jsx'
import Cart from './components/common/cart.jsx'
import Checkout from './components/common/checkout.jsx'
import Login from './components/common/Login.jsx'
import Register from './components/common/Register.jsx'
import CustomerLogin from './components/common/CustomerLogin.jsx'
import AccountDashboard from './components/common/AccountDashboard.jsx'
import Dashboard from './components/admin/Dashboard.jsx'
import AdminRequireAuth from './components/common/AdminRequireAuth.jsx'
import { default as ShowCategory } from './components/admin/category/Show.jsx'
import CreateCategory from './components/admin/category/Create.jsx'
import EditCategory from './components/admin/category/Edit.jsx'
import ShowBrand from './components/admin/brand/Show.jsx'
import CreateBrand from './components/admin/brand/Create.jsx'
import EditBrand from './components/admin/brand/Edit.jsx'
import ShowProduct from './components/admin/product/Show.jsx'
import CreateProduct from './components/admin/product/Create.jsx'
import EditProduct from './components/admin/product/Edit.jsx'

function App() {
  return (
    <CartProvider>
      <CustomerAuthProvider>
        <AdminAuthProvider>
          <BrowserRouter> 
            <Routes>
              <Route path='/' element={<Home />} />
              <Route path='/shop' element={<Shop />} />
              <Route path='/product/:id' element={<Product />} />
              <Route path='/cart' element={<Cart />} />
              <Route path='/checkout' element={<Checkout />} />
              <Route path='/register' element={<Register />} />
              <Route path='/login' element={<CustomerLogin />} />
              <Route path='/account/dashboard' element={<AccountDashboard />} />
              <Route path='/admin/login' element={<Login />} />


            <Route path='/admin/dashboard' element={
              <AdminRequireAuth>
                <Dashboard />
              </AdminRequireAuth>
            } />



            <Route path='/admin/categories' element={
              <AdminRequireAuth>
                <ShowCategory />
              </AdminRequireAuth>
            } />
            <Route path='/admin/categories/create' element={
              <AdminRequireAuth>
                <CreateCategory />
              </AdminRequireAuth>
            } />
            <Route path='/admin/categories/:id/edit' element={
              <AdminRequireAuth>
                <EditCategory />
              </AdminRequireAuth>
            } />
            <Route path='/admin/brands' element={
              <AdminRequireAuth>
                <ShowBrand />
              </AdminRequireAuth>
            } />
            <Route path='/admin/brands/create' element={
              <AdminRequireAuth>
                <CreateBrand />
              </AdminRequireAuth>
            } />
            <Route path='/admin/brands/:id/edit' element={
              <AdminRequireAuth>
                <EditBrand />
              </AdminRequireAuth>
            } />
            <Route path='/admin/products' element={
              <AdminRequireAuth>
                <ShowProduct />
              </AdminRequireAuth>
            } />
            <Route path='/admin/products/create' element={
              <AdminRequireAuth>
                <CreateProduct />
              </AdminRequireAuth>
            } />
            <Route path='/admin/products/:id/edit' element={
              <AdminRequireAuth>
                <EditProduct />
              </AdminRequireAuth>
            } />
          </Routes>
   

          </BrowserRouter>
        </AdminAuthProvider>
      </CustomerAuthProvider>
    </CartProvider>
  )
}

export default App

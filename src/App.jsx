import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import store from "./redux/store";

// Layouts
import StoreLayout from "./layouts/StoreLayout";
import MainLayout from "./layouts/LandingLayout";
import AdminLayout from "./layouts/AdminLayout";

// Context
import { AdminAuthProvider } from "./context/Admin";

// Admin Pages
import DashboardPage from "./pages/admin/dashboard";
import Product from "./pages/admin/product";
import Orders from "./pages/admin/order";
import Customers from "./pages/admin/customer";
import Reviews from "./pages/admin/review";
import CalendarPage from "./pages/admin/calendar";
import SEO from "./pages/admin/SEO";
import LoginPage from "./pages/admin/login";
import RegisterAdmin from "./pages/admin/signup";

// User Pages
import HomePage from "./pages/user/homepage";
import Contact from "./pages/user/contact";
import Login from "./pages/user/login";
import Signup from "./pages/user/signup";
import ShoppingCartPage from "./pages/user/cart";
import Order from "./pages/user/orders";
import ProductDetail from "./pages/user/productdetails";
import Checkout from "./pages/user/checkout";
import SearchPage from "./pages/user/Search";
import NotFoundPage from "./pages/user/notfound";

// Landing Pages
import LandingPage from "./pages/landingPage/LandingPage";
import Blogs from "./pages/landingPage/Blogs";
import TrainingHub from "./pages/landingPage/TrainingHub";
import AssistiveTechPage from "./pages/landingPage/AssistiveTech";
import OrderView from "./pages/admin/orderView";
import AdminBlogList from "./pages/admin/blogs";
import BlogDetail from "./pages/landingPage/BlogView";

function App() {
  return (
    <React.StrictMode>
      <Provider store={store}>
        <ToastContainer />
        <BrowserRouter>
          <Routes>
            <Route
              path="/admin/"
              element={
                <AdminAuthProvider>
                  <AdminLayout adminOnly />
                </AdminAuthProvider>
              }
            >
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="products" element={<Product />} />
              <Route path="orders" element={<Orders />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="blogs" element={<AdminBlogList />} />
              <Route path="calendar" element={<CalendarPage />} />
              <Route path="orders/:orderId" element={<OrderView />} />

              <Route path="SEO" element={<SEO />} />
            </Route>
            <Route
              path="/admin/login"
              element={
                <AdminAuthProvider>
                  <LoginPage />
                </AdminAuthProvider>
              }
            />
            <Route
              path="/admin/signup"
              element={
                <AdminAuthProvider>
                  <RegisterAdmin />
                </AdminAuthProvider>
              }
            />

            {/* Store (User Area) */}
            <Route element={<StoreLayout />}>
              <Route path="/store" element={<HomePage />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/cart" element={<ShoppingCartPage />} />
              <Route path="/orders" element={<Order />} />
              <Route path="/product/:productId" element={<ProductDetail />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/search" element={<SearchPage />} />
            </Route>

            {/* Landing Pages */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/blogs" element={<Blogs />} />
              <Route path="/blogs/:id" element={<BlogDetail />} />
              <Route path="/training" element={<TrainingHub />} />
              <Route path="/assistive-tech" element={<AssistiveTechPage />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </Provider>
    </React.StrictMode>
  );
}

export default App;

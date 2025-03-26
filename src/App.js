import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RegistrationPage from "./pages/RegistrationPage";
import LoginPage from "./pages/LoginPage";
import AdminDashboard from "./pages/AdminDashboard"; 
import AddProductPage from "./pages/AddProduct";  
import ManageCustomers from "./pages/ManageCustomers";  
import ManagePromotions from "./pages/ManagePromotions"; 
import ManageVendors from "./pages/ManageVendors"; 
import ManageCategory from "./pages/ManageCategory";
import 'bootstrap/dist/css/bootstrap.min.css';
import ProductPage from "./pages/ProductPage";
import ProfilePage from "./pages/ProfilePage";
import HomePage from "./pages/HomePage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import { CartProvider } from "./context/CartContext";
// import PreviousBills from "./pages/PreviousBills";
import BillInvoice from "./pages/BillInvoice";
import LowStockNotification from "./components/LowStockNotification";
import EditProduct from "./pages/ProductEdit";
import ManageOrdersPage from "./pages/ManageOrder";
import ManageProducts from "./pages/ManageProducts";
import AddGST from "./pages/AddGst";
import InventoryManagement from "./pages/InventoryManagement";
import CustomerOrderManage from "./pages/CustomerOrderManage";
import MyBills from "./pages/MyBills";
import ManageOrder from "./pages/ManageOrder";
import AdminOfflinePurchase from "./pages/AdminOfflinePurchase";
// import WeatherUpdates from "./components/WeatherUpdates ";
import MyOrder from "./components/MyOrder";
import Invoice from "./components/Invoice";
import Services from "./pages/Services";
import AdminServices from "./pages/AdminServices";
import ServiceBooking from "./pages/ServiceBooking";
import AdminServiceBookings from "./pages/AdminServiceBookings";
import UserBookings from "./pages/UserBookings";
import CropManagement from "./components/CropManagement"
import Chatbot from './components/Chatbot';
import CropPlanning from "./components/CropPlanning";
import PestAlerts from "./components/PestAlerts";
import IrrigationScheduler from "./components/IrrigationScheduler";
import MarketInsights from "./components/MarketInsights";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ManageOrders from "./pages/ManageOrders";
import OrderTracking from "./pages/OrderTracking";
import AddStock from "./components/AddStock";
import AddLabor from "./pages/AddLabor";
import MyWishlist from "./pages/MyWishlist";
import AdminOfflineService from "./pages/AdminOfflineService";
import AdminAllBookedServices from "./pages/AdminAllBookedServices";
import CustomerDashboard from "./pages/CustomerDashboard";
// import CropPlanning from "./components/CropPlanning";
function App() {
  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <Routes>
            <Route path="/" element={<HomePage/>} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/products" element={<ProductPage />} />
            <Route path="/wishlist" element={<MyWishlist />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} /> 
            <Route path="/manage-vendors" element={<ManageVendors />} />
            <Route path="/add-product" element={<AddProductPage />} />
            <Route path="/manage-customers" element={<ManageCustomers />} />
            <Route path="/manage-promotions" element={<ManagePromotions />} />
            <Route path="/manage-category" element={<ManageCategory />} />
            <Route path="/manage-products" element={<ManageProducts />} />
            <Route path="/manage-order" element={<ManageOrder/>}/>
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/low-stock" element={<LowStockNotification />} />
            <Route path="/cart" element={<Cart/>} />
            <Route path="/checkout" element={<Checkout/>} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/add-stock" element={<AddStock />} />
            {/* <Route path="/previous-bills" element={<PreviousBills />} /> */}
            <Route path="/previous-bills" element={<MyOrder />} />
            <Route path="/invoice/:orderId" element={<Invoice />} />
            <Route path="/edit-product/:id" element={<EditProduct />} />
            <Route path="/bills/:id" element={<BillInvoice />} />
            <Route path="/manage-order" element={<ManageOrdersPage />} />
            <Route path="/manage-gst" element={<AddGST/>} />
            <Route path="/manage-inventory" element={<InventoryManagement/>} />
            <Route path="/customer-order" element={<CustomerOrderManage/>} />
            <Route path="/my-bill" element={<MyBills/>} />
            <Route path="/offline-order" element={<AdminOfflinePurchase/>} />
            <Route path="/services" element={<Services />} />
            <Route path="/service-booking" element={<ServiceBooking />} />
            <Route path="/admin-service-bookings" element={<AdminServiceBookings />} />
            <Route path="/offline-service" element={<AdminOfflineService />} />
            <Route path="/manage-service" element={<AdminServices />} />
            <Route path="/my-bookings" element={<UserBookings />} />
            <Route path="/crop-management" element={<CropManagement />} />
            <Route path="/chatbot" element={<Chatbot />} />
            <Route path="/crop-planning" element={<CropPlanning />} />
            <Route path="/pest-alerts" element={<PestAlerts />} />
            <Route path="/irrigation" element={<IrrigationScheduler />} />
            <Route path="/market-insights" element={<MarketInsights />} />
            <Route path="/manage-orders" element={<ManageOrders />} />
            <Route path="/order-tracking" element={<OrderTracking />} />
            <Route path="/add-labor" element={<AddLabor />} />
            <Route path="/all-services" element={<AdminAllBookedServices />} />
            <Route path="/customer-dashboard/*" element={<CustomerDashboard />} />
          </Routes>
        </div>
      </Router>
   
    </CartProvider >
   
  );
}

export default App;

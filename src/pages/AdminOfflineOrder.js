// import { useState, useEffect, useContext } from "react";
// import { Form, Button, Breadcrumb } from "react-bootstrap";
// import axios from "axios";
// import { CartContext } from "../context/CartContext";
// import NavigationBar from "../components/Navbar";

// const AdminOfflineOrder = () => {
//   const { cart, clearCart } = useContext(CartContext);
//   const [currentCart, setCurrentCart] = useState(cart);
//   const [customerName, setCustomerName] = useState("");
//   const [phone, setPhone] = useState("");
//   const [crop, setCrop] = useState("");
//   const [paymentMethod, setPaymentMethod] = useState("Pay Later");

//   useEffect(() => {
//     const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
//     setCurrentCart(storedCart);
//   }, []);

//   const totalAmount = currentCart
//     .reduce((sum, item) => {
//       const price = parseFloat(item.price) || 0;
//       const quantity = parseInt(item.quantity, 10) || 1;
//       const gstRate = parseFloat(item.gst) ? parseFloat(item.gst) / 100 : 0;
//       return sum + price * quantity * (1 + gstRate);
//     }, 0)
//     .toFixed(2);

//   const handleOfflineOrder = async () => {
//     if (!customerName.trim() || !phone.trim() || !crop.trim()) {
//       alert("Please fill all required fields.");
//       return;
//     }

//     const orderData = {
//       name: customerName.trim(),
//       phone: phone.trim(),
//       crop: crop.trim(),
//       purchaseType: "Offline",
//       paymentMethod: paymentMethod,
//       totalAmount: parseFloat(totalAmount),
//       cart: currentCart.map((item) => ({
//         productId: item._id,
//         variantId: item.variantId,
//         name: item.name,
//         price: parseFloat(item.price),
//         quantity: parseInt(item.quantity, 10),
//         gst: parseFloat(item.gst) || 0,
//       })),
//     };

//     try {
//       const response = await axios.post("http://localhost:5000/api/orders/admin-place", orderData, {
//         withCredentials: true,
//       });

//       if (response.data.success) {
//         alert("Offline order placed successfully!");
//         localStorage.removeItem("cart");
//         clearCart();
//       } else {
//         alert(response.data.message || "Failed to place offline order.");
//       }
//     } catch (error) {
//       console.error("Error placing offline order:", error.response ? error.response.data : error.message);
//       alert("Failed to place offline order. Check console for details.");
//     }
//   };

//   return (
//     <>
//       <NavigationBar />
//       <div className="container mt-5 pt-3">
//         <Breadcrumb>
//           <Breadcrumb.Item href="/admin">Admin</Breadcrumb.Item>
//           <Breadcrumb.Item active>Offline Purchase</Breadcrumb.Item>
//         </Breadcrumb>
//       </div>

//       <div className="container mt-4 pt-2" style={{ maxWidth: "600px" }}>
//         <h2 className="text-center mb-4">Offline Purchase</h2>

//         <Form className="p-4 border rounded shadow bg-white">
//           <Form.Group className="mb-3">
//             <Form.Label className="fw-bold">Customer Name</Form.Label>
//             <Form.Control type="text" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label className="fw-bold">Phone Number</Form.Label>
//             <Form.Control type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label className="fw-bold">For Which Crop?</Form.Label>
//             <Form.Control type="text" value={crop} onChange={(e) => setCrop(e.target.value)} />
//           </Form.Group>

//           <Form.Group className="mb-3">
//             <Form.Label className="fw-bold">Payment Method</Form.Label>
//             <Form.Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
//               <option value="Pay Later">Pay Later</option>
//               <option value="Card">Card</option>
//               <option value="Cash">Cash</option>
//             </Form.Select>
//           </Form.Group>

//           <div className="text-center mt-4">
//             <h4>Total Amount: <span className="text-success fw-bold">₹{totalAmount}</span></h4>
//             <Button variant="primary" className="mt-3 w-100 py-2 fs-5" onClick={handleOfflineOrder}>
//               Place Offline Order
//             </Button>
//           </div>
//         </Form>
//       </div>
//     </>
//   );
// };

// export default AdminOfflineOrder;

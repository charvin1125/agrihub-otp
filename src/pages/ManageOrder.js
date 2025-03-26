// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Table, Button, Modal, Form, Spinner } from "react-bootstrap";
// import { toast } from "react-toastify";

// const ManageOrder = () => {
//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState(null);
//   const [showModal, setShowModal] = useState(false);
//   const [status, setStatus] = useState("");

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   const fetchOrders = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get("http://localhost:5000/api/orders/list",{ withCredentials: true });
//       setOrders(data.orders);
//     } catch (error) {
//       toast.error("Failed to fetch orders");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleUpdateStatus = async (orderId) => {
//     try {
//       await axios.put(`http://localhost:5000/api/orders/update-status/${orderId}`, { status },{ withCredentials: true });
//       toast.success("Order status updated");
//       setShowModal(false);
//       fetchOrders();
//     } catch (error) {
//       toast.error("Failed to update status");
//     }
//   };

//   return (
//     <div className="container mt-4">
//       <h2>Manage Orders</h2>
//       {loading ? (
//         <Spinner animation="border" />
//       ) : (
//         <Table striped bordered hover>
//           <thead>
//             <tr>
//               <th>Order ID</th>
//               <th>Customer</th>
//               <th>Total</th>
//               <th>Payment</th>
//               <th>Status</th>
//               <th>Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {orders.map((order) => (
//               <tr key={order._id}>
//                 <td>{order._id}</td>
//                 <td>{order.name}</td>
//                 <td>₹{order.totalAmount}</td>
//                 <td>{order.paymentMethod}</td>
//                 <td>{order.status}</td>
//                 <td>
//                   <Button
//                     variant="primary"
//                     onClick={() => {
//                       setSelectedOrder(order);
//                       setStatus(order.status);
//                       setShowModal(true);
//                     }}
//                   >
//                     Update Status
//                   </Button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </Table>
//       )}

//       <Modal show={showModal} onHide={() => setShowModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Update Order Status</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form>
//             <Form.Group>
//               <Form.Label>Status</Form.Label>
//               <Form.Select value={status} onChange={(e) => setStatus(e.target.value)}>
//                 <option value="Pending">Pending</option>
//                 <option value="Paid">Paid</option>
//                 <option value="Completed">Completed</option>
//                 <option value="Cancelled">Cancelled</option>
//               </Form.Select>
//             </Form.Group>
//           </Form>
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowModal(false)}>
//             Close
//           </Button>
//           <Button variant="primary" onClick={() => handleUpdateStatus(selectedOrder._id)}>
//             Save Changes
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };

// export default ManageOrder;

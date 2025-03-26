import { useState, useEffect } from "react";
import axios from "axios";
import { Table, Badge } from "react-bootstrap";
import NavigationBar from "../components/Navbar";

const MyBills = () => {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/orders/my-bills", {
          withCredentials: true,
        });

        if (response.data.success) {
          setBills(response.data.orders);
        } else {
          alert("Failed to fetch bills.");
        }
      } catch (error) {
        console.error("Error fetching bills:", error);
        alert("Error fetching bills.");
      }
    };

    fetchBills();
  }, []);

  return (
    <>
      <NavigationBar />
      <div className="container mt-5">
        <h2 className="text-center mb-4">My Bills</h2>

        {bills.length === 0 ? (
          <p className="text-center">No orders found.</p>
        ) : (
          <Table striped bordered hover responsive className="shadow bg-white">
            <thead className="bg-success text-white">
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Date</th>
                <th>Amount (₹)</th>
                <th>Payment Method</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {bills.map((bill, index) => (
                <tr key={bill._id}>
                  <td>{index + 1}</td>
                  <td>{bill._id}</td>
                  <td>{new Date(bill.createdAt).toLocaleDateString()}</td>
                  <td>₹{bill.totalAmount.toFixed(2)}</td>
                  <td>{bill.paymentMethod}</td>
                  <td>
                    <Badge bg={bill.paymentMethod === "Pay Later" ? "warning" : "success"}>
                      {bill.paymentMethod === "Pay Later" ? "Pending" : "Paid"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </div>
    </>
  );
};

export default MyBills;

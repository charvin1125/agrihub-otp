// src/components/admin/ManageCustomers.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Container, Alert } from "react-bootstrap"; 

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/users/customers", {
        withCredentials: true // For session-based auth
      });
      setCustomers(response.data.customers);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching customers");
      setLoading(false);
    }
  };

  // Optional: Add delete functionality
  const handleDelete = async (customerId) => {
    if (window.confirm("Are you sure you want to delete this customer?")) {
      try {
        // You'd need to add a delete endpoint in your backend
        await axios.delete(`http://localhost:5000/api/users/${customerId}`, {
          withCredentials: true
        });
        setCustomers(customers.filter(customer => customer._id !== customerId));
      } catch (err) {
        setError(err.response?.data?.message || "Error deleting customer");
      }
    }
  };

  if (loading) return <Container>Loading...</Container>;
  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="mt-4">
      <h2>Manage Customers</h2>
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Mobile</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer) => (
            <tr key={customer._id}>
              <td>{customer.username}</td>
              <td>{customer.firstName}</td>
              <td>{customer.lastName}</td>
              <td>{customer.mobile}</td>
              <td>
                {/* Add more actions as needed */}
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(customer._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
};

export default ManageCustomers;
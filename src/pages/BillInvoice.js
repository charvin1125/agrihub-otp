import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const BillInvoice = () => {
  const { id } = useParams();
  const [bill, setBill] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/bills/${id}`, {
                    withCredentials: true,
                  });
        setBill(response.data);
      } catch (error) {
        console.error("Error fetching bill details:", error);
        setError("Failed to load bill details. Please try again.");
      }
    };

    fetchBill();
  }, [id]);

  if (error) return <p className="text-danger">{error}</p>;
  if (!bill) return <p>Loading...</p>;

  return (
    <div className="container mt-5">
      <h2>Bill Invoice</h2>
      <p><strong>Bill ID:</strong> {bill.billId}</p>
      <p><strong>Order ID:</strong> {bill.orderId}</p>
      <p><strong>Crop:</strong> {bill.crop}</p>
      <p><strong>Amount:</strong> ₹{bill.amount}</p>
      <p><strong>Dues:</strong> ₹{bill.dues}</p> {/* ✅ Ensure dues are displayed */}
      <p><strong>Date:</strong> {new Date(bill.date).toLocaleDateString()}</p>

      <h4>Order Details</h4>
      {bill.products && bill.products.length > 0 ? ( // ✅ Prevent map error
        <ul className="list-group">
          {bill.products.map((product, index) => (
            <li key={index} className="list-group-item">
              {product.name} - {product.quantity} x ₹{product.price} = ₹{product.quantity * product.price}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No product details available.</p> // ✅ Handle missing data
      )}
    </div>
  );
};

export default BillInvoice;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PreviousBills = () => {
  const [bills, setBills] = useState([]);
  const [totalDues, setTotalDues] = useState(0);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserBills = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/bills/list", {
          withCredentials: true,
        });

        const fetchedBills = response.data || [];
        setBills(fetchedBills);

        // ✅ Calculate total dues (Only unpaid bills)
        const dues = fetchedBills.reduce((sum, bill) => sum + (bill.dues || 0), 0);
        setTotalDues(dues);
      } catch (err) {
        console.error("Error fetching bills:", err);
        setError(err.response?.data?.message || "Failed to load bills.");
      }
    };

    fetchUserBills();
  }, []);

  // ✅ Search Filter Function
  const filteredBills = bills.filter((bill) => {
    const searchText = searchTerm.toLowerCase();

    return (
      bill.billId.toLowerCase().includes(searchText) || // Match Bill ID
      bill.orderId.toLowerCase().includes(searchText) || // Match Order ID
      bill.crop.toLowerCase().includes(searchText) || // Match Crop Name
      new Date(bill.date).toLocaleDateString().includes(searchText) // Match Date (formatted)
    );
  });

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Previous Bills</h2>

      {/* 🔥 Show Total Dues */}
      <div className="alert alert-warning">
        <strong>Total Outstanding Dues: ₹{totalDues.toFixed(2)}</strong>
      </div>

      {/* 🔍 Search Input */}
      <input
        type="text"
        placeholder="Search by Bill ID, Order ID, Crop, or Date..."
        className="form-control mb-3"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {error ? (
        <div className="alert alert-danger">{error}</div>
      ) : filteredBills.length > 0 ? (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Bill ID</th>
              <th>Order ID</th>
              <th>Amount (₹)</th>
              <th>Crop</th>
              <th>Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredBills.map((bill) => (
              <tr key={bill._id}>
                <td>{bill.billId}</td>
                <td>{bill.orderId}</td>
                <td>₹{bill.amount}</td>
                <td>{bill.crop}</td>
                <td>{new Date(bill.date).toLocaleDateString()}</td>
                <td>
                  <span className={`badge ${bill.status === "Paid" ? "bg-success" : "bg-danger"}`}>
                    {bill.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary btn-sm" onClick={() => navigate(`/bills/${bill.billId}`)}>
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="alert alert-info">No bills match your search.</div>
      )}
    </div>
  );
};

export default PreviousBills;

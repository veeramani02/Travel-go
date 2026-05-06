import { useEffect, useState } from "react";
import "../../Styles/Dues.css";
import API_BASE_URL from "../../config/api";

function Dues() {
  const [duesData, setDuesData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const fetchDues = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/due/user-dues`, {
        credentials: "include",
      });

      const data = await res.json();
      console.log("API RESPONSE:", data);

      let formatted = [];
      let total = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      data.dues.forEach((due) => {
        const schedules = due.dueSchedule || [];

        const today = new Date().toISOString().split("T")[0];

        const nextIndex = schedules.findIndex((schedule) => {
          if (schedule.status !== "Pending") return false;

          if (!schedule.dueDate) return false;

          const dueDate = schedule.dueDate.split("T")[0];
          return dueDate <= today;
        });

        if (nextIndex !== -1) {
          const nextDue = schedules[nextIndex];

          formatted.push({
            dueId: due._id,
            tripId: due.tripId?._id,
            scheduleIndex: nextIndex,
            pickup: due.tripId?.pickupCity,
            destination: due.tripId?.destinationCity,
            travelDate: due.tripId?.dateAndTime,
            amount: nextDue.amount,
            status: nextDue.status,
          });

          total += nextDue.amount;
        }
      });
      setDuesData(formatted);
      setTotalAmount(total);
    } catch (error) {
      console.error("Fetch dues error:", error);
    }
  };
  useEffect(() => {
    fetchDues();
  }, []);
  const handlePay = async (dueId, scheduleIndex) => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/due/pay/${dueId}/${scheduleIndex}`,
        {
          method: "POST",
          credentials: "include",
        },
      );

      const data = await res.json();

      alert(data.message);
      setDuesData((prev) => {
        const updated = prev.filter(
          (item) =>
            !(item.dueId === dueId && item.scheduleIndex === scheduleIndex),
        );
        const newTotal = updated.reduce((sum, item) => sum + item.amount, 0);
        setTotalAmount(newTotal);

        return updated;
      });
    } catch (error) {
      console.error("Payment error:", error);
    }
  };
  const handlePayAll = async () => {
    try {
      for (let item of duesData) {
        await fetch(
          `${API_BASE_URL}/api/due/pay/${item.dueId}/${item.scheduleIndex}`,
          {
            method: "POST",
            credentials: "include",
          },
        );
      }

      alert("All dues paid successfully ✅");

      setDuesData([]);
      setTotalAmount(0);
    } catch (error) {
      console.error("Pay all error:", error);
    }
  };
  return (
    <div className="due-container">
      <div className="due-title">
        <h1>Pending Dues</h1>
        <p>Manage your unpaid bookings</p>
      </div>

      <div className="due-total">
        <div className="total-title">
          <p>Total Pending Amount</p>
          <h2>₹{totalAmount}</h2>
        </div>
        <div className="total-buttonwrapper">
          <button
            className="due-button"
            onClick={handlePayAll}
            disabled={duesData.length === 0}
          >
            Pay All
          </button>
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Trip Id</th>
              <th>Pickup</th>
              <th>Destination</th>
              <th>Travel Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {duesData.length === 0 ? (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  No pending dues 🎉
                </td>
              </tr>
            ) : (
              duesData.map((value, index) => (
                <tr key={index}>
                  <td>{value.tripId}</td>
                  <td>{value.pickup}</td>
                  <td>{value.destination}</td>
                  <td>{new Date(value.travelDate).toDateString()}</td>
                  <td>₹{value.amount}</td>
                  <td>
                    <span className="due-status">{value.status}</span>
                  </td>
                  <td>
                    <button
                      className="pay-now-btn"
                      onClick={() =>
                        handlePay(value.dueId, value.scheduleIndex)
                      }
                    >
                      Pay Now
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dues;

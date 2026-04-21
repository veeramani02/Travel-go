import React, { useEffect, useState } from "react";
import StarImage from "../../assets/star2.png";
import "../../Styles/LoyaltyPoints.css";
import API_BASE_URL from "../../config/api";
import CustomizedSnackbars from "../../Components/CustomizedSnackbars";

function LoyaltyPoints() {
  const [points, setPoints] = useState(0);
  const [history, setHistory] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  //  Fetch loyalty data
  useEffect(() => {
    fetchLoyalty();
  }, []);

  const fetchLoyalty = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/loyalty`, {
        method: "GET",
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: data.message || "Failed to fetch loyalty data",
          severity: "error",
        });
        return;
      }

      setPoints(data.totalPoints);
      setHistory(data.history);
    } catch (err) {
      console.log("Fetch Loyalty Error:", err);
    }
  };

  //  Redeem points
  const handleRedeem = async (pts) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/loyalty/redeem`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pointsRequired: pts,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSnackbar({
          open: true,
          message: data.msg || "Not enough points",
          severity: "error",
        });
      } else {
        setSnackbar({
          open: true,
          message: data.msg || "Voucher Redeemed 🎉",
          severity: "success",
        });
        fetchLoyalty();
      }
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: "error",
      });
    }
  };

  return (
    <div className="loyalty-container">
      <h1 className="loyalty-title">Reward Points</h1>

      {/*  Reward Balance Card */}
      <div className="reward-card">
        <div className="circle">
          <img src={StarImage} alt="reward-star" />
        </div>

        <div className="info">
          <p>Your reward balance</p>
          <h2>{points} Points</h2>
        </div>
      </div>

      {/*  Redeem Section */}
      <p className="redeem-title">Redeem Rewards</p>

      <div className="redeem-card">
        <div className="redeem-info">
          <div>
            <h4>20% Discount Voucher</h4>
            <p>(1500 pts)</p>
          </div>
          <button
            className="redeem-btn"
            onClick={() => handleRedeem(1500)}
            disabled={points < 1500}
          >
            Redeem
          </button>
        </div>

        <div className="redeem-info">
          <div>
            <h4>10% Discount Voucher</h4>
            <p>(1000 pts)</p>
          </div>
          <button
            className="redeem-btn"
            onClick={() => handleRedeem(1000)}
            disabled={points < 1000}
          >
            Redeem
          </button>
        </div>

        <div className="redeem-info">
          <div>
            <h4>5% Discount Voucher</h4>
            <p>(500 pts)</p>
          </div>
          <button
            className="redeem-btn"
            onClick={() => handleRedeem(500)}
            disabled={points < 500}
          >
            Redeem
          </button>
        </div>
      </div>

      {/*  Points History Table */}
      <div className="loyalty-table-container">
        <h2 className="loyalty-table-title">Points History</h2>

        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Activity</th>
              <th>Points</th>
            </tr>
          </thead>

          <tbody>
            {history.length === 0 ? (
              <tr>
                <td colSpan="3">No data available</td>
              </tr>
            ) : (
              history.map((item) => (
                <tr key={item._id}>
                  <td>{new Date(item.createdAt).toDateString()}</td>
                  <td>{item.activity}</td>
                  <td
                    className={
                      item.points < 0 ? "points-negative" : "points-positive"
                    }
                  >
                    {item.points > 0 ? `+${item.points}` : item.points}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <CustomizedSnackbars
        open={snackbar.open}
        message={snackbar.message}
        severity={snackbar.severity}
        onClose={() => setSnackbar((p) => ({ ...p, open: false }))}
      />
    </div>
  );
}

export default LoyaltyPoints;

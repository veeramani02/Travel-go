// import "../../Styles/Dues.css"

// function Dues() {

//   const data = [
//     {
//       Id: 13837,
//       Pickup: "Chennai",
//       Destination: "Mumbai",
//       TravelDate: "25 Oct 2024",
//       Amount: "₹12500",
//       status: "unpaid",
//     },
//     {
//       Id: 13888,
//       Pickup: "Kolkata",
//       Destination: "Mumbai",
//       TravelDate: "25 Oct 2024",
//       Amount: "₹12800",
//       status: "unpaid",
//     },
//     {
//       Id: 13840,
//       Pickup: "Bangalore",
//       Destination: "Chennai",
//       TravelDate: "25 Oct 2024",
//       Amount: "₹7000",
//       status: "unpaid",
//     },
//   ]

//   return (
//     <div className="due-container">

//       <div className="due-title">
//         <h1>Pending Dues</h1>
//         <p>Manage your unpaid bookings</p>
//       </div>

//       <div className="due-total">
//         <div className="total-title">
//           <p>Total Pending Amount</p>
//           <h2>₹32,300</h2>
//         </div>
//         <div className="total-buttonwrapper">
//           <button className="due-button">Pay All</button>
//         </div>
//       </div>

//       <div className="table-container">
//         <table>
//           <thead>
//             <tr>
//               <th>Trip Id</th>
//               <th>Pickup</th>
//               <th>Destination</th>
//               <th>Travel Date</th>
//               <th>Amount</th>
//               <th>Status</th>
//               <th>Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {data.map(value => (
//               <tr key={value.Id}>
//                 <td>{value.Id}</td>
//                 <td>{value.Pickup}</td>
//                 <td>{value.Destination}</td>
//                 <td>{value.TravelDate}</td>
//                 <td>{value.Amount}</td>
//                 <td>
//                   <span className="due-status">
//                     {value.status}
//                   </span>
//                 </td>
//                 <td>
//                   <button className="pay-now-btn">Pay Now</button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>

//         </table>
//       </div>

//     </div>
//   )
// }

// export default Dues
import { useEffect, useState } from "react";
import "../../Styles/Dues.css";

function Dues() {
  const [duesData, setDuesData] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  const fetchDues = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/due/user-dues", {
        credentials: "include",
      });

      const data = await res.json();

     
      let formatted = [];
      let total = 0;

      data.dues.forEach((due) => {
        due.dueSchedule.forEach((schedule, index) => {
          if (schedule.status === "pending") {
            formatted.push({
              dueId: due._id,
              scheduleIndex: index,
              tripId: due.tripId?._id,
              pickup: due.tripId?.pickup,
              destination: due.tripId?.destination,
              travelDate: due.tripId?.travelDate,
              amount: schedule.amount,
              status: schedule.status,
            });

            total += schedule.amount;
          }
        });
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
        `http://localhost:3000/api/due/pay/${dueId}/${scheduleIndex}`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await res.json();

      alert(data.message);

     
      fetchDues();

    } catch (error) {
      console.error("Payment error:", error);
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
          <button className="due-button">Pay All</button>
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
                  <td>
                    {new Date(value.travelDate).toDateString()}
                  </td>
                  <td>₹{value.amount}</td>
                  <td>
                    <span className="due-status">
                      {value.status}
                    </span>
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
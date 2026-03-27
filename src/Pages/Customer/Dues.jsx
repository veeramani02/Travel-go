import "../../Styles/Dues.css"

function Dues() {

  const data = [
    {
      Id: 13837,
      Pickup: "Chennai",
      Destination: "Mumbai",
      TravelDate: "25 Oct 2024",
      Amount: "₹12500",
      status: "unpaid",
    },
    {
      Id: 13888,
      Pickup: "Kolkata",
      Destination: "Mumbai",
      TravelDate: "25 Oct 2024",
      Amount: "₹12800",
      status: "unpaid",
    },
    {
      Id: 13840,
      Pickup: "Bangalore",
      Destination: "Chennai",
      TravelDate: "25 Oct 2024",
      Amount: "₹7000",
      status: "unpaid",
    },
  ]

  return (
    <div className="due-container">

      <div className="due-title">
        <h1>Pending Dues</h1>
        <p>Manage your unpaid bookings</p>
      </div>

      <div className="due-total">
        <div className="total-title">
          <p>Total Pending Amount</p>
          <h2>₹32,300</h2>
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
            {data.map(value => (
              <tr key={value.Id}>
                <td>{value.Id}</td>
                <td>{value.Pickup}</td>
                <td>{value.Destination}</td>
                <td>{value.TravelDate}</td>
                <td>{value.Amount}</td>
                <td>
                  <span className="due-status">
                    {value.status}
                  </span>
                </td>
                <td>
                  <button className="pay-now-btn">Pay Now</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  )
}

export default Dues
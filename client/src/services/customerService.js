export const VEHICLE_TYPES = ["Car", "Van", "Tourist Van", "SUV", "Bus"];
export const status = ["Confirmed", "Pending", "Cancelled"];
import API_BASE_URL from "../config/api";

export const TripsData = async () => {
  try {
    const latestRes = await fetch(`${API_BASE_URL}/api/trip/trip`, {
      credentials: "include",
    });
    const res = await latestRes.json();
    return res;
  } catch (err) {
    console.error("Fetch Trips Error:", err);
  }
};

export const vehicleData = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vehicle/vehicle`, {
      credentials: "include",
    });
    if (!res.ok) {
      throw new Error("Failed to fetch vehicle data");
    }
    const result = await res.json();
    return result;
  } catch (err) {
    console.error("Fetch vehicle Error:", err);
    return null;
  }
};

export const getDriver = async () => {
  try {
    let res = await fetch(`${API_BASE_URL}/api/driver/driver`, {
      credentials: "include",
    });
    let data = await res.json();
    return data;
  } catch (e) {
    console.log(e.message);
  }
};

export const getVehicle = async () => {
  try {
    let res = await fetch(`${API_BASE_URL}/api/vehicle/vehicle`, {
      credentials: "include",
    });

    let data = await res.json();
    return data;
  } catch (e) {
    console.log(e.message);
  }
};

export const updateTrips = async (updatedField) => {
  try {
    let res = await fetch(`${API_BASE_URL}/api/trip/update`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedField),
      credentials: "include",
    });
    let data = await res.json();
    return data;
  } catch (e) {
    console.error(e.message);
  }
};

export function getAvatarColor(name) {
  let hash = 0;

  for (let i = 0; i < name?.length; i++) {
    hash += name.charCodeAt(i);
  }

  const hue = hash % 360;

  return `hsl(${hue}, 65%, 55%)`;
}

export const updateUser = async (id, updatedData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/user/update/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
      credentials: "include",
    });
  } catch (e) {
    console.error(e.message);
  }
};

export const sendEmail = async (to, subject, message) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/notify/email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: to,
        subject: subject,
        message: message,
      }),
      credentials: "include",
    });

    const data = await response.text();
  } catch (error) {
    console.error("Error:", error);
  }
};

export const sendSms = async (to, message) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/notify/sms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: `+91${to}`,
        message: message,
      }),
      credentials: "include",
    });

    const data = await res.text();
  } catch (err) {
    console.error(err);
  }
};

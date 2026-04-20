export const VEHICLE_TYPES = ["Car", "Van", "Tourist Van", "SUV", "Bus"];
import API_BASE_URL from "../config/api";

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

export const addDriver = async (formData) => {
  try {
    let res = await fetch(`${API_BASE_URL}/api/driver/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        profile: formData.profile,
        license: formData.license,
        vehicleNo: formData.vehicleNo,
        vehicleType: formData.vehicleType,
        vehicleColor: formData.vehicleColor,
        rating: formData.rating,
        status: formData.status,
        state: formData.state,
        city: formData.city,
        joinedDate: new Date().toISOString().split("T")[0],
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw data.errors || { general: "Something went wrong" };
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateDriver = async (_id, updatedData) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/driver/update/${_id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
        credentials: "include",
      },
    );

    const data = await res.json();

    if (!res.ok) {
      throw data.errors || { general: "Something went wrong" };
    }

    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const deleteDriver = async (_id) => {
  try {
    const res = await fetch(
      `${API_BASE_URL}/api/driver/delete/${_id}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    if (!res.ok) throw new Error("Delete failed");
  } catch (e) {
    console.log(e.message);
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

export const PORT = 3000;
export const VEHICLE_TYPES = ["Car", "Van", "Tourist Van", "SUV"];

export const getDriver = async () => {
  try {
    let res = await fetch(`http://localhost:${PORT}/api/driver/driver`, {
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
    let res = await fetch(`http://localhost:${PORT}/api/driver/add`, {
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
        vehicleNo: formData.licensePlate,
        vehicleType: formData.vehicleType,
        vehicleColor: formData.vehicleColor,
        rating: formData.rating,
        status: formData.status,
        joinedDate: new Date().toISOString().split("T")[0],
      }),
      credentials: "include",
    });
    return await res.json({ message: "Driver added" });
  } catch (err) {
    console.error(err);
  }
};

export const updateDriver = async (_id, data) => {
  const res = await fetch(`http://localhost:${PORT}/api/driver/update/${_id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!res.ok) {
    throw new Error("Failed to update driver");
  }

  return res.json();
};

export const deleteDriver = async (_id) => {
  try {
    const res = await fetch(
      `http://localhost:${PORT}/api/driver/delete/${_id}`,
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

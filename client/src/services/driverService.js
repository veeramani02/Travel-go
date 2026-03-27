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
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        profile: formData.profile,
        license: formData.license,
        vehicle: formData.licensePlate,
        rating: formData.rating,
        status: formData.status,
        joinedDate: new Date().toISOString().split("T")[0],
      }),
      credentials: "include",
    });
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

export const deleteDriver = async (_id) => {
  try {
    await fetch(`http://localhost:${PORT}/api/driver/delete/${_id}`, {
      method: "DELETE",
      credentials: "include",
    });

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

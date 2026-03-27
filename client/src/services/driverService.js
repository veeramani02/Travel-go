export const PORT = 3000;
export const VEHICLE_TYPES = ["Car", "Van", "Tourist Van", "SUV"];

export const getDriver = async () => {
  let res = await fetch(`http://localhost:${PORT}/api/driver/driver`, {
    credentials: "include",
  });
  let data = await res.json();
  return data;
};

export const addDriver = (formData) => {
  console.log(formData);
  fetch(`http://localhost:${PORT}/api/driver/add`, {
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
};

export const deleteDriver = async (_id) => {
  await fetch(`http://localhost:${PORT}/api/driver/delete/${_id}`, {
    method: "DELETE",
    credentials: "include",
  });
};

export function getAvatarColor(name) {
  let hash = 0;

  for (let i = 0; i < name?.length; i++) {
    hash += name.charCodeAt(i);
  }

  const hue = hash % 360;

  return `hsl(${hue}, 65%, 55%)`;
}

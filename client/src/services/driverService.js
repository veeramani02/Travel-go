export const PORT = 3000;
export const VEHICLE_TYPES = ["Car", "Van", "Tourist Van", "SUV"];

export const getDriver = async () => {
    let res = await fetch(`http://localhost:${PORT}/Driver`);
    let data = await res.json();
    return data;
  };

export const addDriver = (formData) => {
fetch(`http://localhost:${PORT}/add`, {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
            name: formData.fullName,
            phone: formData.phone,
            email: formData.email,
            profile: formData.profile,
            vehicle: formData.licensePlate,
            rating: formData.rating,
            status: formData.status,
            joinedDate: new Date().toISOString().split("T")[0],
        })
    });
};

export const deleteDriver = async (_id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete?");
    if (!confirmDelete) return;
      await fetch(`http://localhost:${PORT}/delete/${_id}`, {
        method: "DELETE"
      });
  };


 export function getAvatarColor(name) {
    let hash = 0;

    for (let i = 0; i < name.length; i++) {
     hash += name.charCodeAt(i);
    }

    const hue = hash % 360;

    return `hsl(${hue}, 65%, 55%)`;
  }
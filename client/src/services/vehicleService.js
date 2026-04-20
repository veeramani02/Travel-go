import API_BASE_URL from "../config/api";

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

export const addVehicle = async (formData) => {
  try {
    let res = await fetch(`${API_BASE_URL}/api/vehicle/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel,
        vehicleColor: formData.vehicleColor,
        vehicleNo: formData.vehicleNo,
        seatCapacity: formData.seatCapacity,
        fuelType: formData.fuelType,
        AC: formData.AC,
        frontView: formData.frontView,
        sideView: formData.sideView,
        interior: formData.interior,
        backView: formData.backView,
        status: formData.status,
        document: formData.document,
        policyNo: formData.policyNo,
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw data.errors || { message: "Something went wrong" };
    }
    return data;
  } catch (err) {
    console.log(err);
    throw err;
  }
};

export const updateVehicle = async (_id, updatedData) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vehicle/update/${_id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
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

export const updateVehicleField = async (_id, updatedField) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vehicle/updatefield/${_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedField),
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

export const deleteVehicle = async (_id) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/vehicle/delete/${_id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Delete failed");
  } catch (e) {
    console.log(e.message);
  }
};

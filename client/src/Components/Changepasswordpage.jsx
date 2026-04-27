import React, { useEffect, useState } from "react";
import "../Styles/Changepasswordpage.css";
import { IoEyeOutline } from "react-icons/io5";
import { IoEyeOffOutline } from "react-icons/io5";
import CustomizedSnackbars from "./CustomizedSnackbars";
import API_BASE_URL from "../config/api";
import { sendEmail, sendSms } from "../services/customerService";
import { useAuth } from "../Context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Changepasswordpage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log(user);
  });

  function validation() {
    let { currentPassword, newPassword, confirmPassword } = formData;
    let error = {};
    if (!currentPassword)
      error.currentPassword = "Current password is required";

    if (!newPassword) error.newPassword = "New password is required";

    if (!confirmPassword)
      error.confirmPassword = "Confirm password is required";

    if (newPassword && currentPassword === newPassword)
      error.same = "New password cannot be same as current password";

    if (newPassword && confirmPassword && newPassword !== confirmPassword)
      error.ismatch = "Passwords do not match";

    if (Object.keys(error).length !== 0) {
      setSnackbar({
        open: true,
        message: Object.values(error)[0],
        severity: "error",
      });
      return false;
    }
    return true;
  }

  const handlesubmit = async () => {
    if (!validation()) return;
    try {
      let res = await fetch(`${API_BASE_URL}/api/user/changepassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      let msg = `Hello ${user.name},\nYour account password was changed successfully`;
      if (user.email && user.emailNotify)
        sendEmail(user?.email, "Password change", msg);
      if (user.phone && user.smsNotify) sendSms(user.phone, msg);
      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setSnackbar({
        open: true,
        message: "Password changed successfully",
        severity: "success",
      });
    } catch (e) {
      setSnackbar({
        open: true,
        message: e.message,
        severity: "error",
      });
    }
  };

  return (
    <div className="changepasswordpage-container">
      <h2 className="title">Change Password</h2>
      <div className="changepassword-container">
        <div>
          <form
            className="password-form-container"
            onSubmit={(e) => {
              e.preventDefault();
              handlesubmit();
            }}
          >
            <div>
              <div className="inputlabel">
                <label htmlFor="currentpassword">Current Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter current password"
                  value={formData.currentPassword}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      currentPassword: e.target.value,
                    }))
                  }
                />
                <span
                  className="hidepassword"
                  onClick={() => setShowPassword((p) => !p)}
                >
                  {showPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </span>
              </div>
              <div className="inputlabel">
                <label htmlFor="newpassword">New Password</label>
                <input
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Enter New password"
                  value={formData.newPassword}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      newPassword: e.target.value,
                    }))
                  }
                />
                <span
                  className="hidepassword"
                  onClick={() => setShowNewPassword((p) => !p)}
                >
                  {showNewPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </span>
              </div>
              <div className="inputlabel">
                <label htmlFor="confirmpassword">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Enter confirm password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData((p) => ({
                      ...p,
                      confirmPassword: e.target.value,
                    }))
                  }
                />
                <span
                  className="hidepassword"
                  onClick={() => setShowConfirmPassword((p) => !p)}
                >
                  {showConfirmPassword ? <IoEyeOffOutline /> : <IoEyeOutline />}
                </span>
              </div>
              <div className="changepasswordbtn-div">
                <button className="changepasswordbtn" type="submit">
                  Change Password
                </button>
                <button
                  className="changepasswordbtn"
                  type="button"
                  onClick={() => navigate("/admin/settings")}
                >
                  Back to settings
                </button>
              </div>
            </div>
          </form>
        </div>
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

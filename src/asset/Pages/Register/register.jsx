import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../Login/Login.css";
import "primeicons/primeicons.css";
import { useNavigate } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import axios from "axios";
import { ToastContainer } from "react-toastify";
import { NotifiRegister } from "../../Design/Observable/index.js";

export const validateInput = (str = "") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
};

export const validatePassword = (str = "") => {
  return str.length >= 6;
};

const initFormValue = {
  first_name: "",
  last_name: "",
  email: "",
  password: "",
};
export default function RegisterPage() {
  const [formValue, setFormValue] = useState(initFormValue);
  const [err, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { value, name } = event.target;
    setFormValue({
      ...formValue,
      [name]: value,
    });
    setError(null);
    setLoading(false);
  };
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await axios.post(
        "https://agriculture-traceability.vercel.app/api/v1/auth/register",
        {
          first_name: formValue.first_name,
          last_name: formValue.last_name,
          email: formValue.email,
          password: formValue.password,
        }
      );
      NotifiRegister();
      navigate("/");
    } catch (err) {
      const er = err.response.data.msg;
      if (er.includes("exists")) {
        setError("Email đã tồn tại");
      } else {
        setError("Vui lòng nhập đầy đủ thông tin");
      }
    }
    setLoading(false);
  };
  const navigate = useNavigate();
  return (
    <div className="register-page">
      <ToastContainer/>
      <div className="register-form-container">
        <div className="branding">
          <i
            className="pi pi-spin pi-slack"
            alt="Logo"
            style={{ fontSize: "3rem", color: "green" }}
          />
          {/* <h1 >LaFarm</h1> */}
        </div>
        <h1 className="titlelogin">Đăng kí</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-2">
            {/* <label htmlFor="first-name" className="form-label">
              Họ
            </label> */}
            <InputText
              placeholder="Họ"
              id="first-name"
              className="form-control"
              type="text"
              name="first_name"
              value={formValue.first_name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            {/* <label htmlFor="last-name" className="form-label">
              Tên
            </label> */}
            <InputText
              placeholder="Tên"
              id="last-name"
              className="form-control"
              type="text"
              name="last_name"
              value={formValue.last_name}
              onChange={handleChange}
            />
          </div>
          <div className="mb-2">
            {/* <label htmlFor="email" className="form-label">
              Email hoặc số điện thoại
            </label> */}
            <InputText
              placeholder="Email"
              id="email"
              className="form-control"
              type="text"
              name="email"
              value={formValue.email}
              onChange={handleChange}
            />
            {formValue.email && !validateInput(formValue.email) ? (
              <p className="error-feedback">Email không đúng định dạng</p>
            ) : null}
          </div>
          <div className="mb-2">
            {/* <label htmlFor="password" className="form-label">
              Mật khẩu
            </label> */}
            <div className="password-input-container">
              <InputText
                placeholder="Mật khẩu"
                id="password"
                className="form-control"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formValue.password}
                onChange={handleChange}
              />
              {formValue.password && !validatePassword(formValue.password) ? (
                <p className="error-feedback">Mật khẩu đủ 6 kí tự</p>
              ) : null}
              <div className="toggle-password" onClick={toggleShowPassword}>
                {/* <FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} /> */}
              </div>
            </div>
            {/* <div className="text-note">Nhập 6 kí tự trở lên</div> */}
          </div>
          {/* {err && ( */}
            <p data-testid="error" className="error-feedback">
              {err}
            </p>
          {/* )} */}
          <button
            disabled={
              !formValue.email ||
              !formValue.password ||
              !formValue.first_name ||
              !formValue.last_name
            }
            type="submit"
            className="submit-btn"
            style={{
              cursor:( !formValue.email || !formValue.password || !formValue.first_name || !formValue.last_name) ? "" : "pointer",
               backgroundColor: (!formValue.email || !formValue.password || !formValue.first_name || !formValue.last_name) ? "grey" : " #0D955C", 
             }}
          >
            {loading ? "Loading" : "Đăng kí"}
          </button>
          <Link to="/" className="create-account">
            <p>Bạn đã có tài khoản. </p>
            <span> Đăng nhập?</span>
          </Link>
        </form>
      </div>
    </div>
  );
}

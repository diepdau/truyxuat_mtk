import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import { AuthContext } from "../../service/user_service.js";
import Observer from "../../Design/Observable/Observer.jsx";
import { toast } from "react-toastify";
export const validateInput = (str = "") => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(str);
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginApi,currentUser } = useContext(AuthContext);
  const [err, setError] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    setError(null);
    setLoading(false);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError(null);
    setLoading(false);
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await loginApi({ email, password });
      Observer.notify("Đăng nhập thành công!");
      navigate("/danh-sach-dan");
    } catch (err) {
      toast.error("Lỗi đăng nhập");
      console.log(err);
      const er = err.response.data.msg;
      if (er.includes("credentials")) {
        setError("Email không tồn tại");
      } else {
        setError("Email hoặc mật khẩu sai");
      }
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <div className="branding">
          <i
            className="pi pi-spin pi-slack"
            alt="Logo"
            style={{ fontSize: "3rem", color: "green" }}
          />
        </div>
        <h2 className="titlelogin">Đăng nhập</h2>
        <form>
          <div className="mb-2">
            <input
              placeholder="Email"
              id="email"
              className="form-control"
              type="email"
              name="email"
              onChange={handleEmailChange}
              value={email}
            />
            {email && !validateInput(email) ? (
              <p className="error-feedback">Email không đúng định dạng</p>
            ) : null}
          </div>
          <div className="mb-2">
            <div className="password-input-container">
              <input
                id="password"
                className="form-control"
                type="password"
                name="password"
                placeholder="Password"
                onChange={handlePasswordChange}
                value={password}
              />
            </div>
            <p data-testid="error" className="error-feedback">
              {err}
            </p>
            <Link to="/forgot-password" className="forgot-password">
              Quên mật khẩu?
            </Link>
          </div>
          <button
            disabled={!email || !password}
            onClick={handleClick}
            className="submit-btn"
            style={{
              cursor: !email || !password ? "" : "pointer",
              backgroundColor: !email || !password ? "grey" : "#0D955C",
            }}
          >
            {loading ? "Loading" : "Đăng nhập"}
          </button>
          <Link to="/register" className="create-account">
            <p>Bạn chưa có tài khoản. </p>
            <span> Đăng kí?</span>
          </Link>
        </form>
      </div>
    </div>
  );
};

export default Login;

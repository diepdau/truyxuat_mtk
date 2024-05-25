import axios from "axios";
import { createContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
export const AuthContext = createContext("");

export const AuthContexProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [token, setToken] = useState(JSON.parse(localStorage.getItem("userToken")) || null);


  const loginApi = async (inputs) => {
      const res = await axios.post("https://agriculture-traceability.vercel.app/api/v1/auth/login", inputs);
      const user = res.data.user;
      const accountToken = res.data.token;
      setCurrentUser({ ...user, expirationTime: Date.now() + 24 * 60 * 60 * 1000 });
      setToken(accountToken);
      localStorage.getItem("userToken",accountToken)
      return res;
    
  };
  const logout = async (token) => {
    
  //   await axios.get("https://agriculture-traceability.vercel.app/api/v1/auth/logout",{
  //     headers: {
  //       Authorization: `Bearer ${token}`
  //   }
  //   }
  // );
    
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");

  };


  useEffect(() => {
    localStorage.setItem("user", JSON.stringify(currentUser));
    localStorage.setItem("userToken", JSON.stringify(token));
    
  }, [currentUser,token]);

  useEffect(() => {
    const tokenExpirationTime = currentUser?.expirationTime;
    const currentTime = Date.now();

    if (tokenExpirationTime && currentTime > tokenExpirationTime) {
      alert("Đã hết thời gian đăng nhập");
      logout();
      // Đăng xuất nếu token đã hết hạn
    }
  }, [currentUser, logout]);

  return (
    <AuthContext.Provider value={{ currentUser, token, loginApi, logout }}>
      {children}
    </AuthContext.Provider>
  );
};


import axios from "axios";
import { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState({});

  const handleClick = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "https://agriculture-traceability.vercel.app/api/v1/auth/login",
        { email, password }
      );
      console.log(res.data.user);
      setUser(res.data.user)
    } catch {
      setError(true);
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <span className="user">{user.name}</span>
      <form>
        <input
          type="email"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button disabled={!email || !password} onClick={handleClick}>
          {loading ? "please wait" : "Login"}
        </button>
        <span
          data-testid="error"
          style={{ visibility: error ? "visible" : "hidden" }}
        >
          Something went wrong!
        </span>
      </form>
    </div>
  );
};
export default ForgotPasswordPage;

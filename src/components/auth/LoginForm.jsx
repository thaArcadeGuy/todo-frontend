import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const LoginForm = ({ onToggleForm }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login_form">
      <h2>Sign in</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">
          Email
          <input 
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>

        <label htmlFor="password">
          Password
          <input 
            type="password"
            name="password"
            value={password}  
            onChange={(e) => setPassword(e.target.value)}    
            required    
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login" }
        </button>
      </form>

      <p>
        Not yet a user?{" "}
        <span id="show_signup" onClick={onToggleForm}>
          Sign up here
        </span>
      </p>
    </div>
  );
};

export default LoginForm;
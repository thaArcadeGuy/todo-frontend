import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const SignupForm = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup_form">
      <h2>Welcome</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="name">
          name
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="email">
          Email
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </label>

        <label htmlFor="password">
          Password
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </button>
      </form>

      <p>
        Already registered?{" "}
        <span id="show_signin" onClick={onToggleForm}>
          Sign in here
        </span>
      </p>
    </div>
  );
};

export default SignupForm;
import { useState, useEffect } from "react"; 
import { useNavigate } from "react-router";
import LoginForm from "./LoginForm";
import SignupForm from "./SignupForm";
import { useAuth } from "../../hooks/useAuth";
import clockImage from "../../assets/clock.png";
import logoImage from "../../assets/koola-logo.png";
import "./AuthPage.css"

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.hash === "#login") {
      setIsLogin(true);
    }
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/tasks");
    }
  }, [user, navigate]);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <main className="auth-container">
      <div className="image_section">
        <img src={clockImage} alt="Clock" />
      </div>
      <div className="form_section">
        <div className="logo-container">
          <img src={logoImage} alt="Logo" className="logo" />
        </div>

        {isLogin ? (
          <SignupForm onToggleForm={toggleForm} />
        ) : (
          <LoginForm onToggleForm={toggleForm} />
        )}
      </div>
    </main>
  );
};

export default AuthPage
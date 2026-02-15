import { useNavigate } from "react-router";
import { useAuth } from "../../hooks/useAuth";
import { LogOut } from "lucide-react";
import logoImage from "../../assets/koola-logo.png";

const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      <div className="container">
        <img src={logoImage} alt="Koola Logo" className="logo" />
        <LogOut
          size={24}
          className="logout"
          onClick={handleLogout}
          style={{ cursor: "pointer" }} 
        />
      </div>
    </header>
  );
};

export default Header;
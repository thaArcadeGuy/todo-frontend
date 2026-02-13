// const BASE_URL = "https://koola-mcf3.onrender.com/api";
const BASE_URL = "http://localhost:8000/api"

if (window.location.hash === "#login") {
  document.querySelector(".login_form").style.display = "block";
  document.querySelector(".signup_form").style.display = "none";
}

document.querySelector("#show_signin").addEventListener("click", () => {
  document.querySelector(".login_form").style.display = "block";
  document.querySelector(".signup_form").style.display = "none";
});

document.querySelector("#show_signup").addEventListener("click", () => {
  document.querySelector(".login_form").style.display = "none";
  document.querySelector(".signup_form").style.display = "block";
});

// User Registration
document.querySelector(".signup_form form").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    username: e.target.username.value,
    email: e.target.email.value,
    password: e.target.password.value
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href = "./todos.html";
    } else {
      alert(data.message || "Registration failed");
    }

  } catch (error) {
    console.error("Error:", error);
    alert("registration failed. Please try again.");
  }
});

// User login
document.querySelector(".login_form form").addEventListener("submit", async(e) => {
  e.preventDefault();

  const formData = {
    email: e.target.email.value,
    password: e.target.password.value
  };

  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)    
    });

    const data = await response.json();

    if (response.ok) {
      localStorage.setItem("token", data.token);
      window.location.href ="./todos.html";
    } else {
      alert(data.message || "Login failed");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Login failed. Please try again.")
  }
});
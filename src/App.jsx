import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { Toaster } from "react-hot-toast";
import { HelmetProvider } from "react-helmet-async";
import { AuthProvider } from "./contexts/AuthContext";
import AuthPage from "./components/auth/AuthPage";
import TodosPage from "./pages/TodosPage";
import './App.css'

function App() {
  return (
    <HelmetProvider>
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: "#363636",
                color: "#fff"
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: "#4ade80",
                  secondary: "#fff"
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: "#ef4444",
                  secondary: "#fff"
                },
              },
            }}
          />
          <Routes>
            <Route path="/" element={<AuthPage />} />
            <Route path="/todos" element={<TodosPage />} />
            <Route path="*" element={<Navigate to="/scripts" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </HelmetProvider>
  )
}

export default App

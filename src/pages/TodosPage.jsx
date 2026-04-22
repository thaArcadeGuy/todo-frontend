import { useEffect } from "react";
import { useNavigate } from "react-router"
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import TodoList from "../components/todos/TodoList";
import { useAuth } from "../hooks/useAuth";

const TodosPage = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header />
      <main>
        <TodoList />
      </main>
      <Footer />
    </>
  );
};

export default TodosPage;
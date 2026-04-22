import { useState, useEffect } from "react";
import { todoService } from "../services/taskservice";
import { TASK_STATE } from "../utils/constants";

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTodos()
  }, []);

  const loadTodos = async () => {
    try {
      setLoading(true);
      const data = await todoService.getAll();
      setTodos(data.sort((a, b) => b.order - a.order));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false)
    }
  };

  const addTodo = (newTodo) => {
    setTodos(prev => [newTodo, ...prev].sort((a, b) => b.order - a.order));
  };

  const updateTodo = (updatedTodo) => {
    setTodos(prev =>
      prev.map(todo => todo._id === updatedTodo._id ? updatedTodo : todo)
    );
  };

  const deleteTodo = (todoId) => {
    setTodos(prev => prev.filter(todo => todo._id !== todoId));
  }

  const clearCompleted = () => {
    setTodos(prev => prev.filter(todo => todo.state !== TASK_STATE.COMPLETED));
  };

  const getFilteredTodos = (filter) => {
    return todos.filter(todo => {
      if (filter === "active") return todo.state === TASK_STATE.ACTIVE;
      if (filter === "completed") return todo.state === TASK_STATE.COMPLETED;
      return true;
    });
  };

  const getActiveCount = () => {
    return todos.filter(todo => todo.state === TASK_STATE.ACTIVE).length;
  };

  return {
    todos,
    loading,
    error,
    addTodo,
    updateTodo,
    deleteTodo,
    clearCompleted,
    getFilteredTodos,
    getActiveCount,
    refreshTodos: loadTodos
  };
};
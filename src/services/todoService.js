import api from "./api";
import toast from "react-hot-toast";

export const todoService = {
  // Get all todos
  getAll: async () => {
    try {
      const response = await api.get("/todos");
      return response.data;
    } catch (error) {
      toast.error("Failed to load todos");
      throw error
    }
  },

  // Create todo
  create: async (text) => {
    try {
      const response = await api.post("/todos", { text });
      toast.success("Todo created successfully!");
      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create todos");
      throw error
    }
  },

  //Update todo state 
  updateState: async (id, state) => {
    try {
      const response = await api.patch(`/todos/${id}`, { state });
      return response.data;
    } catch (error) {
      toast.error("Failed to update todo");
      throw error
    }
  },
  
  // Delete todo {
  delete: async (id) => {
    try {
      await api.delete(`/todos/${id}`);
      toast.success("Todo deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete todo");
      throw error;
    }
  },

  // Clear completed todos
  clearCompleted: async (todoIds) => {
    try {
      await Promise.all(todoIds.map(id => api.delete(`/todos/${id}`)));
      toast.success("Completed todos cleared!")
    } catch (error) {
      toast.error("Failed to clear completed todos");
      throw error
    }
  }
}
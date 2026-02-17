import api from "./api";
import toast from "react-hot-toast";

export const todoService = {
  // Get all todos
  getAll: async () => {
    try {
      const response = await api.get("/tasks");
      const allTasks = response.data.data || [];

      const currentUserResponse = await api.get("/auth/me");
      const currentUserId = currentUserResponse.data.id;

      const myTasks = allTasks.filter(task => task.owner === currentUserId);

       return myTasks.map(task => ({
      ...task,
      id: task.id || task._id
    }));

      // return response.data.data || [];
    } catch (error) {
      toast.error("Failed to load tasks");
      throw error
    }
  },

  // Create todo
  create: async (text) => {
    try {
      const taskData = {
        name: text,
        status: "TODO"
      }
      const response = await api.post("/tasks", taskData);
      toast.success("Task created successfully!");
      return response.data.data || response.data;
    } catch (error) {
      const errorMessage = error.response?.data?.error?.issues?.[0]?.message || 
                        error.response?.data?.message || 
                        "Failed to create task";
      toast.error(errorMessage);
      throw error
    }
  },

  //Update todo state 
  updateState: async (id, state) => {
    try {
      const response = await api.patch(`/tasks/${id}`, { state });
      return response.data.data;
    } catch (error) {
      toast.error("Failed to update task");
      throw error
    }
  },
  
  // Delete todo {
  delete: async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task");
      throw error;
    }
  },

  // Clear completed todos
  clearCompleted: async (todoIds) => {
    try {
      await Promise.all(todoIds.map(id => api.delete(`/tasks/${id}`)));
      toast.success("Completed todos cleared!")
    } catch (error) {
      toast.error("Failed to clear completed todos");
      throw error
    }
  }
}
import api from "./api";
import toast from "react-hot-toast";
import type { TaskState } from "../utils/constants";
import { isApiError } from "../utils/errorUtils";

export type Todo = {
  id: string,
  _id?: string,
  name: string,
  status: TaskState,
  owner:string,
  order: number
}

type CreateTaskPayload = {
  name: string,
  status: Extract<TaskState, "TODO">
}

type ApiTodoResponse = {
  data: Todo[]
}

export const todoService = {
  // Get all todos
  getAll: async (): Promise<Todo[]> => {
    try {
      const response = await api.get<ApiTodoResponse>("/tasks");
      const allTasks = response.data.data || [];

      const currentUserResponse = await api.get<{ id: string }>("/auth/me");
      const currentUserId = currentUserResponse.data.id;

      const myTasks = allTasks.filter(task => task.owner === currentUserId);

       return myTasks.map((task: Todo): Todo => ({
      ...task,
      id: task.id || task._id || ""
    }));

      // return response.data.data || [];
    } catch (error) {
      toast.error("Failed to load tasks");
      throw error
    }
  },

  // Create todo
  create: async (text: string): Promise<Todo> => {
    try {
      const taskData: CreateTaskPayload = {
        name: text,
        status: "TODO"
      }
      const response = await api.post<{ data: Todo }>("/tasks", taskData);
      toast.success("Task created successfully!");
      return response.data.data || response.data;
    } catch (error) {
      const errorMessage = isApiError(error) 
        ? error.response?.data?.error?.issues?.[0]?.message || 
          error.response?.data?.message
          : undefined;
      toast.error(errorMessage || "Failed to create task");
      throw error
    }
  },

  //Update todo state 
  updateState: async (id: string, status: TaskState): Promise<Todo> => {
    try {
      const response = await api.patch<{ data: Todo }>(`/tasks/${id}`, { status });
      return response.data.data;
    } catch (error) {
      toast.error("Failed to update task");
      throw error
    }
  },
  
  // Delete todo {
  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/tasks/${id}`);
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task");
      throw error;
    }
  },

  // Clear completed todos
  clearCompleted: async (todoIds: string[]): Promise<void> => {
    try {
      await Promise.all(todoIds.map(id => api.delete(`/tasks/${id}`)));
      toast.success("Completed todos cleared!")
    } catch (error) {
      toast.error("Failed to clear completed todos");
      throw error
    }
  }
}
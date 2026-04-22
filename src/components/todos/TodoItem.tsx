import { todoService } from "../../services/todoService";
import { X } from "lucide-react";
import "./TodoItem.css";

const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const handleCheckboxChange = async () => {
    const newStatus = todo.status === "DONE" ? "TODO" : "DONE";
    onUpdate({ ...todo, status: newStatus });

    try {
      await todoService.updateState(todo.id, newStatus);
    } catch (error) {
      console.error("Toggle failed, reverting");
      onUpdate({ ...todo, status: todo.status });
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await todoService.delete(todo.id);
        onDelete(todo.id);
      } catch (error) {
        console.error("Delete failed:", error);
      }
    }
  };

  return (
    <li className="flex-row" data-id={todo._id} data-state={todo.state}>
      <label className="list-item">
        <div
          className={`custom-checkbox ${todo.status === "DONE" ? "checked" : ""}`}
          onClick={handleCheckboxChange}
        >
          {todo.status === "DONE" && <span className="checkmark">✓</span>}
        </div>
        <span
          className={`todo-text ${todo.status === "DONE" ? "completed" : ""}`}
        >
          {todo.name || todo.text}
        </span>
      </label>
      <button className="delete-button" onClick={handleDelete}>
        <X size={20} className="delete-icon" />
      </button>
    </li>
  );
};

export default TodoItem;

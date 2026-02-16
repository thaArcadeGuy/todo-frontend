import { TASK_STATE } from "../../utils/constants";
import { todoService } from "../../services/todoService";
import { X } from "lucide-react";
import "./TodoItem.css"


const TodoItem = ({ todo, onUpdate, onDelete }) => {
  const handleCheckboxChange = async (e) => {
    const newState = e.target.checked ? TASK_STATE.COMPLETED : TASK_STATE.ACTIVE;
    await todoService.updateState(todo._id, newState);
    onUpdate({ ...todo, state: newState });
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await todoService.delete(todo.id);
        onDelete(todo.id);
      } catch (error) {
        console.error('Delete failed:', error);
      }

    }
  };

  return (
    <li className="flex-row" data-id={todo._id} data-state={todo.state}>
      <label className="list-item">
        <input
          type="checkbox"
          className="todo-checkbox"
          checked={todo.state === TASK_STATE.COMPLETED}
          onChange={handleCheckboxChange}
        />
        <span className="todo-text">{todo.name || todo.text}</span>
      </label>
      <button className="delete-button" onClick={handleDelete}>
        <X size={20} className="delete-icon" />
      </button>
    </li>
  );
};

export default TodoItem;

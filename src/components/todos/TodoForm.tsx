import { useState } from "react";
import { todoService, type Todo } from "../../services/todoService";
import { Plus } from "lucide-react";
import "./TodoForm.css";
import type { JSX } from "react";

type AddTodoFormProps = {
    onTodoAdded: (todo: Todo) => void
}

const TodoForm =({ onTodoAdded }: AddTodoFormProps): JSX.Element => {
  const [text, setText] = useState<string>("");
  const [submitting, setSubmitting] = useState<boolean>(false);

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim()) return;

    setSubmitting(true);
    try {
      const newTodo: Todo = await todoService.create(text);
      onTodoAdded(newTodo);
      setText("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form className="flex-row task-input-form" id="todo-form" onSubmit={handleSubmit}>
      <input
        type="text"
        id="todo-input"
        placeholder="Add a new task"
        value={text}
        onChange={(e) => setText(e.target.value)}
        autoComplete="off"
        required 
      />
      <button type="submit" id="add-button" disabled={submitting}>
        <Plus size={24} className="add-icon" />
      </button>
    </form>
  );
};

export default TodoForm;
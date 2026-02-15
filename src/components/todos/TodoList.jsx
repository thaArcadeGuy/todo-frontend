import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import TodoFilters from "./TodoFilters";
import { todoService } from "../../services/todoService";
import { FILTERS, TASK_STATE } from "../../utils/constants";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState(FILTERS.ALL);
  const [loading, setLoading] =  useState(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async () => {
    setLoading(true);
    const data = await todoService.getAll();
    const sortedTodos = data.sort((a, b) => b.order - a.order);
    setTodos(sortedTodos);
    setLoading(false);
  };

  const handleAddTodo = (newTodo) => {
    setTodos(prev => [newTodo, ...prev].sort((a, b) => b.order - a.order));
  };

  const handleUpdateTodo = (updatedTodo) => {
    setTodos(prev => 
      prev.map(todo => todo._id === updatedTodo._id ? updatedTodo : todo)
    );
  };

  const handleDeleteTodo = (todoId) => {
    setTodos(prev => prev.filter(todo => todo._id !== todoId));
  };

  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.state === TASK_STATE.COMPLETED)
      .map(todo => todo._id);

    await todoService.clearCompleted(completedIds);
    setTodos(prev => prev.filter(todo => todo.state !== TASK_STATE.COMPLETED));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FILTERS.ACTIVE) return todo.state === TASK_STATE.ACTIVE;
    if (filter === FILTERS.COMPLETED) return todo.state === TASK_STATE.COMPLETED;
    return true;
  });

  const activeCount = todos.filter(todo => todo.state === TASK_STATE.ACTIVE).length;

  if (loading) {
    return <div className="loading"> Loading your tasks...</div>;
  }

  return (
    <section>
      <h1>Your To Do</h1>
      <TodoForm onTodoAdded={handleAddTodo} />

      <ul id="todo-list">
        {filteredTodos.map(todo => (
          <TodoItem 
            key={todo.id}
            todo={todo}
            onUpdate={handleUpdateTodo}
            onDelete={handleDeleteTodo}
          />
        ))}
      </ul>

      <TodoFilters
        activeCount={activeCount}
        currentFilter={filter}
        onFilterChange={setFilter}
        onClearCompleted={handleClearCompleted}
      />
    </section>
  );
};

export default TodoList;
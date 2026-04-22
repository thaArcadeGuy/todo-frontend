import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import TodoFilters from "./TodoFilters";
import { todoService } from "../../services/todoService";
import { FILTERS, TASK_STATE } from "../../utils/constants";
import "./TodoList.css"

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
      prev.map(todo => todo.id === updatedTodo.id 
        ? { ...todo, status: updatedTodo.status } 
        : todo
      )
    );
  };

  const handleDeleteTodo = (todoId) => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

  const handleClearCompleted = async () => {
    const completedIds = todos
      .filter(todo => todo.status === "DONE")
      .map(todo => todo.id);

    await todoService.clearCompleted(completedIds);
    setTodos(prev => prev.filter(todo => todo.status !== "DONE"));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FILTERS.ACTIVE) return todo.status === "TODO";
    if (filter === FILTERS.COMPLETED) return todo.status === "DONE";
    return true;
  });

  const activeCount = todos.filter(todo => todo.status === "TODO").length;

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
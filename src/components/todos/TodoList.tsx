import { useState, useEffect } from "react";
import TodoItem from "./TodoItem";
import TodoForm from "./TodoForm";
import TodoFilters from "./TodoFilters";
import { todoService, type Todo } from "../../services/todoService";
import { FILTERS, TASK_STATE, type Filter } from "../../utils/constants";
import "./TodoList.css"

const TodoList = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>(FILTERS.ALL);
  const [loading, setLoading] =  useState<boolean>(true);

  useEffect(() => {
    loadTodos();
  }, []);

  const loadTodos = async (): Promise<void> => {
    setLoading(true);
    try {
      const data: Todo[] = await todoService.getAll();
      const sortedTodos = data.sort((a, b) => b.order - a.order);
      setTodos(sortedTodos);
    } catch (error) {
      console.error("Failed to load todos:", error)
    } finally {
      setLoading(false);
    } 
  };

  const handleAddTodo = (newTodo: Todo): void => {
    setTodos(prev => [newTodo, ...prev].sort((a, b) => b.order - a.order));
  };

  const handleUpdateTodo = (updatedTodo: Todo): void => {
    setTodos(prev => 
      prev.map(todo => todo.id === updatedTodo.id 
        ? { ...todo, status: updatedTodo.status } 
        : todo
      )
    );
  };

  const handleDeleteTodo = (todoId: string): void => {
    setTodos(prev => prev.filter(todo => todo.id !== todoId));
  };

  const handleClearCompleted = async (): Promise<void> => {
    const completedIds: string[] = todos
      .filter(todo => todo.status === TASK_STATE.DONE)
      .map(todo => todo.id);

    await todoService.clearCompleted(completedIds);
    setTodos(prev => prev.filter(todo => todo.status !== TASK_STATE.DONE));
  };

  const filteredTodos = todos.filter(todo => {
    if (filter === FILTERS.ACTIVE) return todo.status === TASK_STATE.TODO;
    if (filter === FILTERS.COMPLETED) return todo.status === TASK_STATE.DONE;
    return true;
  });

  const activeCount = todos.filter(todo => todo.status === TASK_STATE.TODO).length;

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
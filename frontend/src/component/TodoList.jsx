import React from "react";
import TodoItem from "./TodoItem";

function TodoList({ todos, onTodoUpdated, onTodoDeleted }) {
  if (!todos || todos.length === 0) {
    return <p className="text-center text-gray-500 mt-4">No todos found.</p>;
  }

  return (
    <div className="space-y-3">
      {todos.map((todo) => (
        <TodoItem
          key={todo._id}
          todo={todo}
          onTodoUpdated={onTodoUpdated}
          onTodoDeleted={onTodoDeleted}
        />
      ))}
    </div>
  );
}

export default TodoList;

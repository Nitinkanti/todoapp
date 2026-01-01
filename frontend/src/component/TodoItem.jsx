import React, { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext";

function TodoItem({ todo, onTodoUpdated, onTodoDeleted }) {
  const { token } = useContext(AuthContext); // Check if token is directly available
  
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description);

  // Toggle completed status
  const toggleCompleted = async () => {
    setUpdating(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/todos/update/${todo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            completed: !todo.completed,
            title: todo.title,
            description: todo.description 
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Update failed");
        return;
      }

      onTodoUpdated(); // Refresh parent list
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Save edited todo
  const handleEditSave = async () => {
    if (!editTitle.trim()) {
      setError("Title is required");
      return;
    }

    setUpdating(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/todos/update/${todo._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ 
            title: editTitle.trim(),
            description: editDesc.trim(),
            completed: todo.completed 
          }),
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Update failed");
        return;
      }

      onTodoUpdated();
      setIsEditing(false);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  // Delete todo
  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this todo?")) return;

    setUpdating(true);
    setError("");

    try {
      const res = await fetch(
        `http://localhost:5000/api/todos/delete/${todo._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) {
        const data = await res.json();
        setError(data.message || "Delete failed");
        return;
      }

      onTodoDeleted(todo._id);
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setUpdating(false);
    }
  };

  if (isEditing) {
    return (
      <div className="bg-blue-50 border border-blue-200 p-4 rounded shadow">
        <div className="space-y-2">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Todo title"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Description"
            rows="2"
          />
        </div>
        
        {error && (
          <div className="mt-2 text-red-600 text-sm">{error}</div>
        )}
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={handleEditSave}
            disabled={updating || !editTitle.trim()}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save"}
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setEditTitle(todo.title);
              setEditDesc(todo.description);
              setError("");
            }}
            className="px-3 py-1 border rounded hover:bg-gray-50"
            disabled={updating}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white p-4 rounded shadow border-l-4 ${
      todo.completed ? 'border-green-500' : 'border-blue-500'
    }`}>
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className={`font-bold text-lg ${
            todo.completed ? "line-through text-gray-500" : "text-gray-800"
          }`}>
            {todo.title}
          </h3>
          
          {todo.description && (
            <p className="text-gray-600 mt-1">{todo.description}</p>
          )}
          
          {error && (
            <div className="mt-2 text-red-600 text-sm">{error}</div>
          )}
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={toggleCompleted}
            disabled={updating}
            className={`px-3 py-1 rounded text-sm ${
              todo.completed 
                ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                : 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
            } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {todo.completed ? '✅ Done' : '⏳ Pending'}
          </button>
          
          <button
            onClick={() => setIsEditing(true)}
            disabled={updating}
            className="px-3 py-1 bg-gray-100 text-gray-800 rounded hover:bg-gray-200 text-sm disabled:opacity-50"
          >
            Edit
          </button>
          
          <button
            onClick={handleDelete}
            disabled={updating}
            className="px-3 py-1 bg-red-100 text-red-800 rounded hover:bg-red-200 text-sm disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default TodoItem;
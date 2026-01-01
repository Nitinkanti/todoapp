// Dashboard.jsx
import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../component/Navbar";
import TodoForm from "../component/TodoForm";
import TodoList from "../component/TodoList";

function Dashboard() {
  const { token } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showTodoList, setShowTodoList] = useState(false); // ✅ New state

  // Function to fetch todos
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch("http://localhost:5000/api/todos/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to fetch todos");
      }
      
      setTodos(data.list || []);
      setShowTodoList(true); // ✅ Show list after fetching
    } catch (err) {
      setError(err.message || "Failed to load todos");
      setTodos([]);
    } finally {
      setLoading(false);
    }
  };

  // When todo is added
  const handleTodoAdded = () => {
    // Refresh the list if it's already showing
    if (showTodoList) {
      fetchTodos();
    }
  };

  // When todo is deleted
  const handleTodoDeleted = (deletedId) => {
    setTodos(todos.filter(todo => todo._id !== deletedId));
  };

  // Toggle todo list visibility
  const toggleTodoList = () => {
    if (!showTodoList) {
      fetchTodos(); // Fetch todos when showing for first time
    } else {
      setShowTodoList(false); // Just hide, don't clear data
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-4xl mx-auto p-4">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">Todo Dashboard</h1>
          
          {/* Control Buttons */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={toggleTodoList}
              disabled={loading}
              className={`px-4 py-2 rounded transition ${
                showTodoList 
                  ? 'bg-gray-200 text-gray-800 hover:bg-gray-300' 
                  : 'bg-indigo-600 text-white hover:bg-indigo-700'
              }`}
            >
              {showTodoList ? 'Hide Todo List' : 'Show My Todo List'}
            </button>
            
            <button
              onClick={fetchTodos}
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50"
            >
              {loading ? 'Refreshing...' : 'Refresh List'}
            </button>
          </div>
          
          {/* Stats */}
          {todos.length > 0 && (
            <div className="mb-4 p-3 bg-blue-50 rounded">
              <p className="text-sm text-blue-800">
                📊 You have <strong>{todos.length}</strong> todo{todos.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Todo Form (Always Visible) */}
          <div>
            <TodoForm onTodoAdded={handleTodoAdded} />
          </div>
          
          {/* Right Column - Todo List (Conditional) */}
          <div>
            {showTodoList ? (
              <div className="bg-white rounded-lg shadow p-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Your Todo List</h2>
                  <button
                    onClick={() => setShowTodoList(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                
                {loading ? (
                  <div className="text-center py-8">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
                    <p className="mt-2 text-gray-600">Loading todos...</p>
                  </div>
                ) : todos.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No todos found.</p>
                    <p className="text-sm text-gray-400 mt-1">Create a todo using the form!</p>
                  </div>
                ) : (
                  <>
                    <TodoList 
                      todos={todos}
                      onTodoUpdated={fetchTodos}
                      onTodoDeleted={handleTodoDeleted}
                    />
                    <div className="mt-4 pt-4 border-t text-sm text-gray-500 text-center">
                      {todos.length} item{todos.length !== 1 ? 's' : ''}
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                  <span className="text-2xl">📋</span>
                </div>
                <h3 className="text-lg font-medium text-gray-700 mb-2">Todo List Hidden</h3>
                <p className="text-gray-500 mb-4">Click "Show My Todo List" to view your todos</p>
                <button
                  onClick={toggleTodoList}
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Show Todo List
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
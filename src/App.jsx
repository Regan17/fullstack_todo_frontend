import { useEffect, useState } from 'react';
import axios from 'axios';
import { comment } from 'postcss';

const backendUrl = "http://50.19.91.207:3000";
const first="1";

function App() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    const res = await axios.get(`${backendUrl}/todos`);
    setTodos(res.data);
  };

  const addTodo = async () => {
    if (!task.trim()) return;
    await axios.post(`${backendUrl}/todos`, { task });
    setTask("");
    fetchTodos();
  };

  const deleteTodo = async (id) => {
    await axios.delete(`${backendUrl}/todos/${id}`);
    fetchTodos();
  };

  const startEditing = (todo) => {
    setEditingId(todo.id);
    setEditText(todo.task);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditText("");
  };

  const saveEdit = async (id) => {
    if (!editText.trim()) return;
    await axios.put(`${backendUrl}/todos/${id}`, { task: editText });
    setEditingId(null);
    setEditText("");
    fetchTodos();
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-6 transition-colors">
      <div className="max-w-xl mx-auto bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-4 text-center">📝 To-Do App</h1>
        <div className="flex gap-2 mb-4">
          <input
            value={task}
            onChange={e => setTask(e.target.value)}
            placeholder="New task"
            className="flex-1 p-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>
        <ul className="space-y-2">
          {todos.map(todo => (
            <li key={todo.id} className="flex items-center justify-between bg-white dark:bg-gray-700 p-3 rounded-md shadow">
              {editingId === todo.id ? (
                <>
                  <input
                    value={editText}
                    onChange={e => setEditText(e.target.value)}
                    className="flex-1 p-2 rounded-md dark:bg-gray-600 dark:text-white border dark:border-gray-500"
                  />
                  <div className="flex gap-2 ml-2">
                    <button onClick={() => saveEdit(todo.id)} className="text-green-500">✔️</button>
                    <button onClick={cancelEditing} className="text-red-500">❌</button>
                  </div>
                </>
              ) : (
                <>
                  <span onClick={() => startEditing(todo)} className="flex-1 cursor-pointer">{todo.task}</span>
                  <button onClick={() => deleteTodo(todo.id)} className="text-red-500 ml-4">🗑</button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;

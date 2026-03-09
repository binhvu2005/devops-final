import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchTodos = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
      setError('');
    } catch (e) {
      setError('Không thể tải danh sách việc làm (kiểm tra backend/database).');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    try {
      const res = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTodo.trim(), completed: false }),
      });
      if (!res.ok) throw new Error();
      setNewTodo('');
      fetchTodos();
    } catch {
      setError('Không thể thêm todo mới.');
    }
  };

  const handleToggle = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}/toggle`, { method: 'PATCH' });
      if (!res.ok) throw new Error();
      fetchTodos();
    } catch {
      setError('Không thể cập nhật trạng thái todo.');
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (!res.ok && res.status !== 204) throw new Error();
      fetchTodos();
    } catch {
      setError('Không thể xoá todo.');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Todo List - Kết nối PostgreSQL</h1>
        <p>ReactJS + Spring Boot + PostgreSQL (mã đề 009)</p>

        <form onSubmit={handleAddTodo} className="todo-form">
          <input
            type="text"
            placeholder="Nhập việc cần làm..."
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <button type="submit">Thêm</button>
        </form>

        {loading && <p>Đang tải dữ liệu...</p>}
        {error && <p className="error">{error}</p>}

        <ul className="todo-list">
          {todos.map((todo) => (
            <li key={todo.id} className={todo.completed ? 'completed' : ''}>
              <span onClick={() => handleToggle(todo.id)}>
                {todo.title}
              </span>
              <button onClick={() => handleDelete(todo.id)}>Xoá</button>
            </li>
          ))}
          {!loading && todos.length === 0 && !error && (
            <p>Chưa có việc nào, hãy thêm một todo để lưu vào database.</p>
          )}
        </ul>
      </header>
    </div>
  );
}

export default App;

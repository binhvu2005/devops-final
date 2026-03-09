import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Test kết nối với backend
    fetch('/api/health')
      .then(res => res.json())
      .then(data => setMessage(data.message || 'Backend connected!'))
      .catch(err => setMessage('Error connecting to backend'));
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Rikkei Fullstack Application</h1>
        <p>ReactJS + Spring Boot + PostgreSQL</p>
        <div className="status">
          <p>Backend Status: {loading ? 'Loading...' : message}</p>
        </div>
      </header>
    </div>
  );
}

export default App;

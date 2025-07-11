import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import './App.css';
import AddDateModal from './components/AddDateModal';
import DateCard from './components/DateCard';
import DateModal from './components/DateModal';
import EditDateModal from './components/EditDateModal';

function App() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [authenticated, setAuthenticated] = useState(() => {
    return localStorage.getItem("authenticated") === "true";
  });
  const [password, setPassword] = useState('');
  const [editDate, setEditDate] = useState(null);

  const secret = "iloveshyam";

  const handleLogin = () => {
    if (password === secret) {
      setAuthenticated(true);
      localStorage.setItem("authenticated", "true");
    } else {
      alert("Wrong password 😢");
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem("authenticated");
  };

  const handleDelete = (id) => {
    setDates(prev => prev.filter(d => d._id !== id));
  };

  const getSortedDates = () => {
    const sorted = [...dates].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
    return sorted;
  };

  useEffect(() => {
    if (authenticated) {
      fetch(`${import.meta.env.VITE_API_URL}/api/dates`)
        .then(res => res.json())
        .then(data => setDates(data))
        .catch(err => console.error(err));
    }
  }, [authenticated]);

  useEffect(() => {
    if (authenticated) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [authenticated]);

  if (!authenticated) {
    return (
      <div className="auth-gate">
        <h1>💌</h1>
        <h2>Hi!! 😙 Enter the password to see our date-wall!</h2>
        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </form>
        <button onClick={handleLogin} className="enterButton">Enter</button>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="top-bar">
        <h1 className="title">📸 An Online Photo-Wall For All Our Dates! 📸</h1>
        <div className="controls-row">
          <button className="control-btn" onClick={() => setShowAddModal(true)}>
            Add New Date +
          </button>
          <div className="sort-container">
            <label htmlFor="sort-select">Sort by:</label>
            <select
              id="sort-select"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="newest">Newest → Oldest</option>
              <option value="oldest">Oldest → Newest</option>
            </select>
          </div>
          <button className="control-btn logout-btn" onClick={handleLogout}>
            Log Out
          </button>
        </div>
      </div>

      <div className="gallery">
        {getSortedDates().map(date => (
          <DateCard key={date._id} date={date} onClick={setSelectedDate} />
        ))}
      </div>

      {selectedDate && (
        <DateModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onDelete={handleDelete}
          onEdit={(date) => {
            setEditDate(date);
            setSelectedDate(null);
          }}
        />
      )}

      {showAddModal && (
        <AddDateModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newDate) => setDates(prev => [newDate, ...prev])}
        />
      )}

      {editDate && (
        <EditDateModal
          initialData={editDate}
          onClose={() => setEditDate(null)}
          onUpdate={(updatedDate) => {
            setDates(prev =>
              prev.map(d => (d._id === updatedDate._id ? updatedDate : d))
            );
            setEditDate(null);
          }}
        />
      )}

    </div>
  );
}

export default App;

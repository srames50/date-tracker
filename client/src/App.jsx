import confetti from 'canvas-confetti';
import { useEffect, useState } from 'react';
import './App.css';
import DateCard from './components/DateCard';
import DateModal from './components/DateModal';
import AddDateModal from './components/AddDateModal';

function App() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const secret = "iloveshyam";
  

  const handleDelete = (id) => {
    setDates(prev => prev.filter(d => d._id !== id));
  };
  
  const getSortedDates = () => {
    const sorted = [...dates].sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return sortOrder === 'newest'
        ? dateB - dateA
        : dateA - dateB;
    });
    return sorted;
  };

  useEffect(() => {
    fetch('http://localhost:5050/api/dates')
      .then(res => res.json())
      .then(data => setDates(data))
      .catch(err => console.error(err));
  }, []);

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
        <h2>💌</h2>
        <p>Hi!! 😙 Enter the password to see our date-wall!</p>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === secret) {
              setAuthenticated(true);
            } else {
              alert("Wrong password 😢");
            }
          }}
        >
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
        </form>
        <button onClick={() => {
          if (password === secret) {
            setAuthenticated(true);
          } else {
            alert("Wrong password 😢");
          }
        }}>
          Enter
        </button>
      </div>
    );
  }

  return (
    <div className="app">
      <h1>📸 Our Dates</h1>
      <button className="add-date-btn" onClick={() => setShowAddModal(true)}>+ Add Date</button>
      <div className="sort-container">
        <label htmlFor="sort-select">Sort by: </label>
        <select
          id="sort-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
    >
          <option value="newest">Newest → Oldest</option>
          <option value="oldest">Oldest → Newest</option>
        </select>
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
        />
      )}

      {showAddModal && (
        <AddDateModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newDate) => setDates(prev => [newDate, ...prev])}
        />
      )}
    </div>
  );

}

export default App;

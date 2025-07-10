import { useEffect, useState } from 'react';
import './App.css';
import DateCard from './components/DateCard';
import DateModal from './components/DateModal';
import AddDateModal from './components/AddDateModal';

function App() {
  const [dates, setDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleDelete = (id) => {
    setDates(prev => prev.filter(d => d._id !== id));
  };
  

  useEffect(() => {
    fetch('http://localhost:5050/api/dates')
      .then(res => res.json())
      .then(data => setDates(data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="app">
      <button className="add-date-btn" onClick={() => setShowAddModal(true)}>+ Add Date</button>
      <h1>📸 Our Dates</h1>

      <div className="gallery">
        {dates.map(date => (
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

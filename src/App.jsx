import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


function App() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [newDest, setNewDest] = useState({
    name: '',
    country: '',
    description: '',
    budget: '',
    currency: 'USD, EUR, GPB',
    status: 'wishlist'
  });

  useEffect(() => {
    axios.get('http://localhost:3001/destinations')
      .then(response => {
        console.log('Data received:', response.data);
        setDestinations(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching destinations:', error);
        setLoading(false);
      });
  }, []);

  const wishlist = destinations.filter(d => d.status === 'wishlist');
  const visited = destinations.filter(d => d.status === 'visited');

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      axios.delete(`http://localhost:3001/destinations/${id}`)
        .then(() => {
          setDestinations(destinations.filter(d => d.id !== id));
        })
        .catch(error => console.error('Error deleting:', error));
    }
  };

  const handleAddDestination = () => {
    if (!newDest.name || !newDest.country || !newDest.description || !newDest.budget) {
      alert('Please fill in all required fields');
      return;
    }

    const destinationToAdd = {
      id: Date.now().toString(),
      name: newDest.name,
      country: newDest.country,
      description: newDest.description,
      budget: Number(newDest.budget),
      currency: newDest.currency,
      status: newDest.status,
      myNote: '',
      rating: null,
      createdAt: new Date().toISOString()
    };

    axios.post('http://localhost:3001/destinations', destinationToAdd)
      .then(response => {
        setDestinations([...destinations, response.data]);
        setShowForm(false);
        setNewDest({
          name: '',
          country: '',
          description: '',
          budget: '',
          currency: 'USD',
          status: 'wishlist'
        });
        alert('Destination added successfully!');
      })
      .catch(error => {
        console.error('Error adding destination:', error);
        alert('Failed to add destination');
      });
  };

  const handleUpdateNote = (id, currentNote) => {
    const newNote = prompt('Enter your note:', currentNote || '');
    if (newNote !== null) {
      axios.patch(`http://localhost:3001/destinations/${id}`, { myNote: newNote })
        .then(response => {
          setDestinations(destinations.map(d => d.id === id ? response.data : d));
        })
        .catch(error => console.error('Error saving note:', error));
    }
  };

  const DestinationCard = ({ dest }) => (
    <div style={{ border: '1px solid #121212', padding: '15px', borderRadius: '8px' }}>


      <h3>{dest.name}</h3>
      <p><strong>Country:</strong> {dest.country}</p>
      <p><strong>Description:</strong> {dest.description}</p>
      <p><strong>💰 Budget:</strong> {dest.currency} {dest.budget}</p>
      <p><strong>📍 Status:</strong> {dest.status}</p>
      {dest.rating && <p><strong>⭐ Rating:</strong> {dest.rating}/5</p>}

      <div style={{ marginTop: '10px', padding: '10px', background: '#f4f3f0', borderRadius: '5px', borderLeft: '3px solid #fdfdfc' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong>📝 My Note:</strong>
          <button
            onClick={() => handleUpdateNote(dest.id, dest.myNote)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
          >
            ✏️
          </button>
        </div>
        <p style={{ marginTop: '8px', color: '#0e0d0d' }}>
          {dest.myNote || "No note yet. Click pencil to add one!"}
        </p>
      </div>

      <button
        onClick={() => handleDelete(dest.id, dest.name)}
        style={{
          backgroundColor: '#040c13',
          color: 'white',
          border: 'none',
          padding: '8px',
          borderRadius: '4px',
          cursor: 'pointer',
          marginTop: '10px',
          width: '100%'
        }}
      >
        🗑️ Delete
      </button>
    </div>
  );

  return (
    <BrowserRouter>
      <div>
        <nav style={{ padding: '20px', background: '#f0f0f0' }}>
          <Link to="/" style={{ marginRight: '15px' }}>Home</Link>
          <Link to="/wishlist" style={{ marginRight: '15px' }}>Wishlist ({wishlist.length})</Link>
          <Link to="/visited">Visited ({visited.length})</Link>
        </nav>

        <div style={{ padding: '20px' }}>
          <h1>🌍 Travel Bucket List</h1>

          <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center' }}>
            <input
              type="text"
              placeholder="🔍 Search destinations by country"
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                maxWidth: '600px',
                padding: '12px 20px',
                fontSize: '16px',
                border: '2px solid #3498db',
                borderRadius: '25px',
                outline: 'none',
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
              }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
            <button
              onClick={() => setShowForm(true)}
              style={{
                backgroundColor: '#28a745',
                color: 'white',
                border: 'none',
                padding: '12px 30px',
                fontSize: '16px',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
            >
              + Add New Destination
            </button>
          </div>

          {showForm && (
            <>
              <div style={{
                position: 'fixed',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                backgroundColor: 'white',
                padding: '20px',
                borderRadius: '10px',
                boxShadow: '0 0 20px rgba(0,0,0,0.3)',
                zIndex: 1000,
                maxWidth: '400px',
                width: '90%'
              }}>
                <h3>Add New Destination</h3>
                <input
                  placeholder="Name *"
                  value={newDest.name}
                  onChange={(e) => setNewDest({ ...newDest, name: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <input
                  placeholder="Country *"
                  value={newDest.country}
                  onChange={(e) => setNewDest({ ...newDest, country: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <textarea
                  placeholder="Description *"
                  value={newDest.description}
                  onChange={(e) => setNewDest({ ...newDest, description: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <input
                  placeholder="Budget *"
                  type="number"
                  value={newDest.budget}
                  onChange={(e) => setNewDest({ ...newDest, budget: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                />
                <select
                  value={newDest.currency}
                  onChange={(e) => setNewDest({ ...newDest, currency: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
                <select
                  value={newDest.status}
                  onChange={(e) => setNewDest({ ...newDest, status: e.target.value })}
                  style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                >
                  <option value="wishlist">Wishlist</option>
                  <option value="visited">Visited</option>
                </select>

                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    onClick={handleAddDestination}
                    style={{
                      background: '#28a745',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setShowForm(false)}
                    style={{
                      background: '#dc3545',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      flex: 1
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 999
              }} onClick={() => setShowForm(false)} />
            </>
          )}

          {loading ? (
            <p>Loading destinations...</p>
          ) : (
            <Routes>
              <Route path="/" element={
                <div>
                  <h2>All Destinations</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {destinations
                      .filter(dest =>
                        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        dest.country.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(dest => <DestinationCard key={dest.id} dest={dest} />)}
                  </div>
                </div>
              } />

              <Route path="/wishlist" element={
                <div>
                  <h2>My Wishlist ({wishlist.length})</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {wishlist
                      .filter(dest =>
                        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        dest.country.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(dest => <DestinationCard key={dest.id} dest={dest} />)}
                  </div>
                </div>
              } />

              <Route path="/visited" element={
                <div>
                  <h2>Places I've Visited ({visited.length})</h2>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                    {visited
                      .filter(dest =>
                        dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        dest.country.toLowerCase().includes(searchTerm.toLowerCase())
                      )
                      .map(dest => <DestinationCard key={dest.id} dest={dest} />)}
                  </div>
                </div>
              } />
            </Routes>
          )}
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
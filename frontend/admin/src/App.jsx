import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import './App.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [extinguishers, setExtinguishers] = useState([]);
  const [barcode, setBarcode] = useState('');
  const [trainNumber, setTrainNumber] = useState('');
  const [coachNo, setCoachNo] = useState('');
  const [mfgDate, setMfgDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [batchNumber, setBatchNumber] = useState('');
  const [expiring, setExpiring] = useState([]);
  const [selectedTrain, setSelectedTrain] = useState('');
  const [selectedExpiringTrain, setSelectedExpiringTrain] = useState('');
  const [filteredExtinguishers, setFilteredExtinguishers] = useState([]);
  const [filteredExpiring, setFilteredExpiring] = useState([]);

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true);
      fetchData();
    }
  }, [token]);

  const fetchData = () => {
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.get('http://localhost:5000/api/extinguishers', config)
      .then(res => {
        setExtinguishers(res.data);
        setFilteredExtinguishers(res.data);
      })
      .catch(err => console.log('Fetch error:', err));

    axios.get('http://localhost:5000/api/expiring', config)
      .then(res => {
        console.log('Expiring Data:', res.data);
        setExpiring(res.data);
        setFilteredExpiring(res.data);
      })
      .catch(err => console.log('Expiring fetch error:', err));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/login', { username, password })
      .then(res => {
        const token = res.data.token;
        localStorage.setItem('token', token);
        setToken(token);
        setIsAuthenticated(true);
        setUsername('');
        setPassword('');
      })
      .catch(err => {
        console.log('Login error:', err);
        alert('Invalid credentials');
      });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setIsAuthenticated(false);
  };

  const addExtinguisher = (e) => {
    if (e) e.preventDefault();
    const newExt = { barcode, trainNumber, coachNo, mfgDate, expiryDate, batchNumber };
    const config = { headers: { Authorization: `Bearer ${token}` } };
    axios.post('http://localhost:5000/api/extinguishers', newExt, config)
      .then(res => {
        const updatedList = [...extinguishers, res.data];
        setExtinguishers(updatedList);
        setFilteredExtinguishers(updatedList);
        fetchData();
        setBarcode('');
        setTrainNumber('');
        setCoachNo('');
        setMfgDate('');
        setExpiryDate('');
        setBatchNumber('');
      })
      .catch(err => console.log('Add error:', err));
  };

  const filterByTrain = () => {
    if (selectedTrain) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      axios.get(`http://localhost:5000/api/extinguishers/${selectedTrain}`, config)
        .then(res => setFilteredExtinguishers(res.data))
        .catch(err => console.log('Filter error:', err));
    } else {
      setFilteredExtinguishers(extinguishers);
    }
  };

  const filterExpiringByTrain = () => {
    if (selectedExpiringTrain) {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      axios.get(`http://localhost:5000/api/expiring/${selectedExpiringTrain}`, config)
        .then(res => {
          console.log('Filtered Expiring Data:', res.data);
          setFilteredExpiring(res.data);
        })
        .catch(err => console.log('Expiring filter error:', err));
    } else {
      setFilteredExpiring(expiring);
    }
  };

  const groupByTrainNumber = (data) => {
    return data.reduce((acc, ext) => {
      const train = ext.trainNumber;
      if (!acc[train]) {
        acc[train] = [];
      }
      acc[train].push(ext);
      return acc;
    }, {});
  };

  // Prepare data for charts
  const totalExtinguishersByTrain = groupByTrainNumber(extinguishers);
  const expiringByTrain = groupByTrainNumber(expiring);

  // Bar Graph Data (Total Extinguishers per Train)
  const barData = {
    labels: Object.keys(totalExtinguishersByTrain),
    datasets: [
      {
        label: 'Total Extinguishers',
        data: Object.values(totalExtinguishersByTrain).map(group => group.length),
        backgroundColor: '#3498db',
        borderColor: '#2980b9',
        borderWidth: 1,
      },
    ],
  };

  // Pie Chart Data (Expiring Extinguishers Distribution)
  const pieData = {
    labels: Object.keys(expiringByTrain),
    datasets: [
      {
        label: 'Expiring Extinguishers',
        data: Object.values(expiringByTrain).map(group => group.length),
        backgroundColor: [
          '#3498db',
          '#e74c3c',
          '#2ecc71',
          '#f1c40f',
          '#9b59b6',
        ],
        borderColor: '#ffffff',
        borderWidth: 1,
      },
    ],
  };

  const groupedExtinguishers = groupByTrainNumber(filteredExtinguishers);
  const groupedExpiring = groupByTrainNumber(filteredExpiring);

  if (!isAuthenticated) {
    return (
      <div className="login-page">
        <div className="login-container">
          <h1>Fire Extinguisher Tracker - Login</h1>
          <form onSubmit={handleLogin}>
            <input
              placeholder="Username"
              value={username}
              onChange={e => setUsername(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <button className="logout-button" onClick={handleLogout}>Logout</button>
      <h1>Fire Extinguisher Management System</h1>

      <form onSubmit={addExtinguisher}>
        <input placeholder="Barcode" value={barcode} onChange={e => setBarcode(e.target.value)} />
        <input placeholder="Train Number" value={trainNumber} onChange={e => setTrainNumber(e.target.value)} />
        <input placeholder="Coach No" value={coachNo} onChange={e => setCoachNo(e.target.value)} />
        <input type="date" value={mfgDate} onChange={e => setMfgDate(e.target.value)} />
        <input type="date" value={expiryDate} onChange={e => setExpiryDate(e.target.value)} />
        <input placeholder="Batch Number" value={batchNumber} onChange={e => setBatchNumber(e.target.value)} />
        <button type="submit">Add Extinguisher</button>
      </form>

      <div>
        <h2>Filter by Train Number (All Extinguishers)</h2>
        <div className="filter-container">
          <input 
            placeholder="Enter Train Number" 
            value={selectedTrain} 
            onChange={e => setSelectedTrain(e.target.value)} 
          />
          <button onClick={filterByTrain}>Filter</button>
        </div>
      </div>

      <h2>All Extinguishers</h2>
      {Object.keys(groupedExtinguishers).length > 0 ? (
        Object.keys(groupedExtinguishers).map(train => (
          <div key={train}>
            <h3>Train: {train}</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Coach No</th>
                  <th>Mfg Date</th>
                  <th>Expiry Date</th>
                  <th>Batch Number</th>
                </tr>
              </thead>
              <tbody>
                {groupedExtinguishers[train].map(ext => (
                  <tr key={ext._id}>
                    <td>{ext.barcode}</td>
                    <td>{ext.coachNo}</td>
                    <td>{new Date(ext.mfgDate).toLocaleDateString()}</td>
                    <td>{new Date(ext.expiryDate).toLocaleDateString()}</td>
                    <td>{ext.batchNumber}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No extinguishers available.</p>
      )}

      <div>
        <h2>Filter by Train Number (Expiring Soon)</h2>
        <div className="filter-container">
          <input 
            placeholder="Enter Train Number" 
            value={selectedExpiringTrain} 
            onChange={e => setSelectedExpiringTrain(e.target.value)} 
          />
          <button onClick={filterExpiringByTrain}>Filter</button>
        </div>
      </div>

      <h2>Expiring Soon (within 30 days)</h2>
      {Object.keys(groupedExpiring).length > 0 ? (
        Object.keys(groupedExpiring).map(train => (
          <div key={train}>
            <h3>Train: {train}</h3>
            <table border="1">
              <thead>
                <tr>
                  <th>Barcode</th>
                  <th>Coach No</th>
                  <th>Expiry Date</th>
                </tr>
              </thead>
              <tbody>
                {groupedExpiring[train].map(ext => (
                  <tr key={ext._id}>
                    <td>{ext.barcode}</td>
                    <td>{ext.coachNo}</td>
                    <td>{new Date(ext.expiryDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>No extinguishers expiring soon.</p>
      )}

      {/* Dashboard Section with Charts (Moved to Last) */}
      <div className="dashboard">
        <h2>Dashboard</h2>
        <div className="charts-container">
          <div className="chart">
            <h3>Total Extinguishers per Train (Bar Graph)</h3>
            {Object.keys(totalExtinguishersByTrain).length > 0 ? (
              <Bar data={barData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p>No data available for bar graph.</p>
            )}
          </div>
          <div className="chart">
            <h3>Expiring Extinguishers Distribution (Pie Chart)</h3>
            {Object.keys(expiringByTrain).length > 0 ? (
              <Pie data={pieData} options={{ maintainAspectRatio: false }} />
            ) : (
              <p>No data available for pie chart.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
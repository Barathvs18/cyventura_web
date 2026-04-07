import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import api from '../services/api';
import LeaderboardTable from '../Components/LeaderboardTable';
import '../styles/leaderboard.css';

const Leaderboard = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await api.get('/leaderboard');
      setLeaderboard(response.data.leaderboard);
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="leaderboard-container">
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <button 
          onClick={() => navigate('/dashboard')} 
          style={{ 
            display: 'flex', alignItems: 'center', gap: '8px', 
            background: 'transparent', border: '1px solid rgba(255, 26, 26, 0.4)', 
            color: '#ff1a1a', padding: '8px 16px', borderRadius: '8px', 
            cursor: 'pointer', fontFamily: "'Unica One', sans-serif", 
            textTransform: 'uppercase', letterSpacing: '1px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255, 26, 26, 0.15)'}
          onMouseOut={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <ArrowLeft size={16} /> Back
        </button>
        <h1 style={{ flex: 1, margin: 0, textAlign: 'center', marginRight: '85px' }}>Global Leaderboard</h1>
      </div>
      {loading ? (
        <p style={{textAlign: 'center'}}>Loading data...</p>
      ) : (
        <LeaderboardTable leaderboard={leaderboard} />
      )}
    </div>
  );
};

export default Leaderboard;

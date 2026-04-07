import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import ChallengeCard from '../Components/ChallengeCard';
import '../styles/dashboard.css';

const Dashboard = () => {
  const { user, login } = useContext(AuthContext);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userScore, setUserScore] = useState(user?.score || 0);

  useEffect(() => {
    fetchChallenges();
  }, []);

  // Sync score when user updates in context
  useEffect(() => {
    if (user) setUserScore(user.score || 0);
  }, [user]);

  const fetchChallenges = async () => {
    try {
      const response = await api.get('/challenge/all');
      setChallenges(response.data);
    } catch (error) {
      console.error('Failed to fetch challenges:', error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  // Called when a flag is submitted correctly – re-fetch user from /auth/me to update score
  const handleFlagSubmit = async (result) => {
    if (result.correct) {
      try {
        const res = await api.get('/auth/me');
        setUserScore(res.data.score);
      } catch (e) {
        console.error('Could not refresh user score', e);
      }
    }
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading-state">Loading challenge...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
      </div>

      <div className="weekly-challenge-section">
        <h2>Active Challenges For This Week :</h2>
        {challenges.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '30px', justifyContent: 'center' }}>
            {challenges.map((c) => (
              <div key={c.id} style={{ width: '500px', height: '500px', display: 'flex' }}>
                <ChallengeCard challenge={c} onFlagSubmit={handleFlagSubmit} />
              </div>
            ))}
          </div>
        ) : (
          <div className="no-challenge" style={{marginTop: '20px'}}>No active challenges available right now. Stay tuned!</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

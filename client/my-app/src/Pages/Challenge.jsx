import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ChallengeCard from '../Components/ChallengeCard';
import '../styles/dashboard.css';

const Challenge = () => {
  const { id } = useParams();
  const [challenge, setChallenge] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallengeById();
  }, [id]);

  const fetchChallengeById = async () => {
    try {
      const response = await api.get(`/challenge/${id}`);
      setChallenge(response.data);
    } catch (error) {
      console.error('Failed to fetch challenge', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFlagSubmit = (result) => {
    if (result.correct) {
      alert('Correct! Flag solved successfully.');
    }
  };

  if (loading) {
    return <div className="dashboard-container">Loading...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="weekly-challenge-section">
        <h2>Challenge Details</h2>
        <ChallengeCard challenge={challenge} onFlagSubmit={handleFlagSubmit} />
      </div>
    </div>
  );
};

export default Challenge;

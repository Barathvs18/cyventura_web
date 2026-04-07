import React, { useState } from 'react';
import api from '../services/api';

const FlagSubmit = ({ challengeId, onResult }) => {
  const [flag, setFlag] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!flag.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await api.post('/submit-flag', {
        challenge_id: challengeId,
        flag: flag.trim()
      });
      
      setResult({
        success: response.data.correct,
        message: response.data.message
      });
      
      if (onResult && response.data.correct) {
        onResult(response.data);
      }
    } catch (error) {
      if (error.response?.status === 429) {
        setResult({ success: false, message: 'Too many attempts. Please wait.' });
      } else if (error.response?.status === 409) {
        setResult({ success: true, message: 'You have already solved this challenge!' });
      } else {
        setResult({ success: false, message: error.response?.data?.detail || 'An error occurred.' });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flag-submit-container">
      <form onSubmit={handleSubmit} className="flag-input-group">
        <input
          type="text"
          className="flag-input"
          placeholder="Enter flag format: flag{...}"
          value={flag}
          onChange={(e) => setFlag(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="submit-btn" disabled={loading || !flag.trim()}>
          {loading ? 'Submitting...' : 'Submit Flag'}
        </button>
      </form>

      {result && (
        <div className={`submit-result ${result.success ? 'success' : 'error'}`}>
          {result.message}
        </div>
      )}
    </div>
  );
};

export default FlagSubmit;

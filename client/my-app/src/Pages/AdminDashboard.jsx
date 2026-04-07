import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../Components/AdminSidebar';
import '../styles/admin.css';

const AdminDashboard = () => {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await api.get('/admin/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Failed to fetch challenges', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const endpoint = currentStatus ? `/admin/challenge/${id}/deactivate` : `/admin/challenge/${id}/activate`;
      await api.put(endpoint);
      fetchChallenges(); // refresh data
    } catch (error) {
      alert('Failed to update challenge status');
    }
  };

  const deleteChallenge = async (id) => {
    if (window.confirm("Are you really sure you want to permanently delete this challenge?")) {
      try {
        await api.delete(`/admin/challenge/${id}`);
        fetchChallenges(); // refresh data
      } catch (error) {
        alert('Failed to delete challenge');
      }
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main-content">
        <div className="admin-container">
          <div className="admin-header">
            <h1>Admin Dashboard</h1>
          </div>

      <div className="admin-card">
        <h2>All Challenges</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Points</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {challenges.map(c => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.points}</td>
                  <td>
                    <span className={`status-badge ${c.active ? 'correct' : 'incorrect'}`}>
                      {c.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <div style={{display: 'flex', gap: '8px'}}>
                      <button 
                        onClick={() => toggleActive(c.id, c.active)}
                        style={{padding: '6px 12px', background: '#334155', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1}}
                      >
                        {c.active ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => deleteChallenge(c.id)}
                        style={{padding: '6px 12px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', flex: 1}}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;

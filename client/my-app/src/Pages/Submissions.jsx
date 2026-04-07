import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../Components/AdminSidebar';
import '../styles/admin.css';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await api.get('/admin/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Failed to fetch submissions', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main-content">
        <div className="admin-container">
          <div className="admin-header">
            <h1>All Submissions</h1>
          </div>

      <div className="admin-card">
        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="submissions-table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Challenge</th>
                <th>Submitted Flag</th>
                <th>Result</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {submissions.map(sub => (
                <tr key={sub.id}>
                  <td style={{fontWeight: '600', color: '#38bdf8'}}>{sub.username}</td>
                  <td style={{color: '#f1f5f9', fontWeight: '500'}}>{sub.challenge_title}</td>
                  <td style={{fontFamily: 'monospace'}}>{sub.submitted_flag}</td>
                  <td>
                    <span className={`status-badge ${sub.is_correct ? 'correct' : 'incorrect'}`}>
                      {sub.is_correct ? 'Correct' : 'Incorrect'}
                    </span>
                  </td>
                  <td style={{fontSize: '0.85rem'}}>{new Date(sub.submitted_at).toLocaleString()}</td>
                </tr>
              ))}
              {submissions.length === 0 && (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>No submissions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
    </main>
    </div>
  );
};

export default Submissions;

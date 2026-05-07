import React, { useState, useEffect } from 'react';
import api from '../services/api';
import AdminSidebar from '../Components/AdminSidebar';
import '../styles/admin.css';

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id, username) => {
    if (window.confirm(`Remove user "${username}"? This cannot be undone.`)) {
      try {
        await api.delete(`/admin/user/${id}`);
        setUsers((prev) => prev.filter((u) => u.id !== id));
      } catch (error) {
        const msg = error?.response?.data?.detail || 'Failed to remove user';
        alert(msg);
      }
    }
  };

  const filtered = users.filter(
    (u) =>
      u.username.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="admin-layout">
      <AdminSidebar />
      <main className="admin-main-content">
        <div className="admin-container">

          <div className="admin-header">
            <h1>Registered Users</h1>
          </div>

          <div className="admin-card">
            {/* Search + count row */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
              <span style={{ color: '#64748b', fontSize: '14px' }}>
                {filtered.length} of {users.length} user{users.length !== 1 ? 's' : ''}
              </span>
              <input
                id="user-search"
                type="text"
                placeholder="Search by name or email…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  padding: '8px 14px',
                  background: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '6px',
                  color: '#f1f5f9',
                  fontSize: '14px',
                  outline: 'none',
                  width: '260px',
                }}
              />
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : filtered.length === 0 ? (
              <p style={{ color: '#64748b' }}>No users found.</p>
            ) : (
              <table className="submissions-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Username</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Score</th>
                    <th>Solved</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((u, idx) => (
                    <tr key={u.id}>
                      <td style={{ color: '#64748b' }}>{idx + 1}</td>
                      <td style={{ fontWeight: 600 }}>{u.username}</td>
                      <td style={{ color: '#94a3b8' }}>{u.email}</td>
                      <td>
                        <span
                          style={{
                            padding: '2px 10px',
                            borderRadius: '999px',
                            fontSize: '12px',
                            fontWeight: 700,
                            background:
                              u.role === 'admin'
                                ? 'rgba(245,9,9,0.12)'
                                : 'rgba(100,116,139,0.15)',
                            color: u.role === 'admin' ? '#f50909' : '#64748b',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                          }}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td>{u.score}</td>
                      <td>{u.solved_challenges?.length ?? 0}</td>
                      <td>
                        {u.role !== 'admin' ? (
                          <button
                            id={`remove-user-${u.id}`}
                            onClick={() => deleteUser(u.id, u.username)}
                            style={{
                              padding: '5px 14px',
                              background: '#ef4444',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '13px',
                            }}
                          >
                            Remove
                          </button>
                        ) : (
                          <span style={{ color: '#334155', fontSize: '12px' }}>Protected</span>
                        )}
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

export default UsersPage;

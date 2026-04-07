import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import AdminSidebar from '../Components/AdminSidebar';
import '../styles/admin.css';

const CreateChallenge = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    points: 100,
    flag: '',
    active: false,
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // 1. Create the challenge
      const createRes = await api.post('/admin/challenge', {
        title: formData.title,
        description: formData.description,
        points: parseInt(formData.points, 10),
        flag: formData.flag,
        active: formData.active
      });

      const challengeId = createRes.data.id;

      // 2. Upload file if exists
      if (file) {
        const fileData = new FormData();
        fileData.append('challenge_id', challengeId);
        fileData.append('file', file);

        await api.post('/admin/upload', fileData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      }

      navigate('/admin/dashboard');

    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create challenge.');
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
            <h1>Create Challenge</h1>
          </div>

      <div className="admin-card" style={{maxWidth: '600px', margin: '0 auto'}}>
        {error && <div style={{color: '#ef4444', marginBottom: '15px'}}>{error}</div>}
        
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Title</label>
            <input type="text" name="title" required value={formData.title} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea name="description" required value={formData.description} onChange={handleChange}></textarea>
          </div>

          <div className="form-group">
             <label>Points</label>
             <input type="number" name="points" required value={formData.points} onChange={handleChange} />
          </div>

          <div className="form-group">
             <label>Correct Flag</label>
             <input type="text" name="flag" required value={formData.flag} onChange={handleChange} placeholder="flag{...}" />
          </div>

           <div className="form-group">
             <label>Challenge File (optional)</label>
             <input type="file" onChange={handleFileChange} style={{background: 'transparent', border: 'none', padding: '0'}}/>
          </div>

          <div className="form-group" style={{flexDirection: 'row', alignItems: 'center', gap: '10px', display: 'flex'}}>
             <input type="checkbox" name="active" checked={formData.active} onChange={handleChange} style={{width: 'auto'}}/>
             <label style={{margin: 0}}>Set as Active</label>
          </div>

          <button type="submit" className="admin-btn" disabled={loading} style={{width: '100%', marginTop: '10px'}}>
            {loading ? 'Creating...' : 'Publish Challenge'}
          </button>
        </form>
      </div>
    </div>
    </main>
    </div>
  );
};

export default CreateChallenge;

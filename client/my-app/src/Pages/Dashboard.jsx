import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        bio: '',
        department: '',
        year: '',
        profile_picture: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/auth');
                return;
            }

            try {
                const res = await fetch('http://localhost:8000/api/users/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!res.ok) {
                    if (res.status === 401) {
                        localStorage.removeItem('token');
                        navigate('/auth');
                    }
                    throw new Error('Failed to fetch profile. Please log in again.');
                }

                const data = await res.json();
                setUser(data);
                setFormData({
                    name: data.name || '',
                    bio: data.bio || '',
                    department: data.department || '',
                    year: data.year || '',
                    profile_picture: data.profile_picture || '',
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [navigate]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        const token = localStorage.getItem('token');
        if (!token) return navigate('/auth');

        try {
            // Remove empty strings and build payload
            const payload = {};
            if (formData.name) payload.name = formData.name;
            if (formData.bio) payload.bio = formData.bio;
            if (formData.department) payload.department = formData.department;
            if (formData.year) payload.year = parseInt(formData.year, 10);
            if (formData.profile_picture) payload.profile_picture = formData.profile_picture;

            const res = await fetch('http://localhost:8000/api/users/me', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            const data = await res.json();

            if (!res.ok) {
                let errorMsg = data.detail || 'Failed to update profile';
                if (Array.isArray(data.detail)) {
                    errorMsg = data.detail.map(d => d.msg).join(', ');
                }
                throw new Error(errorMsg);
            }

            setUser(data);
            setSuccess('Profile updated successfully!');
            setEditing(false);

            // Dispatch event for Navbar to update profile picture
            window.dispatchEvent(new CustomEvent('profileUpdated'));
        } catch (err) {
            setError(err.message);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setError("Image limit is 5MB. Please choose a smaller file.");
                return;
            }

            const token = localStorage.getItem('token');
            const data = new FormData();
            data.append('file', file);

            try {
                const res = await fetch('http://localhost:8000/api/users/me/profile_picture', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: data
                });

                if (res.ok) {
                    const userData = await res.json();
                    setUser(userData);
                    setFormData(prev => ({ ...prev, profile_picture: userData.profile_picture }));
                    setSuccess('Profile picture updated successfully!');
                    window.dispatchEvent(new CustomEvent('profileUpdated'));
                } else {
                    const errorData = await res.json();
                    setError(errorData.detail || 'Failed to upload image.');
                }
            } catch (err) {
                setError('Failed to upload image.');
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/');
    };

    if (loading) {
        return (
            <section className="py-28 px-6 min-h-screen flex justify-center items-center" style={{ background: 'var(--gray-900)' }}>
                <div className="text-white text-xl">Loading profile...</div>
            </section>
        );
    }

    return (
        <section className="py-28 px-6 relative min-h-screen" style={{ background: 'var(--gray-900)' }}>
            <div className="noise-overlay" />
            <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 50%, rgba(0,168,255,0.07) 0%, transparent 65%)' }}
            />

            <div className="max-w-3xl mx-auto relative z-10 pt-16">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                    <div>
                        <p className="section-eyebrow mb-3">Members Dashboard</p>
                        <h2 className="font-extrabold text-4xl text-white">
                            Your <span style={{ color: 'var(--red)' }}>Profile</span>
                        </h2>
                        <div className="red-line mt-4" />
                    </div>
                    <button onClick={handleLogout} className="mt-4 md:mt-0 btn-ghost rounded-sm px-5 py-2 text-sm">
                        Log Out
                    </button>
                </div>

                {error && (
                    <div className="mb-6 p-4 rounded bg-red-900/30 text-red-500 border border-red-500/30">
                        {error}
                    </div>
                )}
                {success && (
                    <div className="mb-6 p-4 rounded bg-green-900/30 text-green-500 border border-green-500/30">
                        {success}
                    </div>
                )}

                <div className="card-dark rounded-lg p-8 border border-[var(--gray-700)]">
                    {!editing ? (
                        <div>
                            <div className="flex justify-between items-center mb-6 border-b border-[var(--gray-700)] pb-4">
                                <h3 className="text-xl font-bold text-white">Profile Details</h3>
                                <button onClick={() => setEditing(true)} className="text-[var(--red)] hover:text-red-400 transition-colors bg-transparent border-none cursor-pointer flex items-center gap-2 text-sm font-semibold">
                                    Edit Profile
                                </button>
                            </div>

                            <div className="flex items-center gap-8 mb-8">
                                <div className="w-24 h-24 rounded-full bg-[var(--gray-800)] overflow-hidden border-2 border-[var(--gray-700)] shadow-[0_0_15px_rgba(0,168,255,0.1)]">
                                    {user?.profile_picture ? (
                                        <img src={user.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-[var(--gray-500)] text-3xl font-bold">
                                            {user?.name ? user.name.charAt(0).toUpperCase() : '?'}
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-1">{user?.name}</h3>
                                    <p className="text-[var(--gray-400)] text-sm">{user?.email}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                <div className="md:col-span-2">
                                    <p className="text-[var(--gray-500)] uppercase tracking-wider text-xs mb-1">Bio</p>
                                    <p className="text-gray-300">{user?.bio || 'No bio provided yet.'}</p>
                                </div>
                                <div>
                                    <p className="text-[var(--gray-500)] uppercase tracking-wider text-xs mb-1">Department</p>
                                    <p className="text-gray-300">{user?.department || 'Not specified'}</p>
                                </div>
                                <div>
                                    <p className="text-[var(--gray-500)] uppercase tracking-wider text-xs mb-1">Year</p>
                                    <p className="text-gray-300">{user?.year || 'Not specified'}</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleUpdate} className="flex flex-col gap-5">
                            <div className="flex justify-between items-center mb-6 border-b border-[var(--gray-700)] pb-4">
                                <h3 className="text-xl font-bold text-white">Edit Profile</h3>
                                <button type="button" onClick={() => setEditing(false)} className="text-gray-400 hover:text-white transition-colors bg-transparent border-none cursor-pointer text-sm font-semibold">
                                    Cancel
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                {/* Profile Picture Upload */}
                                <div className="md:col-span-2 flex items-center gap-6 mb-2 py-4 border-b border-[var(--gray-800)]">
                                    <div className="w-20 h-20 rounded-full bg-[var(--gray-800)] overflow-hidden flex-shrink-0 border border-[var(--gray-700)]">
                                        {formData.profile_picture ? (
                                            <img src={formData.profile_picture} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[var(--gray-500)] text-2xl font-bold">
                                                {formData.name ? formData.name.charAt(0).toUpperCase() : '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                            Profile Picture
                                        </label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-xs file:font-semibold file:bg-[var(--red)] file:text-white hover:file:bg-red-700 cursor-pointer"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="input-dark w-full rounded-sm px-4 py-3 text-sm"
                                    />
                                </div>

                                {/* Email is generally read-only or requires separate verification */}
                                <div>
                                    <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                        Email (Read Only)
                                    </label>
                                    <input
                                        type="email"
                                        disabled
                                        value={user?.email || ''}
                                        className="input-dark w-full rounded-sm px-4 py-3 text-sm opacity-50 cursor-not-allowed"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                        Bio
                                    </label>
                                    <textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                        className="input-dark w-full rounded-sm px-4 py-3 text-sm min-h-[100px] resize-y"
                                        placeholder="Tell us about yourself..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                        Department
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.department}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        className="input-dark w-full rounded-sm px-4 py-3 text-sm"
                                        placeholder="Computer Science"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs text-[var(--gray-500)] uppercase tracking-wider mb-2">
                                        Year
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="6"
                                        value={formData.year}
                                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                        className="input-dark w-full rounded-sm px-4 py-3 text-sm"
                                        placeholder="1"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="btn-glow rounded-sm py-3.5 text-sm font-bold tracking-wider w-full mt-4"
                            >
                                SAVE CHANGES
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}

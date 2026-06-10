import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api/authApi';
import '../css/login.css'; // Import the new CSS
import { userRightService } from '../api/userRightService';

const Login = () => {
    const [credentials, setCredentials] = useState({ userName: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    // 1. Add this import at the top

    // ... inside the Login component ...

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const data = await loginUser(credentials);
            if (data.success) {
                // Save Token and User info
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // 2. NEW: Fetch User Rights immediately after login
                try {
                    // Assuming data.user contains the idUser
                    const rightsRes = await userRightService.getByDesignationId(data.user.idDesignation);
                    if (rightsRes.success) {
                        localStorage.setItem('userRights', JSON.stringify(rightsRes.data));
                    }
                } catch (rightsErr) {
                    console.error("Failed to fetch user rights", rightsErr);
                    // Even if rights fail, we still have the token/user, 
                    // but sidebar might be empty.
                }

                // 3. Finally, navigate
                window.location.href = '/dashboard';
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-logo">Q</div>
                <div className="login-header">
                    <h2> Certificate Store</h2>
                    <p>Sign in to your account to continue</p>
                </div>

                <form onSubmit={handleLogin}>
                    {error && <div className="error-msg">{error}</div>}

                    <div className="input-group">
                        <label>Username</label>
                        <input
                            type="text" name="userName" required
                            placeholder="Enter your username"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="input-group">
                        <label>Password</label>
                        <input
                            type="password" name="password" required
                            placeholder="••••••••"
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Sign In'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;

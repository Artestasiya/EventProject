import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../images/background.jpg';
import '../styles/LoginPage.css';
import { loginUser } from '../services/authService';  

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (email && password) {
            setLoading(true);
            try {
                const data = await loginUser(email, password); 

                if (data.token) {
                    localStorage.setItem('authToken', data.token);
                    localStorage.setItem('email', email);
                }

                if (data.role === false) {
                    navigate('/event');
                } else if (data.role === true) {
                    navigate('/admin');
                } else {
                    setError('Role not defined');
                }
            } catch (err) {
                setError(err.message || 'Server error. Please try again later.');
            } finally {
                setLoading(false);
            }
        } else {
            setError('Please fill in all fields');
        }
    };

    const handleRegister = () => {
        navigate('/register');
    };

    return (
        <div
            className="login-container"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="login-box">
                <h1>Login</h1>
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <button className="login-btn" onClick={handleLogin} disabled={loading}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
                <div className="register-link">
                    <span>Don't have an account?</span>
                    <a href="#" onClick={handleRegister}>
                        Register
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;

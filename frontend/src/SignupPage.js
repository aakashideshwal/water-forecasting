import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import './SignupPage.css';

function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        console.log("Attempting to sign up...");

        try {
            // Step 1: Attempt to sign up the user
            const signupResponse = await fetch('http://127.0.0.1:8000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            console.log("Signup response received:", signupResponse);
            if (!signupResponse.ok) {
                const errorData = await signupResponse.json();
                throw new Error(errorData.detail || 'Failed to sign up.');
            }

            console.log("Signup successful. Attempting to log in...");
            // Step 2: Automatically log the user in to get a token
            const loginFormData = new FormData();
            loginFormData.append('username', email);
            loginFormData.append('password', password);

            const loginResponse = await fetch('http://127.0.0.1:8000/login', {
                method: 'POST',
                body: loginFormData,
            });

            console.log("Login response received:", loginResponse);
            if (!loginResponse.ok) {
                throw new Error('Signed up successfully, but failed to log in.');
            }

            const tokenData = await loginResponse.json();
            auth.login(tokenData.access_token);
            
            console.log("Login successful. Navigating to /forecast...");
            navigate('/forecast');

        } catch (err) {
            console.error("Caught an error during signup/login process:", err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-panel auth-image-panel">
                <div className="image-panel-content">
                    <h1>WaterAI</h1>
                    <p>Harnessing AI to predict and protect future water needs.</p>
                </div>
            </div>
            <div className="auth-panel auth-form-panel">
                <div className="auth-container">
                    <h2>Create Account</h2>
                    <form onSubmit={handleSubmit} className="auth-form">
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn-primary" disabled={isLoading}>
                            {isLoading ? 'Signing Up...' : 'Sign Up'}
                        </button>
                    </form>
                    {error && <p className="error-message">{error}</p>}
                    <p className="auth-switch-link">
                        Already have an account? <Link to="/login">Log In</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignupPage;

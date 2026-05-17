import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser, registerUser } from '../features/userSlice';
import './Login.css';

const Login = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);

    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.userReducer);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isLogin) {
            dispatch(loginUser({ email, password, rememberMe }));
        } else {
            dispatch(registerUser({ email, password }));
        }
    };

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>{isLogin ? 'Login to TaskManager' : 'Register Account'}</h2>
                {error && <div className="error-message">{error}</div>}

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {isLogin && (
                    <div className="form-group checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                            style={{ width: 'auto' }}
                        />
                        <label htmlFor="rememberMe" style={{ margin: 0 }}>Remember Me</label>
                    </div>
                )}

                <button type="submit" disabled={loading}>
                    {loading ? 'Processing...' : (isLogin ? 'Login' : 'Register')}
                </button>

                <p onClick={() => setIsLogin(!isLogin)} className="toggle-auth">
                    {isLogin ? "Don't have an account? Register" : "Already have an account? Login"}
                </p>
            </form>
        </div>
    );
};

export default Login;

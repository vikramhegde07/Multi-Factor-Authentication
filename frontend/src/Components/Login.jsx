import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LoginForm = ({ logged, refresh }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mfaToken, setMfaToken] = useState('');
    const [isMFARequired, setIsMFARequired] = useState(false);

    const navigator = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const payload = { username, password };
            if (isMFARequired) {
                payload.mfaToken = mfaToken;
            }
            const response = await axios.post('http://localhost:5000/user/login', payload);
            localStorage.setItem('userToken', response.data.token);
            setIsMFARequired(false);
            refresh();
            navigator('/');
        } catch (error) {
            if (error.response?.data?.message === 'MFA token required') {
                setIsMFARequired(true);
            } else {
                setIsMFARequired(false);
            }
        }
    };

    useEffect(() => {
        if (logged)
            navigator('/');

    }, [])

    return (
        <div className='container p-4 bg-white' style={{ width: "350px" }}>
            <h2 className='text-center'>Login</h2>
            <hr />
            <form onSubmit={handleLogin}>
                <div className="mb-3">
                    <label htmlFor="username" className="form-label">Username</label>
                    <input
                        type="text"
                        id="Username"
                        className='form-control'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="Password" className="form-label">Password</label>
                    <input
                        type="password"
                        id="Password"
                        className='form-control'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {isMFARequired && (
                    <div className="mb-3">
                        <label htmlFor="code" className="form-label">Authenticator Code</label>
                        <input
                            type="text"
                            id="code"
                            value={mfaToken}
                            className='form-control'
                            onChange={(e) => setMfaToken(e.target.value)}
                            required
                        />
                    </div>
                )}
                <div className="d-flex justify-content-center">
                    <button type="submit" className='btn btn-primary px-4 rounded-0'>Login</button>
                </div>
            </form>
        </div>
    );
};

export default LoginForm;
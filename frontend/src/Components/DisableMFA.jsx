import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const DisableMFA = ({ refresh }) => {
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const navigator = useNavigate();

    const handleDisableMFA = async () => {
        try {
            const token = localStorage.getItem('userToken')
            const response = await axios.post('http://localhost:5000/user/disable-mfa', { password }, {
                headers: {
                    Authorization: token
                }
            });
            setMessage(response.data.message);
            refresh();
            navigator('/');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to disable MFA');
        }
    };

    return (
        <div className='d-flex flex-column gap-2'>
            <h2 className='fs-4'>Disable Multi-Factor Authentication</h2>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Enter your password to confirm</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    className='form-control'
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="d-flex justify-content-center">
                <button
                    onClick={handleDisableMFA}
                    disabled={!password}
                    className='btn btn-danger px-4 rounded-0'
                >Disable MFA</button>
            </div>
            {message && <p>{message}</p>}
        </div>
    );
};

export default DisableMFA;
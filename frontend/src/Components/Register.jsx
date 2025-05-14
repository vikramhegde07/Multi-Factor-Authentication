import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = ({ logged }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const navigator = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/user/register', { username, password });
            navigator('/login');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Registration failed');
        }
    };

    useEffect(() => {
        if (logged)
            navigator('/');
    }, [])

    return (
        <div className='container p-4 bg-white' style={{ width: "350px" }}>
            <h2 className='text-center'>Register</h2>
            <hr />
            <form onSubmit={handleRegister}>
                <div className='mb-3'>
                    <label htmlFor="username" className='form-label'>Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className='form-control'
                        required
                    />
                </div>
                <div className='mb-3'>
                    <label htmlFor="password" className='form-label'>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className='form-control'
                        required
                    />
                </div>
                <div className="d-flex justify-content-center">
                    <button className='btn btn-primary px-4 rounded-0' type="submit">Register</button>
                </div>
            </form>
        </div>
    );
};

export default RegisterForm;
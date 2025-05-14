import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const EnableMFA = ({ userId }) => {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [secret, setSecret] = useState('');
    const [password, setPassword] = useState(''); // For re-verification
    const [message, setMessage] = useState('');

    const handleEnableMFA = async () => {
        try {
            const token = localStorage.getItem('userToken');
            const response = await axios.post('http://localhost:5000/user/enable-mfa', { password }, {
                headers: {
                    Authorization: token
                }
            });
            setQrCodeUrl(response.data.qrCodeUrl);
            setSecret(response.data.secret);
            setPassword('');
            setMessage('Scan the QR code with your authenticator app.');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Failed to enable MFA');
        }
    };

    return (
        <div className='d-flex flex-column gap-2'>
            <h2 className='fs-4'>Enable Multi-Factor Authentication</h2>
            <div className="mb-3">
                <label htmlFor="password" className="form-label">Enter your password to confirm</label>
                <input
                    type="password"
                    id="password"
                    className='form-control'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>
            <div className="d-flex justify-content-center">
                <button
                    onClick={handleEnableMFA}
                    disabled={!password}
                    className='btn btn-primary px-4 rounded-0'
                >Enable MFA</button>
            </div>

            {qrCodeUrl && (
                <div>
                    <p className='fs-5'>{message}</p>
                    <div className="d-flex justify-content-center">
                        <QRCodeSVG value={secret ? `otpauth://totp/vikramApp:${userId}?secret=${secret}&issuer=vikramApp` : ''} size={256} level="H" />
                    </div>
                    {/* Alternatively, use the data URL: */}
                    {/* <img src={qrCodeUrl} alt="QR Code" /> */}
                    <p className='mt-2'>Save the secret key: {secret}</p>
                    <p>Open your authenticator app and scan the QR code.</p>
                    {/* You might want to add a step to verify the setup here */}
                </div>
            )}
            {message && !qrCodeUrl && <p>{message}</p>}

            <div className="d-flex justify-content-center">
                <Link to={'/'} className="btn btn-primary px-4 rounded-0">Go to Home</Link>
            </div>
        </div>
    );
};

export default EnableMFA;
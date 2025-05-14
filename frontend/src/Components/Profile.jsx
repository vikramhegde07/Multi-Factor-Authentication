import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import EnableMFA from './EnableMFA';
import DisableMFA from './DisableMFA';

function Profile({ logged }) {
    const [userData, setUserData] = useState();
    const [mfa, setmfa] = useState(false);
    const navigator = useNavigate();

    function fetchUserData() {
        axios
            .get('http://localhost:5000/user', {
                headers: {
                    Authorization: localStorage.getItem('userToken')
                }
            })
            .then((response) => {
                setUserData(response.data);
                if (response.data.isMFAEnabled === true)
                    setmfa(true);
            })
            .catch((error) => {
                console.log(error);
            })
    }

    useEffect(() => {
        if (!logged)
            navigator('/');
        else
            fetchUserData();
    }, [logged])
    return (
        <div className='container p-4 bg-white' style={{ width: "550px" }}>
            <h1 className="text-center fs-2">Example of MFA</h1>
            <hr />
            <p className="fs-5">Username(or email) : {userData ? userData.username : ''}</p>
            <p className='fs-5'>MFA Status : {userData ? mfa ? 'Enabled' : 'Disbled' : ''}</p>
            <hr />
            {!mfa ? <EnableMFA /> : <DisableMFA refresh={checkLogin} />}
        </div>
    )
}

export default Profile

import React from 'react';
import { Link } from 'react-router-dom';

function Home({ logged, refresh }) {

    function handleLogout() {
        localStorage.removeItem('userToken');
        refresh();
    }
    return (
        <div className='container bg-white p-5'>
            <h1 className="text-center fs-2">Hello Coder</h1>
            <p className="text-center fs-5">
                This is a demo of creating a 2FA (2-Factor-Authentication) in MERN stack.
                <br />
                Hope You can grasp the coding technique.
            </p>
            <hr />
            {logged ? (
                <>
                    <p className="text-center">The user login is done now check out the profile page to enable / disable the 2FA</p>
                    <div className="d-flex justify-content-center">
                        <Link to={'/profile'} className="btn btn-primary px-4 rounded-0">Go to Profile</Link>
                    </div>
                    <p className="text-center my-3">OR</p>
                    <p className="text-center">If the 2FA enabled check how the auth works</p>
                    <div className="d-flex justify-content-center">
                        <button type='button' className="btn btn-danger px-4 rounded-0" onClick={handleLogout}>Logout</button>
                    </div>
                </>
            ) : (
                <>
                    <p className="text-center">There is no user token stored in localStorage login / register to start with 2FA.</p>
                    <div className="d-flex gap-3 justify-content-center">
                        <Link to={'/login'} className="btn btn-primary px-4 rounded-0">Login</Link>
                        <Link to={'/register'} className="btn btn-primary px-4 rounded-0">Register</Link>
                    </div>
                </>
            )}
        </div>
    )
}

export default Home

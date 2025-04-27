import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Registration.css"



const Register = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confPasswd, setconfPasswd] = useState('');
    const navigate = useNavigate();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        const responseHandler = {
            status: 0,
            message: 'Nil'
        }
        let responseTmp = ''

        try {

            console.log("\nRegistration form data => ", { username, password, confPasswd })

            const response = await axios.post('http://localhost:8000/api/register', {
                user_name: username,
                password,
                confirm_password: confPasswd
            });

            responseHandler.status = response.status
            responseTmp = response.data.message

            if (response.status === 200) {
                console.log('Registration successful');
                alert("Registration successful")
                navigate('/login');
            } else {
                responseHandler.message = response.data
            }
        } catch (error) {
            console.error('Registration failed =>', responseHandler.status);
            alert("Username taken or Password and Conform does not match")
        }
    };

    return (
        <div className="mainContainer">
            <form className="reg-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                <div className='input-field'>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>

                <div className='input-field'>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <div className='input-field'>
                    <input
                        type="password"
                        placeholder="Conform Password"
                        value={confPasswd}
                        onChange={(e) => setconfPasswd(e.target.value)}
                        required
                    />
                </div>

                <div className='button-section'>
                    <div className='submit-button'>
                        <button type="submit">Register</button>
                    </div>

                    <div className='submit-button'>
                        <button onClick={() => { navigate('/login') }}>Login</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Register;


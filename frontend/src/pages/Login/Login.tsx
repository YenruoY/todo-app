import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./Login.css"


const Login = () => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await axios.post('http://localhost:8000/api/login', {
                user_name: username,
                password,
            });

            if (response.status === 200) {
                const { access_token } = response.data;
                console.log('\nLogin successful\n Acces token =>', access_token);

                localStorage.setItem('token', access_token);
                localStorage.setItem('username', username);
                alert('Login successful')

                navigate('/home');
            }
        } catch (error) {
            console.error('Login failed:', error);
            alert('Invalid credentials');
        }
    };

    return (
        <div className="mainContainer">
            <form className="login-form" onSubmit={handleLogin}>
                <h2>Login</h2>
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

                <div className='button-section'>
                    <div className='submit-button'>
                        <button type="submit">Login</button>
                    </div>

                    <div className='submit-button'>
                        <button onClick={() => { navigate('/register') }}>Register</button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default Login;

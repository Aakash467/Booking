import React, { useContext } from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { UserContext } from '../UserContext';

export default function LoginPage() {
  const [email,setEmail] = useState('');
  const [password,setPassword] = useState('');
  const navigate = useNavigate();
  const {setUser} = useContext(UserContext);

  async function handleLogin(e){
    e.preventDefault();
    
    try{
      const {data} = await axios.post('/login',{email,password},{withCredentials: true});
      console.log('Loged in',data);
      setUser(data);
      navigate('/');
    }catch(e){
      console.log('Login Failed',e);
    }
    
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center w-full max-w-md mb-36 p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800">Login</h1>
        <form className="flex flex-col w-full space-y-4" onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="your@email.com" value={email} onChange={(e)=>setEmail(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="w-full px-4 py-2 text-white bg-primary rounded ">
            Login
          </button>
          <div>
            Don't have an account?
            <Link to={'/register'} className='text-primary'> Register</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

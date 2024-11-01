import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios';

export default function RegisterPage() {
  const [name,setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  async function registerUser(e){
    e.preventDefault();
    try{
      await axios.post('/register',{
        name,
        email,
        password
      });
      alert('Registration successful');
    }catch{
      alert('Registration failed');
    }
    
  }
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center w-full max-w-md mb-36 p-8 space-y-6 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-bold text-center text-gray-800">Register</h1>
        <form className="flex flex-col w-full space-y-4" onSubmit={registerUser}>
          <input
            type="text"
            placeholder="username" value={name} onChange={e=>setName(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="email"
            placeholder="your@email.com" value={email} onChange={e=>setEmail(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="password"
            placeholder="password" value={password} onChange={e=>setPassword(e.target.value)}
            className="w-full px-4 py-2 text-gray-700 bg-gray-200 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button className="w-full px-4 py-2 text-white bg-primary rounded ">
            Register
          </button>
          <div>
            Already a member?
            <Link to={'/login'} className='text-primary'> Login</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

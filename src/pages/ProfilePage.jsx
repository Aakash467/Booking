import React, { useContext ,useState} from 'react'
import { UserContext } from '../UserContext'
import { Link, Navigate, useParams } from 'react-router-dom';
import axios from 'axios';
import PlacesPage from './PlacesPage';
import AccountNav from './AccountNav';

export default function ProfilePage() {
    const {user, setUser} = useContext(UserContext);
    const {subpage} = useParams();
    const [redir , setRedir] = useState(null);

    if(!user){
        return <Navigate to={'/login'}/>
    }

    

    async function logout(){
        await axios.post('/logout').then(()=>{
            setUser(null);
            localStorage.removeItem('user');
        })
        setRedir('/');
    }

    if(redir){
        return <Navigate to={redir}/>
    }
  return (
    <div>
        <AccountNav />
        { subpage === undefined && (
            <div className="text-center max-w-lg mx-auto mt-10 p-6 bg-gray-100 rounded-lg shadow-lg">
            <p className="text-lg font-semibold text-gray-800 mb-4">
                Logged in as <span className="text-primary font-bold">{user.name}</span> ({user.email})
            </p>
            <button onClick={logout} className="bg-primary text-white font-medium rounded-full px-5 py-2 transition-colors duration-200 ease-in-out hover:bg-primary-dark hover:shadow-md">
                Log Out
            </button>
            </div>
        )}
        { subpage === 'places' && (
            <PlacesPage />
        )}
    </div>
  )
}

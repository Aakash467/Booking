import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

import AccountNav from './AccountNav';
import axios from 'axios';

export default function PlacesPage() {
  const [places, setPlaces] = useState([])

  useEffect(()=>{
    axios.get('/user-places',{withCredentials:true}).then(({data})=>{
      setPlaces(data);
    });
  },[]);

  return (
    
    <div>
      <AccountNav/>
      
        <div className='text-center mt-10'>
          <Link className='bg-primary text-white py-2 px-6 inline-flex gap-1 rounded-full' to={'/account/places/new'}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
              <path fill-rule="evenodd" d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z" clip-rule="evenodd" />
            </svg>
          Add new place
          </Link>
        </div>
        <div className='flex justify-around flex-col items-center mt-4'>
            {places.length > 0 && places.map(place => (
            <Link
              to={`/account/places/${place._id}`}
              className="flex w-2/3 bg-gray-100 shadow-md rounded-lg overflow-hidden mb-4 "
            >
              <div className="w-32 h-32 flex-shrink-0 overflow-hidden">
                {place.photos.length > 0 ? (
                  <img src={'http://localhost:4000/uploads/'+place.photos[0]} alt={place.title} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
                    No Image
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col justify-between">
                <h3 className="text-lg font-semibold text-gray-800">{place.title}</h3>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{place.description}</p>
              </div>
            </Link>
          ))}

        </div>
      
    </div>
  )
}

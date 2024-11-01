import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function IndexPage() {
  const [places, setPlaces] = useState([]);

  useEffect(() => {
    axios.get('/places').then(response => {
      setPlaces(response.data);
    });
  }, []);

  return (
    <div className="p-6 mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {places.length > 0 && places.map(place => (
        <Link to={'/places/'+place._id} key={place._id} className="bg-white shadow-lg rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
          {place.photos?.[0] && (
            <img
              src={'http://localhost:4000/uploads/' + place.photos[0]}
              alt={place.name}
              className="w-full h-48 object-cover"
            />
          )}
          <div className="p-4">
            <h2 className="text-xl font-semibold text-gray-800">{place.title}</h2>
            <h3 className="text-gray-600">{place.address}</h3>
            <div className="mt-2 text-lg text-gray-900">
              ${place.price} <span className="text-sm text-gray-500">per night</span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}

import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { differenceInCalendarDays } from 'date-fns';
import { UserContext } from '../UserContext';

export default function PlacePage() {
  const { id } = useParams();
  const [place, setPlace] = useState([]);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [nofGuest, setNofGuest] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [redirect, setRedirect] = useState('');
  const {user} = useContext(UserContext);

  useEffect(() => {
    if (!id) return;
    axios.get(`/places/${id}`).then((response) => setPlace(response.data));
  }, [id]);

  let nofDays = 0;
  if (checkIn && checkOut) {
    nofDays = Math.abs(differenceInCalendarDays(new Date(checkIn), new Date(checkOut)));
  }

  async function bookThisPlace() {
    try {
      const info = {
        place: place._id,
        checkIn,
        checkOut,
        name,
        phone,
        nofGuest,
        price: nofDays * place.price,
      };

      const response = await axios.post('/booking', info, {withCredentials:true});

      if (response.data && response.data._id) {
        const bookingId = response.data._id;
        setRedirect(`/account/bookings/${bookingId}`);
      } else {
        console.error("No booking ID returned from the server.");
      }
    } catch (error) {
      console.error("Error booking the place:", error);
    }
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  if (showAllPhotos) {
    return (
      <div className="fixed inset-0 bg-white z-10 overflow-y-auto p-8">
        <h1 className="text-xl font-semibold mb-4">Photos of {place.title}</h1>
        <button
          onClick={() => setShowAllPhotos(false)}
          className="fixed top-4 right-4 bg-black text-white py-2 px-4 rounded-full"
        >
          Close Photos
        </button>
        <div className="grid grid-cols-2 gap-4 mt-6">
          {place?.photos?.map((photo, index) => (
            <img key={index} src={`http://localhost:4000/uploads/${photo}`} className="w-full rounded-lg shadow-md" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-4 bg-gray-100 px-8 py-8">
      <h1 className="text-3xl font-semibold mb-2">{place.title}</h1>
      <a
        href={`https://maps.google.com/?q=${place.address}`}
        target="_blank"
        rel="noopener noreferrer"
        className="block text-blue-600 font-medium underline mb-4"
      >
        {place.address}
      </a>
      <div className="relative mb-6">
        <div className="grid gap-2 grid-cols-[2fr_1fr]">
          {place.photos?.[0] && <img src={`http://localhost:4000/uploads/${place.photos[0]}`} className="w-full h-full object-cover rounded-l-lg" />}
          <div className="grid grid-rows-2 gap-2">
            {place.photos?.[1] && <img src={`http://localhost:4000/uploads/${place.photos[1]}`} className="w-full h-full object-cover rounded-tr-lg" />}
            {place.photos?.[2] && <img src={`http://localhost:4000/uploads/${place.photos[2]}`} className="w-full h-full object-cover rounded-br-lg" />}
          </div>
        </div>
        <button
          onClick={() => setShowAllPhotos(true)}
          className="absolute bottom-2 right-2 bg-white text-black py-2 px-4 rounded-full shadow-md hover:bg-gray-200 transition"
        >
          Show more photos
        </button>
      </div>
      <div className="my-4">
        <h2 className="text-xl font-semibold mb-2">Description</h2>
        <p className="text-gray-700 leading-relaxed">{place.description}</p>
      </div>
      <div className="grid grid-cols-2 gap-8 mt-6">
        <div>
          <h3 className="text-lg font-semibold mb-1">Details</h3>
          <p>Check-in: {place.checkIn}</p>
          <p>Check-out: {place.checkOut}</p>
          <p>Max Guests: {place.maxGuests}</p>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">Extra Information</h3>
          <p className="text-gray-600">{place.extraInfo}</p>
        </div>
        <div className="col-span-2 bg-white p-6 rounded-2xl shadow-md mt-4">
          <div className="text-center text-2xl font-semibold mb-4">
            Price: ${place.price} / per night
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="border p-4 rounded-lg">
              <label className="block mb-1 text-gray-700 font-medium">Check-in</label>
              <input type="date" value={checkIn} onChange={e => setCheckIn(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            <div className="border p-4 rounded-lg">
              <label className="block mb-1 text-gray-700 font-medium">Check-out</label>
              <input type="date" value={checkOut} onChange={e => setCheckOut(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            <div className="col-span-2 border p-4 rounded-lg">
              <label className="block mb-1 text-gray-700 font-medium">Number of Guests</label>
              <input type="number" value={nofGuest} onChange={e => setNofGuest(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            <div className="border p-4 rounded-lg">
              <label className="block mb-1 text-gray-700 font-medium">Your full name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
            <div className="border p-4 rounded-lg">
              <label className="block mb-1 text-gray-700 font-medium">Phone number</label>
              <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2" />
            </div>
          </div>
          <button onClick={bookThisPlace} className="w-full mt-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-blue-700 transition">
            Book this place
            {nofDays > 0 && (
              <span> for ${nofDays * place.price}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

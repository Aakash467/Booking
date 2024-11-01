import React, { useEffect, useState } from 'react';
import AccountNav from './AccountNav';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function BookingsPage() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        axios.get('/bookings', { withCredentials: true }).then((response) => {
            setBookings(response.data);
        });
    }, []);

    return (
        <>
        <AccountNav />
        <div className="p-8 mt-6  ">
            
            <div className="grid gap-6">
                {bookings?.length > 0 && bookings.map((booking) => (
                    <Link to={`/account/bookings/${booking._id}`}
                        key={booking._id} 
                        className="bg-gray-100 rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row p-6"
                    >
                        {booking.place.photos?.[0] && (
                            <img 
                                src={`http://localhost:4000/uploads/${booking.place.photos[0]}`} 
                                alt={`${booking.place.title} photo`} 
                                className="w-full md:w-1/3 h-48 object-cover rounded-lg"
                            />
                        )}
                        <div className="flex-1 p-4">
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {booking.place.title}
                            </h2>
                            <p className="text-gray-600">
                                <span className="font-medium">Address:</span> {booking.place.address}
                            </p>
                            <p className="text-gray-600 mb-2">
                                <span className="font-medium">Booking Dates:</span> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Guests:</span> {booking.nofGuest}
                            </p>
                            <p className="text-gray-800 text-lg font-bold mt-4">
                                Total Price: ${booking.price}
                            </p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
        </>
    );
}

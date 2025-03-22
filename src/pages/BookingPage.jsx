import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function BookingPage() {
    const { id } = useParams();
    const [booking, setBooking] = useState(null);

    useEffect(() => {
        if (id) {
            axios.get(`/bookings/${id}`, { withCredentials: true }).then((response) => {
                setBooking(response.data);
            }).catch((error) => {
                console.error("Error fetching booking:", error);
            });
        }
    }, [id]);

    if (!booking) {
        return <div>Loading...</div>;  // Display a loading message while data is being fetched
    }

    return (
        <div className="mt-4 bg-gray-100 px-8 py-8 rounded-xl">
            <h1 className="text-3xl font-semibold mb-2">{booking.place.title}</h1>
            <a
                href={`https://maps.google.com/?q=${booking.place.address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-blue-600 font-medium underline mb-4"
            >
                {booking.place.address}
            </a>
            <p className="text-gray-600 mb-2">
                                <span className="font-medium">Booking Dates:</span> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}
                            </p>
                            <p className="text-gray-600">
                                <span className="font-medium">Guests:</span> {booking.nofGuest}
                            </p>
                            <p className="text-gray-800 text-lg font-bold mt-4">
                                Total Price: ${booking.price}
                            </p>
            <div className="relative mb-6">
                <div className="grid gap-2 grid-cols-[2fr_1fr]">
                    {booking.place.photos?.[0] && (
                        <img
                            src={`http://localhost:4000/uploads/${booking.place.photos[0]}`}
                            className="w-full h-full object-cover rounded-l-lg"
                            alt={`${booking.place.title} photo 1`}
                        />
                    )}
                    <div className="grid grid-rows-2 gap-2">
                        {booking.place.photos?.[1] && (
                            <img
                                src={`http://localhost:4000/uploads/${booking.place.photos[1]}`}
                                className="w-full h-full object-cover rounded-tr-lg"
                                alt={`${booking.place.title} photo 2`}
                            />
                        )}
                        {booking.place.photos?.[2] && (
                            <img
                                src={`http://localhost:4000/uploads/${booking.place.photos[2]}`}
                                className="w-full h-full object-cover rounded-br-lg"
                                alt={`${booking.place.title} photo 3`}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext({});

export function UserContextProvider({ children }) {
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    useEffect(() => {
       
        if (!user) {
            axios.get('/profile', { withCredentials: true })
                .then(({ data }) => {
                    setUser(data);
                
                    localStorage.setItem('user', JSON.stringify(data));
                })
                .catch(error => {
                    console.error('Error fetching profile:', error);
                });
        }
    }, []);

    useEffect(() => {
       
        if (user) {
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('user'); 
        }
    }, [user]);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

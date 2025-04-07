import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { getBabysitterBookings } from './api/api';

interface Booking {
  _id: string;
  familyName: string;
  date: string;
  time: string;
  numberOfChildren: number;
  address: string;
  status: string;
  rating?: number;
  review?: string;
  specialInstructions?: string;
}

interface Review {
  _id: string;
  momName: string;
  rating: number;
  reviewText: string;
  createdAt: string;
  profilePicture?: string;
  question1: string;
  question2: string;
  question3: string;
}

interface BabysitterDataContextType {
  bookings: Booking[];
  reviews: Review[];
  loading: boolean;
  refreshBookings: () => Promise<void>;
  refreshReviews: () => Promise<void>;
}

const BabysitterDataContext = createContext<BabysitterDataContextType>({
  bookings: [],
  reviews: [],
  loading: true,
  refreshBookings: async () => {},
  refreshReviews: async () => {},
});

export const BabysitterDataProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const babysitterId = '65a1b2c3d4e5f67890123457'; // Replace with actual babysitter ID
      const response = await getBabysitterBookings(babysitterId);
      setBookings(response);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/reviews');
      setReviews(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const refreshAll = async () => {
    setLoading(true);
    await Promise.all([fetchBookings(), fetchReviews()]);
    setLoading(false);
  };

  useEffect(() => {
    refreshAll();
  }, []);

  return (
    <BabysitterDataContext.Provider 
      value={{
        bookings,
        reviews,
        loading,
        refreshBookings: fetchBookings,
        refreshReviews: fetchReviews,
      }}
    >
      {children}
    </BabysitterDataContext.Provider>
  );
};

export const useBabysitterData = () => useContext(BabysitterDataContext);
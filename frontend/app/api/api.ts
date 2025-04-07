
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/bookings';

// Book a babysitter
// Book a babysitter with additional details
export const bookBabysitter = async (
  momId: string, 
  babysitterId: string, 
  date: string, 
  time: string,
  familyName: string,
  numberOfChildren: number,
  address: string,
  specialInstructions?: string
) => {
  try {
    console.log('Sending booking request:', {
      momId, babysitterId, date, time, 
      familyName, numberOfChildren, address, specialInstructions
  });
      const response = await fetch('http://localhost:5000/api/bookings/book', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
              momId, 
              babysitterId, 
              date, 
              time,
              familyName,
              numberOfChildren,
              address,
              specialInstructions
          })
      });

      const data = await response.json();
      if (!response.ok) 
        console.error('Booking failed:', data);
        throw new Error(data.message);
    
      console.log("Booking Successful:", data);
      return data;
  } catch (error) {
      console.error("API Error:", error.message);
      throw error;
  }
};

// Add rating and review
export const rateBooking = async (bookingId: string, rating: number, review: string) => {
  try {
      const response = await fetch(`http://localhost:5000/api/bookings/rate/${bookingId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rating, review })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      return data;
  } catch (error) {
      console.error("API Error:", error.message);
      throw error;
  }
};



// Get babysitter's booking requests
export const getBabysitterBookings = async (babysitterId: string) => {
    try {
        console.log("Fetching bookings for babysitter:", babysitterId); // Debug Log

        const response = await fetch(`http://localhost:5000/api/bookings/babysitter/${babysitterId}`);

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        console.log("Bookings fetched:", data);
        return data;
    } catch (error) {
        console.error("API Error:", error.message);
        throw error;
    }
};


// Accept or reject booking
export const updateBookingStatus = async (bookingId: string, status: string) => {
    return await axios.put(`${API_URL}/update/${bookingId}`, { status });
};

export default { bookBabysitter, getBabysitterBookings, updateBookingStatus };
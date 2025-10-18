import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaUserCircle, FaSignOutAlt, FaCalendarAlt, FaCity, FaMapMarkerAlt, FaTools, FaCheckCircle, FaHourglassHalf, FaRegCircle, FaRegDotCircle } from 'react-icons/fa';
import { FaPhoneVolume } from 'react-icons/fa6';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc, updateDoc, collection, query, where, getDocs } from 'firebase/firestore';

const getStatusIcon = (status) => {
  switch (status) {
    case 'Approved':
      return <FaCheckCircle style={{ color: '#28a745' }} />;
    case 'Pending':
      return <FaHourglassHalf style={{ color: '#ffc107' }} />;
    case 'Done':
      return <FaRegCircle style={{ color: '#007bff' }} />;
    case 'Delayed':
      return <FaRegDotCircle style={{ color: '#dc3545' }} />;
    default:
      return null;
  }
};

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
  });
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser;
      if (!user) {
        navigate('/login');
        return;
      }

      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        setUserData(userSnap.data());
      }

      const bookingsRef = collection(db, 'bookings');
      const q = query(bookingsRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsData);

      setLoading(false);
    };

    fetchData();
  }, [navigate]);

  const handleChange = async (e) => {
    const { name, value } = e.target;
    const updatedData = { ...userData, [name]: value };
    setUserData(updatedData);

    const user = auth.currentUser;
    if (user) {
      await updateDoc(doc(db, 'users', user.uid), {
        [name]: value,
      });
    }
  };

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  if (loading) return <LoadingMessage>Loading Profile...</LoadingMessage>;

  return (
    <Container>
      <ProfileHeader>
        <ProfileIcon />
        <ProfileTitle>Welcome, {userData.name || 'User'}!</ProfileTitle>
        <p>Manage your profile and track your bookings.</p>
      </ProfileHeader>

     

      <BookingSection>
        <SectionTitle>Your Bookings</SectionTitle>
        {bookings.length === 0 ? (
          <NoBookingsMessage>
            You have no active bookings. Start by booking a service!
          </NoBookingsMessage>
        ) : (
          <BookingsGrid>
            {bookings.map((booking) => (
              <BookingCard key={booking.id} status={booking.status}>
                <BookingHeader>
                  <StatusIcon>{getStatusIcon(booking.status)}</StatusIcon>
                  <StatusText status={booking.status}>{booking.status || 'Pending'}</StatusText>
                </BookingHeader>
                <BookingInfo>
                  <p><FaCalendarAlt /> <strong>Date:</strong> {booking.date}</p>
                  <p><FaCity /> <strong>City:</strong> {booking.city}</p>
                  <p><FaMapMarkerAlt /> <strong>Area:</strong> {booking.area}</p>
                  <p><FaTools /> <strong>Services:</strong> {booking.services?.join(', ')}</p>
                </BookingInfo>
                {booking.assignedProviderName && (
                  <AssignedProviderInfo>
                    <h4>Provider Assigned</h4>
                    <p><strong>Name:</strong> {booking.assignedProviderName}</p>
                    <p><strong>Phone:</strong> {booking.assignedProviderPhone}</p>
                  </AssignedProviderInfo>
                )}
              </BookingCard>
            ))}
          </BookingsGrid>
        )}
      </BookingSection>
    </Container>
  );
};

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  max-width: 900px;
  margin: 3rem auto;
  padding: 2rem;
  background-color: #F0F2F5; /* Light grey background */
  min-height: 100vh;
  font-family: 'Inter', sans-serif;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileIcon = styled(FaUserCircle)`
  font-size: 5rem;
  color: #1F61B8; /* Brand blue */
`;

const ProfileTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #333;
  margin-top: 1rem;
`;

const ProfileSection = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 2rem;
  animation: ${fadeIn} 0.5s ease-out;
`;

const SectionTitle = styled.h3`
  font-size: 1.8rem;
  font-weight: 700;
  color: #1F61B8;
  margin-bottom: 1.5rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: #FF6B00; /* Accent orange */
    border-radius: 2px;
  }
`;

const ProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  label {
    font-weight: 600;
    color: #555;
  }
`;

const ProfileInput = styled.input`
  padding: 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid #ddd;
  background-color: #F8F9FA;
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #1F61B8;
    box-shadow: 0 0 0 3px rgba(31, 97, 184, 0.2);
  }
`;

const LogoutButton = styled.button`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: #dc3545; /* Red for danger/logout */
  color: #fff;
  font-size: 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:hover {
    background-color: #c82333;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

const BookingSection = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  animation: ${fadeIn} 0.5s ease-out;
`;

const BookingsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
`;

const BookingCard = styled.div`
  background-color: #F8F9FA;
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  border-left: 5px solid ${({ status }) => {
    switch (status) {
      case 'Approved': return '#28a745';
      case 'Done': return '#007bff';
      case 'Delayed': return '#dc3545';
      default: return '#ffc107';
    }
  }};
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
  }
`;

const BookingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  margin-bottom: 1rem;
`;

const StatusIcon = styled.div`
  font-size: 1.5rem;
`;

const StatusText = styled.p`
  font-weight: bold;
  font-size: 1.1rem;
  color: ${({ status }) => {
    switch (status) {
      case 'Approved': return '#28a745';
      case 'Done': return '#007bff';
      case 'Delayed': return '#dc3545';
      default: return '#ffc107';
    }
  }};
  margin: 0;
`;

const BookingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  p {
    margin: 0;
    font-size: 0.95rem;
    display: flex;
    align-items: center;
    gap: 0.6rem;
  }

  strong {
    font-weight: 600;
  }
`;

const AssignedProviderInfo = styled.div`
  background-color: #e9ecef;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  
  h4 {
    margin: 0 0 0.5rem;
    font-size: 1rem;
    color: #333;
  }
  
  p {
    margin: 0;
    font-size: 0.9rem;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #666;
  margin-top: 5rem;
`;

const NoBookingsMessage = styled.p`
  text-align: center;
  color: #888;
  padding: 2rem;
  border: 2px dashed #ddd;
  border-radius: 15px;
  margin-top: 1.5rem;
`;

export default Profile;
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaSignOutAlt, FaUserShield, FaRegCalendarCheck, FaCheckCircle, FaTimesCircle, FaTools, FaFilter } from 'react-icons/fa';
import { FaArrowsRotate, FaArrowRightFromBracket, FaPhoneVolume, FaCalendarDays, FaUser, FaLocationDot } from 'react-icons/fa6';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, orderBy, doc, deleteDoc, updateDoc, setDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

// Keyframes for animations
const spin = keyframes`
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
`;

const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

// Helper functions for dynamic colors
const getStatusColor = (status) => {
  switch (status) {
    case 'Approved':
    case 'Active':
      return '#0f9960'; // Brighter green
    case 'Pending':
      return '#d97706'; // Vibrant orange
    case 'Done':
      return '#1d4ed8'; // Royal blue
    case 'Delayed':
    case 'Rejected':
      return '#e03e2c'; // Muted red
    default:
      return '#6b7280'; // Gray
  }
};

const getStatusBgColor = (status) => {
  switch (status) {
    case 'Approved':
    case 'Active':
      return '#d1fae5'; // Light green
    case 'Pending':
      return '#fef3c7'; // Light orange
    case 'Done':
      return '#dbeafe'; // Light blue
    case 'Delayed':
    case 'Rejected':
      return '#fee2e2'; // Light red
    default:
      return '#e5e7eb'; // Light gray
  }
};

const FaToolsIcon = styled(FaTools)`
  font-size: 1.2em;
  margin-right: 0.5rem;
`;

// Styled Components
const Container = styled.div`
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  background-color: #F8FAFC;
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  animation: ${slideIn} 0.5s ease-out;
`;

const HeaderTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 800;
  color: #1E40AF;
  margin: 0;
`;

const LogoutButton = styled.button`
  background-color: #EF4444;
  color: #fff;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  box-shadow: 0 4px 15px rgba(239, 68, 68, 0.2);
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  &:hover {
    background-color: #DC2626;
    transform: translateY(-3px);
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
  animation: ${slideIn} 0.6s ease-out;
`;

const StatCard = styled.div`
  background-color: #fff;
  border: 1px solid #E5E7EB;
  color: ${({ status }) => getStatusColor(status)};
  padding: 1.5rem;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }

  p {
    margin: 0;
    font-weight: 500;
    color: #4B5563;
  }

  h3 {
    margin: 0.5rem 0 0;
    font-size: 2rem;
    font-weight: 700;
  }
`;

const Tabs = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #E5E7EB;
  animation: ${slideIn} 0.7s ease-out;
`;

const TabButton = styled.button`
  background-color: transparent;
  border: none;
  padding: 1rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  position: relative;
  color: ${({ active }) => (active ? '#1E40AF' : '#6B7280')};
  transition: color 0.3s ease;

  &:hover {
    color: #1E40AF;
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 0;
    width: 100%;
    height: 3px;
    background-color: ${({ active }) => (active ? '#1E40AF' : 'transparent')};
    transition: background-color 0.3s ease;
  }
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #1F2937;
  margin: 0;
`;

const SearchInput = styled.input`
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  border-radius: 50px;
  border: 1px solid #D1D5DB;
  width: 100%;
  max-width: 300px;
  background-color: #fff;
  transition: all 0.3s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const BookingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  justify-items: center;
`;

const BookingCard = styled.div`
  background-color: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  border-left: 5px solid ${({ status }) => getStatusColor(status)};
  transition: transform 0.3s ease-in-out;
  width: 100%;

  &:hover {
    transform: translateY(-10px);
  }
`;

const BookingMeta = styled.div`
  border-bottom: 1px solid #E5E7EB;
  padding-bottom: 1rem;
  margin-bottom: 1rem;
  color: #6B7280;
  font-size: 0.9rem;
`;

const BookingInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1.5rem;

  p {
    margin: 0;
    font-size: 1rem;
    display: flex;
    align-items: center;
    gap: 0.8rem;
  }

  strong {
    font-weight: 600;
    color: #1F2937;
  }
`;

const AssignedProvider = styled.div`
  background-color: #F9FAFB;
  padding: 1rem;
  border-radius: 10px;
  margin-top: 1rem;
  border: 1px solid #E5E7EB;
  p {
    margin: 0;
    font-size: 0.95rem;
    color: #4B5563;
  }
`;

const StatusBadge = styled.span`
  background-color: ${({ status }) => getStatusBgColor(status)};
  color: ${({ status }) => getStatusColor(status)};
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-weight: bold;
  font-size: 0.9rem;
  display: inline-block;
  margin-top: 1rem;
  text-transform: capitalize;
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.8rem;
  margin-top: 1.5rem;
`;

const ActionButton = styled.button`
  background-color: ${({ status }) => getStatusColor(status)};
  color: #fff;
  padding: 0.8rem 1.2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.9rem;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  &:hover {
    filter: brightness(1.1);
    transform: translateY(-2px);
  }
`;

const DeleteButton = styled(ActionButton)`
  background-color: #6B7280;
  &:hover {
    background-color: #4B5563;
  }
`;

const AssignDropdown = styled.select`
  padding: 0.8rem 1.2rem;
  font-size: 0.9rem;
  border-radius: 50px;
  border: 1px solid #D1D5DB;
  background-color: #F8FAFC;
  cursor: pointer;
  max-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
  }
`;

const Message = styled.p`
  text-align: center;
  margin-top: 2rem;
  color: #6B7280;
  font-size: 1.2rem;
`;

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  background-color: #F8FAFC;
  padding: 2rem;
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
  color: #1E40AF;
  
  h2 {
    font-size: 2.5rem;
    font-weight: 800;
    margin: 0.5rem 0 0;
  }

  svg {
    font-size: 3rem;
  }
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 80%;
  max-width: 400px;
  background-color: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
`;

const LoginInput = styled.input`
  padding: 1rem;
  font-size: 1rem;
  border-radius: 10px;
  border: 1px solid #D1D5DB;
  background-color: #F9FAFB;
  transition: all 0.3s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  }
`;

const LoginButton = styled.button`
  background-color: #1E40AF;
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(30, 64, 175, 0.3);
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  
  &:hover {
    background-color: #1D4ED8;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(30, 64, 175, 0.4);
  }

  .spin {
    animation: ${spin} 1s linear infinite;
  }
`;

const ErrorText = styled.p`
  color: #EF4444;
  margin-top: 1rem;
  font-weight: 500;
  text-align: center;
`;

const ProviderTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 2rem;
  background-color: #fff;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);

  th, td {
    padding: 1.2rem;
    text-align: left;
    border-bottom: 1px solid #E5E7EB;
  }

  th {
    background-color: #1E40AF;
    color: #fff;
    font-weight: 600;
    font-size: 1rem;
  }

  tr:last-child td {
    border-bottom: none;
  }

  tbody tr:hover {
    background-color: #F9FAFB;
  }
`;

const TableActionButtons = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ProviderSection = styled.div`
  margin-top: 3rem;
`;

const ProviderActionBtn = styled.button`
  background-color: ${({ status }) => getStatusColor(status)};
  color: #fff;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  font-size: 0.8rem;
  transition: all 0.3s ease;
  
  &:hover {
    filter: brightness(1.2);
    transform: translateY(-2px);
  }
`;

const AdminPanel = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [activeProviders, setActiveProviders] = useState([]);
  const [pendingProviders, setPendingProviders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('bookings');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user && user.email === 'admin@quickfix.com') {
        setIsAuthenticated(true);
        fetchData();
      } else {
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    await Promise.all([fetchBookings(), fetchProviders()]);
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      if (userCredential.user.email !== 'admin@quickfix.com') {
        setError('Access denied. This is not an admin account.');
        await signOut(auth);
        setLoading(false);
        return;
      }
      setIsAuthenticated(true);
      fetchData();
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookings = async () => {
    try {
      const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(data);
      setFilteredBookings(data);
    } catch (err) {
      console.error('Error fetching bookings:', err.message);
    }
  };

  const fetchProviders = async () => {
    try {
      const q = query(collection(db, 'serviceProviders'));
      const snapshot = await getDocs(q);
      const allProviders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const pending = allProviders.filter(p => p.status === 'pending');
      const active = allProviders.filter(p => p.status === 'Active');

      setPendingProviders(pending);
      setActiveProviders(active);
    } catch (err) {
      console.error('Error fetching providers:', err.message);
    }
  };

  const handleApproveProvider = async (provider) => {
    try {
      await updateDoc(doc(db, 'serviceProviders', provider.id), {
        status: 'Active',
      });
      fetchProviders(); // Re-fetch providers to update the lists
      alert(`${provider.name} has been approved as an active service provider.`);
    } catch (err) {
      console.error('Error approving provider:', err.message);
      alert('Error approving provider. Please check the console.');
    }
  };

  const handleRejectProvider = async (id) => {
    if (window.confirm('Are you sure you want to reject this provider application? This action cannot be undone.')) {
      try {
        await deleteDoc(doc(db, 'serviceProviders', id));
        fetchProviders(); // Re-fetch providers to update the lists
      } catch (err) {
        console.error('Delete error:', err.message);
      }
    }
  };

  const handleDeleteBooking = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await deleteDoc(doc(db, 'bookings', id));
        fetchBookings(); // Re-fetch bookings to update the lists
      } catch (err) {
        console.error('Delete error:', err.message);
      }
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status: newStatus });
      fetchBookings(); // Re-fetch bookings to update the lists
    } catch (err) {
      console.error('Status update error:', err.message);
    }
  };

  const handleAssignProvider = async (bookingId, providerId) => {
    const provider = activeProviders.find(p => p.id === providerId);
    if (!provider) return;

    try {
      await updateDoc(doc(db, 'bookings', bookingId), {
        assignedProviderId: provider.id,
        assignedProviderName: provider.name,
        assignedProviderPhone: provider.phone,
        assignedProviderCity: provider.city,
        status: 'Approved',
      });
      fetchBookings(); // Re-fetch to update the booking status in the UI
    } catch (err) {
      console.error('Assign error:', err.message);
    }
  };

  const filterBookings = (text) => {
    setSearch(text);
    const query = text.toLowerCase();
    setFilteredBookings(
      bookings.filter(b =>
        b.name?.toLowerCase().includes(query) ||
        b.phone?.toLowerCase().includes(query) ||
        b.services?.some(s => s.toLowerCase().includes(query)) ||
        b.city?.toLowerCase().includes(query)
      )
    );
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setIsAuthenticated(false);
      setBookings([]);
      setFilteredBookings([]);
      setActiveProviders([]);
      setPendingProviders([]);
      setEmail('');
      setPassword('');
      setSearch('');
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === 'Pending').length,
    approved: bookings.filter(b => b.status === 'Approved').length,
    done: bookings.filter(b => b.status === 'Done').length,
    delayed: bookings.filter(b => b.status === 'Delayed').length,
  };

  if (!isAuthenticated) {
    return (
      <LoginContainer>
        <LoginHeader>
          <FaUserShield />
          <h2>Admin Login</h2>
        </LoginHeader>
        <LoginForm onSubmit={handleLogin}>
          <LoginInput
            type="email"
            placeholder="Admin Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <LoginInput
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <LoginButton type="submit">
            {loading ? <FaArrowsRotate className="spin" /> : <FaArrowRightFromBracket />} {loading ? 'Logging in...' : 'Login'}
          </LoginButton>
        </LoginForm>
        {error && <ErrorText>{error}</ErrorText>}
      </LoginContainer>
    );
  }

  return (
    <Container>
      <Header>
        <HeaderTitle>Admin Dashboard</HeaderTitle>
        <LogoutButton onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </LogoutButton>
      </Header>

      <StatsGrid>
        <StatCard>
          <p>Total Bookings</p>
          <h3>{stats.total}</h3>
        </StatCard>
        <StatCard status="Pending">
          <p>Pending</p>
          <h3>{stats.pending}</h3>
        </StatCard>
        <StatCard status="Approved">
          <p>Approved</p>
          <h3>{stats.approved}</h3>
        </StatCard>
        <StatCard status="Done">
          <p>Done</p>
          <h3>{stats.done}</h3>
        </StatCard>
        <StatCard status="Delayed">
          <p>Delayed</p>
          <h3>{stats.delayed}</h3>
        </StatCard>
      </StatsGrid>

      <Tabs>
        <TabButton active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')}>
          Bookings
        </TabButton>
        <TabButton active={activeTab === 'providers'} onClick={() => setActiveTab('providers')}>
          Providers & Applications
          {pendingProviders.length > 0 && ` (${pendingProviders.length})`}
        </TabButton>
      </Tabs>

      {activeTab === 'bookings' && (
        <>
          <SectionHeader>
            <SectionTitle>All Service Bookings</SectionTitle>
            <SearchInput
              type="text"
              placeholder="Search bookings..."
              value={search}
              onChange={(e) => filterBookings(e.target.value)}
            />
          </SectionHeader>

          {loading ? (
            <Message>Loading bookings...</Message>
          ) : filteredBookings.length === 0 ? (
            <Message>No bookings found.</Message>
          ) : (
            <BookingGrid>
              {filteredBookings.map((b) => {
                const matchingProviders = activeProviders.filter(
                  (p) =>
                    p.services && Array.isArray(p.services) && b.services && p.services.includes(b.services[0]) &&
                    p.city === b.city
                );

                return (
                  <BookingCard key={b.id} status={b.status}>
                    <BookingMeta>
                      <p><FaRegCalendarCheck /> <strong>Booking ID:</strong> {b.id}</p>
                      <p><FaCalendarDays /> <strong>Submitted At:</strong> {b.createdAt?.toDate().toLocaleString() || 'N/A'}</p>
                    </BookingMeta>
                    <BookingInfo>
                      <p><FaUser /> <strong>Name:</strong> {b.name}</p>
                      <p><FaPhoneVolume /> <strong>Phone:</strong> {b.phone}</p>
                      <p><FaLocationDot /> <strong>Location:</strong> {b.area}, {b.city}</p>
                      <p><FaToolsIcon /> <strong>Services:</strong> {b.services?.join(', ') || 'N/A'}</p>
                      <StatusBadge status={b.status}>{b.status}</StatusBadge>
                    </BookingInfo>
                    {b.assignedProviderName && (
                      <AssignedProvider>
                        <p>
                          <strong>Assigned Provider:</strong> {b.assignedProviderName} ({b.assignedProviderPhone})
                        </p>
                      </AssignedProvider>
                    )}

                    <Actions>
                      {b.status === 'Pending' && matchingProviders.length > 0 ? (
                        <AssignDropdown onChange={(e) => handleAssignProvider(b.id, e.target.value)} defaultValue="">
                          <option value="" disabled>-- Assign Provider --</option>
                          {matchingProviders.map(p => (
                            <option key={p.id} value={p.id}>
                              {p.name} ({p.phone})
                            </option>
                          ))}
                        </AssignDropdown>
                      ) : (b.status === 'Pending' && (
                        <Message>No providers for this service/city.</Message>
                      ))}
                      <ActionButton onClick={() => handleStatusUpdate(b.id, 'Done')} status="Done">Done</ActionButton>
                      <ActionButton onClick={() => handleStatusUpdate(b.id, 'Delayed')} status="Delayed">Delayed</ActionButton>
                      <DeleteButton onClick={() => handleDeleteBooking(b.id)}>Delete</DeleteButton>
                    </Actions>
                  </BookingCard>
                );
              })}
            </BookingGrid>
          )}
        </>
      )}

      {activeTab === 'providers' && (
        <ProviderSection>
          <SectionTitle>New Provider Applications ({pendingProviders.length})</SectionTitle>
          {loading ? (
            <Message>Loading provider applications...</Message>
          ) : pendingProviders.length === 0 ? (
            <Message>🎉 No new provider applications at the moment.</Message>
          ) : (
            <ProviderTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Services</th>
                  <th>City</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingProviders.map(request => (
                  <tr key={request.id}>
                    <td>{request.name}</td>
                    <td>{request.services?.join(', ') || 'N/A'}</td>
                    <td>{request.city}</td>
                    <td>{request.phone}</td>
                    <td>
                      <TableActionButtons>
                        <ProviderActionBtn status="Approved" onClick={() => handleApproveProvider(request)}>
                          <FaCheckCircle /> Approve
                        </ProviderActionBtn>
                        <ProviderActionBtn status="Rejected" onClick={() => handleRejectProvider(request.id)}>
                          <FaTimesCircle /> Reject
                        </ProviderActionBtn>
                      </TableActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </ProviderTable>
          )}

          <SectionTitle style={{ marginTop: '3rem' }}>All Active Service Providers ({activeProviders.length})</SectionTitle>
          {loading ? (
            <Message>Loading active providers...</Message>
          ) : activeProviders.length === 0 ? (
            <Message>No active service providers found.</Message>
          ) : (
            <ProviderTable>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Services</th>
                  <th>City</th>
                  <th>Contact</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {activeProviders.map(p => (
                  <tr key={p.id}>
                    <td>{p.name}</td>
                    <td>{p.services?.join(', ') || 'N/A'}</td>
                    <td>{p.city}</td>
                    <td>{p.phone}</td>
                    <td><StatusBadge status={p.status}>{p.status}</StatusBadge></td>
                  </tr>
                ))}
              </tbody>
            </ProviderTable>
          )}
        </ProviderSection>
      )}
    </Container>
  );
};

export default AdminPanel;
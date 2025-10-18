import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUserPlus, FaEnvelope, FaLock, FaPhoneVolume, FaCity, FaMapMarkerAlt, FaTools, FaCheck } from 'react-icons/fa';
import { auth, db } from '../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';

const cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi'];
const servicesList = ['Plumber', 'Electrician', 'Carpenter', 'AC Technician', 'Painter', 'Cleaning', 'Gas Fitter'];

const RegisterProvider = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    city: '',
    area: '',
    services: [],
    experience: '',
    bio: '',
  });

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      services: checked
        ? [...prev.services, value]
        : prev.services.filter(service => service !== value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setErrorMsg('');
    setLoading(true);

    const { name, phone, email, password, city, area, services } = formData;

    if (!name || !phone || !email || !password || !city || !area || services.length === 0) {
      setErrorMsg('❌ Please fill in all required fields and select at least one service.');
      setLoading(false);
      return;
    }

    try {
      // 1. Create a new user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Save provider details to Firestore
      // The `approved: false` flag is crucial for the admin panel's workflow
      await setDoc(doc(db, 'serviceProviders', user.uid), {
        ...formData,
        userId: user.uid,
        status: 'pending', // Added a status field for clearer tracking
        createdAt: serverTimestamp(), // Use serverTimestamp for accuracy
        approved: false, // Explicitly set approval status
      });

      setMessage('✅ Registration successful! Your profile is pending review by the admin.');
      setFormData({
        name: '', phone: '', email: '', password: '', city: '', area: '', services: [], experience: '', bio: '',
      });
    } catch (error) {
      console.error('Provider Registration Error:', error.message);
      setErrorMsg(`❌ Registration failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <Header>
        <HeaderIcon />
        <Heading>Service Provider Registration</Heading>
        <SubHeading>Join our network and connect with customers needing your skills.</SubHeading>
      </Header>
      
      <Form onSubmit={handleSubmit}>
        <InputGroup>
          <FaUserPlus />
          <StyledInput type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        </InputGroup>
        <InputGroup>
          <FaPhoneVolume />
          <StyledInput type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        </InputGroup>
        <InputGroup>
          <FaEnvelope />
          <StyledInput type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
        </InputGroup>
        <InputGroup>
          <FaLock />
          <StyledInput type="password" name="password" placeholder="Password (min 6 characters)" value={formData.password} onChange={handleChange} required />
        </InputGroup>

        <InputGroup>
          <FaCity />
          <StyledSelect name="city" value={formData.city} onChange={handleChange} required>
            <option value="">-- Select City --</option>
            {cities.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </StyledSelect>
        </InputGroup>
        
        <InputGroup>
          <FaMapMarkerAlt />
          <StyledInput type="text" name="area" placeholder="Area / Sector" value={formData.area} onChange={handleChange} required />
        </InputGroup>

        <ServiceSection>
          <ServiceHeading>Select Services You Offer:</ServiceHeading>
          <ServiceGrid>
            {servicesList.map((service) => (
              <CheckboxLabel key={service} htmlFor={`service-${service}`}>
                <CheckboxInput
                  id={`service-${service}`}
                  type="checkbox"
                  value={service}
                  checked={formData.services.includes(service)}
                  onChange={handleServiceChange}
                />
                <CustomCheckbox />
                <ServiceText>{service}</ServiceText>
              </CheckboxLabel>
            ))}
          </ServiceGrid>
        </ServiceSection>
        
        <InputGroup>
          <FaTools />
          <StyledInput type="number" name="experience" placeholder="Years of Experience (Optional)" value={formData.experience} onChange={handleChange} />
        </InputGroup>
        
        <StyledTextarea
          name="bio"
          placeholder="Tell us a little about your experience and skills (Optional)"
          value={formData.bio}
          onChange={handleChange}
        />

        <SubmitButton type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </SubmitButton>
      </Form>
      
      {message && <Message success>{message}</Message>}
      {errorMsg && <Message>{errorMsg}</Message>}
    </Container>
  );
};

// --- Animations & Styles (Modern Theme & Effects) ---
const slideIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); box-shadow: 0 10px 20px rgba(30, 64, 175, 0.3); }
  50% { transform: scale(1.02); box-shadow: 0 15px 30px rgba(30, 64, 175, 0.5); }
  100% { transform: scale(1); box-shadow: 0 10px 20px rgba(30, 64, 175, 0.3); }
`;

const Container = styled.div`
  max-width: 700px;
  margin: 3rem auto;
  padding: 3rem;
  background: #F8FAFC;
  border-radius: 25px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.08), 0 5px 15px rgba(0, 0, 0, 0.05);
  font-family: 'Inter', sans-serif;
  animation: ${slideIn} 0.6s ease-out;
  border: 1px solid #E2E8F0;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(90deg, #3B82F6, #1E40AF);
    border-top-left-radius: 25px;
    border-top-right-radius: 25px;
  }
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  position: relative;
`;

const HeaderIcon = styled(FaUserPlus)`
  font-size: 3.5rem;
  color: #1E40AF;
  margin-bottom: 0.5rem;
  animation: ${pulse} 2s infinite ease-in-out;
`;

const Heading = styled.h2`
  font-size: 2.2rem;
  font-weight: 800;
  color: #2D3748;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
`;

const SubHeading = styled.p`
  font-size: 1rem;
  color: #718096;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  gap: 1rem;
  background-color: #fff;
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 0.8rem 1.2rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;

  &:focus-within {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3), 0 4px 10px rgba(59, 130, 246, 0.1);
  }

  svg {
    color: #A0AEC0;
    font-size: 1.2rem;
    transition: color 0.3s;
  }

  &:focus-within svg {
    color: #3B82F6;
  }
`;

const StyledInput = styled.input`
  flex-grow: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #2D3748;
  outline: none;

  &::placeholder {
    color: #A0AEC0;
    opacity: 0.8;
  }
`;

const StyledSelect = styled.select`
  flex-grow: 1;
  border: none;
  background: transparent;
  font-size: 1rem;
  color: #2D3748;
  outline: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  cursor: pointer;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  min-height: 100px;
  padding: 1.2rem;
  border-radius: 12px;
  border: 1px solid #E2E8F0;
  background: #fff;
  font-size: 1rem;
  color: #2D3748;
  outline: none;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;

  &:focus {
    border-color: #3B82F6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.3);
  }

  &::placeholder {
    color: #A0AEC0;
    opacity: 0.8;
  }
`;

const ServiceSection = styled.div`
  margin-top: 1rem;
`;

const ServiceHeading = styled.p`
  font-size: 1.1rem;
  font-weight: 600;
  color: #2D3748;
  margin-bottom: 1rem;
`;

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  background-color: #fff;
  padding: 1rem 1.2rem;
  border-radius: 12px;
  border: 2px solid #E2E8F0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease-in-out;
  position: relative;

  &:hover {
    border-color: #3B82F6;
    transform: translateY(-3px);
  }
`;

const CheckboxInput = styled.input`
  /* Hide the default checkbox */
  position: absolute;
  opacity: 0;
  cursor: pointer;
  height: 0;
  width: 0;
`;

const CustomCheckbox = styled.span`
  position: relative;
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  background-color: #fff;
  border: 2px solid #A0AEC0;
  border-radius: 6px;
  transition: all 0.3s ease-in-out;

  &::after {
    content: '';
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 6px;
    height: 12px;
    border: solid #fff;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
  }

  ${CheckboxLabel}:hover & {
    border-color: #3B82F6;
  }

  ${CheckboxInput}:checked + & {
    background-color: #3B82F6;
    border-color: #3B82F6;
  }
  
  ${CheckboxInput}:checked + &::after {
    display: block;
  }
`;

const ServiceText = styled.span`
  font-weight: 500;
  color: #4A5568;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1.2rem;
  background-color: #1E40AF;
  color: #fff;
  font-size: 1.1rem;
  font-weight: 700;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 10px 20px rgba(30, 64, 175, 0.3);
  transition: all 0.3s ease-in-out;
  margin-top: 1rem;
  animation: ${({ loading }) => (loading ? pulse : 'none')} 1s infinite;

  &:hover {
    background-color: #1D4ED8;
    transform: translateY(-3px);
    box-shadow: 0 12px 25px rgba(30, 64, 175, 0.4);
  }

  &:disabled {
    background-color: #A0AEC0;
    cursor: not-allowed;
    box-shadow: none;
    transform: translateY(0);
    animation: none;
  }
`;

const Message = styled.p`
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  margin-top: 1.5rem;
  padding: 1rem;
  border-radius: 12px;
  background-color: ${({ success }) => (success ? '#D4EDDA' : '#F8D7DA')};
  color: ${({ success }) => (success ? '#155724' : '#721C24')};
  border: 1px solid ${({ success }) => (success ? '#C3E6CB' : '#F5C6CB')};
`;

export default RegisterProvider;
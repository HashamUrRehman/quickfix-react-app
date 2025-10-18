import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { auth, db } from '../firebaseConfig';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { FaPhoneVolume } from 'react-icons/fa6';

const cities = ['Islamabad', 'Rawalpindi', 'Lahore', 'Karachi'];
const sectors = {
  Islamabad: ['G-9', 'G-10', 'F-8', 'F-10', 'I-8', 'I-10'],
  Rawalpindi: ['Saddar', 'Commercial Market', 'Chaklala', 'Scheme 3', 'Bahria Town'],
};
const servicesList = ['Plumber', 'Electrician', 'Carpenter', 'AC Technician', 'Painter', 'Cleaning', 'Gas Fitter'];

const BookingForm = () => {
  const location = useLocation();
  const serviceFromBrowse = location.state?.selectedService || '';
  const selectedCity = location.state?.selectedCity || '';
  const selectedArea = location.state?.selectedArea || '';

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    city: selectedCity,
    area: selectedArea,
    date: '',
    services: serviceFromBrowse ? [serviceFromBrowse] : [],
  });

  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    if (serviceFromBrowse && !formData.services.includes(serviceFromBrowse)) {
      setFormData(prev => ({
        ...prev,
        services: [...prev.services, serviceFromBrowse]
      }));
    }
  }, [serviceFromBrowse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (e) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter(service => service !== value)
        : [...prev.services, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    const isEligible = formData.city === 'Islamabad' || formData.city === 'Rawalpindi';
    if (!isEligible) {
      setErrorMsg('QuickFix is currently available only in Islamabad and Rawalpindi.');
      return;
    }

    const selectedDate = new Date(formData.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) {
      setErrorMsg('You cannot book a service for a past date.');
      return;
    }

    if (formData.name && formData.phone && formData.city && formData.area && formData.date && formData.services.length) {
      try {
        const user = auth.currentUser;
        if (!user) {
          setErrorMsg('You must be logged in to book a service.');
          return;
        }

        const bookingRef = await addDoc(collection(db, 'bookings'), {
          ...formData,
          userId: user.uid,
          status: 'Pending',
          assignedProviderId: null,
          createdAt: serverTimestamp(),
        });

        setBookingDetails({ ...formData, status: 'Pending', bookingId: bookingRef.id });
        setSubmitted(true);
        setFormData({ name: '', phone: '', city: '', area: '', date: '', services: [] });
      } catch (err) {
        console.error("Booking Error:", err.message);
        setErrorMsg('Failed to submit booking. Try again later.');
      }
    } else {
      setErrorMsg('Please complete all fields and select at least one service.');
    }
  };

  const isEligibleCity = formData.city === 'Islamabad' || formData.city === 'Rawalpindi';

  return (
    <Container>
      <Banner>
        <BannerIcon>📅</BannerIcon>
        <BannerTitle>Book Your Service</BannerTitle>
        <p>Choose your city, select a service, and relax — we’ll handle the rest!</p>
      </Banner>

      <HowItWorksSection>
        <SectionTitle>How It Works</SectionTitle>
        <Steps>
          <li>Fill out the booking form</li>
          <li>We'll confirm your request</li>
          <li>Our expert will arrive on time</li>
        </Steps>
      </HowItWorksSection>

      {serviceFromBrowse && (
        <SelectedBox>
          <FaCheckCircle /> You selected: <strong>{serviceFromBrowse}</strong>
        </SelectedBox>
      )}

      {!submitted && (
        <Form onSubmit={handleSubmit}>
          <Input type="text" name="name" placeholder="Your Full Name" value={formData.name} onChange={handleChange} />
          <Input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} />

          <Select name="city" value={formData.city} onChange={handleChange}>
            <option value="">-- Select City --</option>
            {cities.map(city => <option key={city} value={city}>{city}</option>)}
          </Select>

          {formData.city && !isEligibleCity && (
            <NoticeBox>
              <FaExclamationCircle /> QuickFix is currently available only in Islamabad and Rawalpindi.
            </NoticeBox>
          )}

          {isEligibleCity && (
            <Select name="area" value={formData.area} onChange={handleChange}>
              <option value="">-- Select Area --</option>
              {sectors[formData.city]?.map(area => <option key={area} value={area}>{area}</option>)}
            </Select>
          )}

          <Input type="date" name="date" value={formData.date} onChange={handleChange} />

          <ServicesSection>
            <ServicesTitle>Select Required Services:</ServicesTitle>
            <ServiceOptions>
              {servicesList.map((service, index) => (
                <CheckboxLabel key={index}>
                  <input
                    type="checkbox"
                    value={service}
                    checked={formData.services.includes(service)}
                    onChange={handleServiceChange}
                  />
                  <span>{service}</span>
                </CheckboxLabel>
              ))}
            </ServiceOptions>
          </ServicesSection>

          <SubmitButton type="submit">Submit Booking</SubmitButton>
        </Form>
      )}

      {submitted && bookingDetails && (
        <SuccessBox>
          <h4><FaCheckCircle /> Booking Submitted Successfully!</h4>
          <DetailText><strong>Name:</strong> {bookingDetails.name}</DetailText>
          <DetailText><strong>Phone:</strong> {bookingDetails.phone}</DetailText>
          <DetailText><strong>City:</strong> {bookingDetails.city}</DetailText>
          <DetailText><strong>Area:</strong> {bookingDetails.area}</DetailText>
          <DetailText><strong>Date:</strong> {bookingDetails.date}</DetailText>
          <DetailText><strong>Services:</strong> {bookingDetails.services.join(', ')}</DetailText>
          <StatusText><strong>Status:</strong> Waiting for provider assignment</StatusText>
        </SuccessBox>
      )}

      {errorMsg && <ErrorBox><FaExclamationCircle /> {errorMsg}</ErrorBox>}

      <WhyBookSection>
        <SectionTitle>Why Book With QuickFix?</SectionTitle>
        <FeatureList>
          <li><FaCheckCircle /> Verified and trained professionals</li>
          <li><FaCheckCircle /> Transparent and affordable pricing</li>
          <li><FaCheckCircle /> Reliable and fast response times</li>
        </FeatureList>
      </WhyBookSection>

      <SupportBox>
        <p><FaPhoneVolume /> Need help? Call us at <strong>+92305-5900328</strong> or WhatsApp for instant support.</p>
      </SupportBox>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  padding: 2rem;
  font-family: 'Inter', sans-serif;
  background-color: #F0F2F5; /* Light grey background */
  color: #333;
`;

const Banner = styled.section`
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(45deg, #1F61B8 0%, #1A5499 100%);
  color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 4rem;
`;

const BannerIcon = styled.span`
  font-size: 3rem;
  display: block;
  margin-bottom: 1rem;
`;

const BannerTitle = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
`;

const HowItWorksSection = styled.section`
  max-width: 700px;
  margin: 0 auto 4rem;
  text-align: center;
`;

const SectionTitle = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #1F61B8;
  margin-bottom: 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: #FF6B00;
    border-radius: 2px;
  }
`;

const Steps = styled.ol`
  list-style: none;
  counter-reset: my-awesome-counter;
  display: flex;
  justify-content: center;
  padding: 0;
  gap: 2rem;
  
  li {
    counter-increment: my-awesome-counter;
    position: relative;
    font-size: 1.1rem;
    color: #555;
    padding-left: 2.5rem;
    
    &::before {
      content: counter(my-awesome-counter);
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
      width: 35px;
      height: 35px;
      background-color: #1F61B8;
      color: #fff;
      border-radius: 50%;
      display: grid;
      place-items: center;
      font-weight: bold;
    }
  }
`;

const SelectedBox = styled.div`
  text-align: center;
  padding: 1rem;
  background-color: #d4edda;
  color: #155724;
  border-radius: 10px;
  margin: 0 auto 2rem;
  max-width: 600px;
  font-size: 1.1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
`;

const Form = styled.form`
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
`;

const Input = styled.input`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease-in-out;
  
  &:focus {
    outline: none;
    border-color: #1F61B8;
    box-shadow: 0 0 0 3px rgba(31, 97, 184, 0.2);
  }
`;

const Select = styled.select`
  padding: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #fff;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #1F61B8;
    box-shadow: 0 0 0 3px rgba(31, 97, 184, 0.2);
  }
`;

const ServicesSection = styled.div`
  margin-top: 1rem;
`;

const ServicesTitle = styled.p`
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #1F61B8;
`;

const ServiceOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 0.8rem;
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #F0F2F5;
  padding: 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  
  input[type="checkbox"] {
    accent-color: #FF6B00;
  }
  
  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px);
  }
`;

const SubmitButton = styled.button`
  background-color: #FF6B00;
  color: #fff;
  padding: 1rem 2rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 1rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background-color: #E65C00;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

const SuccessBox = styled.div`
  margin-top: 2rem;
  text-align: center;
  background-color: #d4edda;
  padding: 2rem;
  border-radius: 20px;
  color: #155724;
  line-height: 1.6;
  max-width: 600px;
  margin: 2rem auto;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  
  h4 {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    font-size: 1.5rem;
    margin-bottom: 1rem;
  }
`;

const DetailText = styled.p`
  text-align: left;
  margin: 0.5rem 0;
  
  strong {
    color: #155724;
  }
`;

const StatusText = styled.p`
  text-align: left;
  margin-top: 1rem;
  font-weight: bold;
`;

const ErrorBox = styled.p`
  padding: 1rem;
  background-color: #ffe6e6;
  border-radius: 10px;
  color: #b00020;
  margin: 1rem auto;
  max-width: 600px;
  text-align: center;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 15px rgba(0,0,0,0.05);
`;

const NoticeBox = styled(ErrorBox)`
  background-color: #fff3cd;
  color: #856404;
`;

const WhyBookSection = styled.section`
  max-width: 700px;
  margin: 4rem auto 2rem;
  text-align: center;
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  font-size: 1.1rem;
  line-height: 1.8;
  max-width: 600px;
  margin: 2rem auto 0;
  
  li {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  svg {
    color: #1F61B8;
  }
`;

const SupportBox = styled.section`
  text-align: center;
  background-color: #fff;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-top: 4rem;
  
  p {
    font-size: 1.1rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.8rem;
  }
  
  svg {
    font-size: 1.5rem;
    color: #FF6B00;
  }
`;

export default BookingForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { db } from '../firebaseConfig';
import { FaWhatsapp } from 'react-icons/fa';

import plumberImg from '../images/plumber.png';
import electricianImg from '../images/electrician.jpg';
import carpenterImg from '../images/carpenter.jpg';
import acImg from '../images/as-technician.jpg';
import painterImg from '../images/painter.jpg';
import cleaningImg from '../images/cleaning.jpeg';

const Home = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', phone: '', message: '' });

  const services = [
    { name: 'Plumber', image: plumberImg },
    { name: 'Electrician', image: electricianImg },
    { name: 'Carpenter', image: carpenterImg },
    { name: 'AC Technician', image: acImg },
    { name: 'Painter', image: painterImg },
    { name: 'Cleaning', image: cleaningImg },
  ];

  const topServices = [
    'UPS Installation Services',
    'Furniture Repairing Services',
    'Geyser Installation And Repair',
    'Washing Machine Installation And Repair Services',
    'Refrigerator Services',
    'Furniture Polish Service',
    'Door Lock Replacement',
    'Mixer Tap Installation and Repair',
    'Water Tank Leakage Services',
    'AC Repair Services',
    'Kitchen Hood Installation and Repairing',
    'Washroom Accessories Installation',
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await db.collection('complaints').add({
        name: form.name,
        phone: form.phone,
        message: form.message,
        timestamp: new Date(),
      });
      alert('Message sent successfully!');
      setForm({ name: '', phone: '', message: '' });
    } catch (error) {
      console.error('Firestore Error:', error);
      alert('Error sending message. Try again later.');
    }
  };

  return (
    <Container>
      <HeroSection>
        <Title>QuickFix</Title>
        <Subtitle>Your reliable local handyman booking platform</Subtitle>
        <HeroButton onClick={() => navigate('/browse')}>
          Browse Services
        </HeroButton>
      </HeroSection>

      <Section>
        <SectionTitle>Popular Services</SectionTitle>
        <ServiceGrid>
          {services.map((service, index) => (
            <ServiceCard key={index}>
              <ServiceImage src={service.image} alt={service.name} />
              <p>{service.name}</p>
            </ServiceCard>
          ))}
        </ServiceGrid>
      </Section>

      <WhyUsSection>
        <SectionTitle>Why Choose Us?</SectionTitle>
        <BulletList>
          <li><CheckIcon>✅</CheckIcon> Connects you to Verified and Trained Technicians</li>
          <li><CheckIcon>⏱️</CheckIcon> Saves Your Time through an Easy and Efficient Booking Process</li>
          <li><CheckIcon>🎧</CheckIcon> Offers Impeccable Customer Support</li>
          <li><CheckIcon>💸</CheckIcon> Ensures Cost-effectiveness</li>
          <li><CheckIcon>🛠️</CheckIcon> Provides High-quality, Reliability and Safety</li>
          <li><CheckIcon>🚪</CheckIcon> Promises Doorstep Services — Saves Travelling Costs</li>
          <li><CheckIcon>🔐</CheckIcon> Guarantees Secure Transactions</li>
        </BulletList>
      </WhyUsSection>

      <ComplaintSection>
        <ComplaintText>
          <SectionTitle>Resolving your complaints!</SectionTitle>
          <p>Leave your complaint here to help us make our services better for you.</p>
        </ComplaintText>
        <Form onSubmit={handleSubmit}>
          <FormInput
            type="text"
            placeholder="Name *"
            value={form.name}
            required
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <FormInput
            type="tel"
            placeholder="Phone number *"
            value={form.phone}
            required
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />
          <FormTextarea
            placeholder="Message *"
            value={form.message}
            required
            onChange={(e) => setForm({ ...form, message: e.target.value })}
          />
          <SubmitButton type="submit">Submit</SubmitButton>
        </Form>
      </ComplaintSection>

      <TagsSection>
        <SectionTitle>Top Services</SectionTitle>
        <TagsContainer>
          {topServices.map((tag, idx) => (
            <Tag key={idx}>{tag}</Tag>
          ))}
        </TagsContainer>
      </TagsSection>

      <CtaBanner>
        <h2>Need Immediate Help?</h2>
        <p>Book a service now and let us handle the rest.</p>
        <CtaButton onClick={() => navigate('/booking')}>
          Book a Service
        </CtaButton>
      </CtaBanner>

      <WhatsappButton
        href="https://wa.me/923055900328?text=Hi%20QuickFix%20Team,%20I%20need%20help%20with%20a%20service."
        target="_blank"
        rel="noopener noreferrer"
        title="Chat with us on WhatsApp"
      >
        <FaWhatsapp />
      </WhatsappButton>
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

const HeroSection = styled.section`
  text-align: center;
  padding: 4rem 1rem;
  background: linear-gradient(135deg, #F0F2F5 0%, #E6E9EC 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  margin-bottom: 4rem;
  position: relative;
  overflow: hidden;
`;

const Title = styled.h1`
  font-size: 3.5rem;
  font-weight: 900;
  color: #1F61B8; /* Brand blue */
  margin: 0;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -2px;
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  margin-top: 1rem;
  color: #555;
`;

const Button = styled.button`
  background-color: #1F61B8;
  color: #fff;
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1.1rem;
  font-weight: bold;
  margin-top: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #1A5499;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

const HeroButton = styled(Button)`
  background-color: #FF6B00; /* Neon orange accent */
  color: #fff;

  &:hover {
    background-color: #E65C00;
  }
`;

const Section = styled.section`
  margin-bottom: 4rem;
`;

const SectionTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 700;
  color: #1F61B8;
  text-align: center;
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

const ServiceGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  justify-items: center;
`;

const ServiceCard = styled.div`
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
  
  p {
    font-weight: bold;
    color: #1F61B8;
    padding: 1rem 0;
    margin: 0;
  }
`;

const ServiceImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
`;

const WhyUsSection = styled.section`
  background: linear-gradient(45deg, #1F61B8 0%, #1A5499 100%);
  color: #fff;
  padding: 4rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 4rem;
  
  ${SectionTitle} {
    color: #FF6B00; /* Neon orange title */
    
    &::after {
      background-color: #F0F2F5; /* Light line */
    }
  }
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 800px;
  margin: 2rem auto 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  
  li {
    font-size: 1.1rem;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 1rem;
  }
`;

const CheckIcon = styled.span`
  font-size: 1.5rem;
`;

const ComplaintSection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
  background-color: #fff;
  padding: 4rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 4rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
`;

const ComplaintText = styled.div`
  ${SectionTitle} {
    text-align: left;
    &::after {
      left: 0;
      transform: none;
    }
  }
  p {
    font-size: 1.1rem;
    color: #555;
  }
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormInput = styled.input`
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

const FormTextarea = styled.textarea`
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
  resize: vertical;
  min-height: 120px;
  transition: all 0.3s ease-in-out;

  &:focus {
    outline: none;
    border-color: #1F61B8;
    box-shadow: 0 0 0 3px rgba(31, 97, 184, 0.2);
  }
`;

const SubmitButton = styled(Button)`
  background-color: #FF6B00;
  &:hover {
    background-color: #E65C00;
  }
`;

const TagsSection = styled.section`
  background-color: #fff;
  padding: 4rem;
  border-radius: 20px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 4rem;
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
`;

const Tag = styled.span`
  background-color: #E6E9EC;
  color: #555;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  font-weight: 500;
  transition: all 0.3s ease-in-out;

  &:hover {
    background-color: #1F61B8;
    color: #fff;
    cursor: pointer;
    transform: translateY(-2px);
  }
`;

const CtaBanner = styled.section`
  text-align: center;
  padding: 4rem 2rem;
  background: linear-gradient(45deg, #1F61B8 0%, #1A5499 100%);
  color: #fff;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  h2 {
    font-size: 2.5rem;
    margin-bottom: 1rem;
  }
  
  p {
    font-size: 1.2rem;
    margin-bottom: 2rem;
  }
  
  ${Button} {
    background-color: #FF6B00;
    &:hover {
      background-color: #E65C00;
    }
  }
`;

const CtaButton = styled(Button)`
  background-color: #FF6B00;
  &:hover {
    background-color: #E65C00;
  }
`;

const WhatsappButton = styled.a`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 60px;
  height: 60px;
  background-color: #25D366;
  color: #fff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.4);
  }
`;

export default Home;
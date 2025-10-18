import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaWrench, FaBolt, FaHammer, FaSnowflake, FaPaintRoller, FaBroom, FaFire } from 'react-icons/fa';
import { MdOutlineCleaningServices } from 'react-icons/md';

const services = [
  { name: 'Plumber', description: 'Leakage repair, pipe fitting, water tank cleaning, geyser installation', icon: <FaWrench /> },
  { name: 'Electrician', description: 'Wiring, switch repair, fan/AC installation, UPS connection', icon: <FaBolt /> },
  { name: 'Carpenter', description: 'Furniture repair, woodwork, cabinet and door fitting', icon: <FaHammer /> },
  { name: 'AC Technician', description: 'AC service, gas refill, installation and maintenance', icon: <FaSnowflake /> },
  { name: 'Painter', description: 'Interior and exterior painting, wall polish, texture finish', icon: <FaPaintRoller /> },
  { name: 'Cleaning', description: 'Full house deep cleaning, post-renovation, tank cleaning', icon: <MdOutlineCleaningServices /> },
  { name: 'Gas Fitter', description: 'Stove and geyser installation, gas leak repair', icon: <FaFire /> },
];

const BrowseServices = () => {
  const [city, setCity] = useState('');
  const [area, setArea] = useState('');
  const navigate = useNavigate();

  const handleBookNow = (serviceName) => {
    navigate('/booking', {
      state: {
        selectedService: serviceName,
        selectedCity: city,
        selectedArea: area,
      },
    });
  };

  return (
    <Container>
      <Banner>
        <BannerTitle>QuickFix Home Services</BannerTitle>
        <p>Reliable • Affordable • Available near you</p>
      </Banner>

      <FeaturedServicesSection>
        <SectionHeader>Top Trending Services</SectionHeader>
        <ServiceList>
          {services.slice(0, 3).map((service) => (
            <ServiceCard key={service.name}>
              <IconWrapper>{service.icon}</IconWrapper>
              <CardTitle>{service.name}</CardTitle>
              <CardDescription>{service.description}</CardDescription>
            </ServiceCard>
          ))}
        </ServiceList>
      </FeaturedServicesSection>

      <FilterSection>
        <FilterHeader>Browse Services by Area</FilterHeader>
        <FilterSubheading>
          Select your city and area to find trusted local service providers available near you.
        </FilterSubheading>

        <FilterRow>
          <Select value={city} onChange={(e) => setCity(e.target.value)}>
            <option value="">Select City</option>
            <option value="Islamabad">Islamabad</option>
            <option value="Rawalpindi">Rawalpindi</option>
          </Select>
          <Select value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">Select Area</option>
            {city === 'Islamabad' &&
              ['G-10', 'F-8', 'I-8'].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
            {city === 'Rawalpindi' &&
              ['Saddar', 'Chaklala', 'Bahria Town'].map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
          </Select>
        </FilterRow>
      </FilterSection>

      {city && area && (
        <>
          <SectionHeader style={{ marginTop: '3rem' }}>Services in {area}, {city}</SectionHeader>
          <ServiceList>
            {services.map((service) => (
              <ServiceCard key={service.name}>
                <IconWrapper>{service.icon}</IconWrapper>
                <CardTitle>{service.name}</CardTitle>
                <CardDescription>{service.description}</CardDescription>
                <BookButton onClick={() => handleBookNow(service.name)}>
                  Book Now
                </BookButton>
              </ServiceCard>
            ))}
          </ServiceList>
        </>
      )}

      <WhyUsSection>
        <SectionHeader>Why QuickFix?</SectionHeader>
        <FeatureList>
          <li><FeatureIcon>✔️</FeatureIcon> Verified and Trained Technicians</li>
          <li><FeatureIcon>✔️</FeatureIcon> Doorstep Services, Saves Time & Travel</li>
          <li><FeatureIcon>✔️</FeatureIcon> Transparent Pricing, No Hidden Costs</li>
          <li><FeatureIcon>✔️</FeatureIcon> Instant Booking – No App Required</li>
        </FeatureList>
      </WhyUsSection>

      <TestimonialsSection>
        <SectionHeader>What Our Customers Say</SectionHeader>
        <TestimonialGrid>
          <TestimonialCard>
            <p>“QuickFix sent a plumber within 30 minutes – super convenient!”</p>
            <AuthorText>– Ali R.</AuthorText>
          </TestimonialCard>
          <TestimonialCard>
            <p>“Very professional and polite service. 5 stars!”</p>
            <AuthorText>– Zainab F.</AuthorText>
          </TestimonialCard>
        </TestimonialGrid>
      </TestimonialsSection>
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

const BannerTitle = styled.h1`
  font-size: 3rem;
  font-weight: 800;
  margin: 0;
  letter-spacing: -1px;
`;

const SectionHeader = styled.h3`
  font-size: 2rem;
  font-weight: 700;
  color: #1F61B8; /* Brand blue */
  text-align: center;
  margin: 3rem 0 2rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 4px;
    background-color: #FF6B00; /* Neon orange accent */
    border-radius: 2px;
  }
`;

const FeaturedServicesSection = styled.section`
  margin-bottom: 4rem;
`;

const ServiceList = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  justify-items: center;
`;

const ServiceCard = styled.div`
  background: #fff;
  border-radius: 15px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  padding: 2rem;
  text-align: center;
  transition: transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  }
`;

const IconWrapper = styled.div`
  font-size: 3rem;
  color: #1F61B8;
  margin-bottom: 1rem;
`;

const CardTitle = styled.h4`
  font-size: 1.5rem;
  margin: 0 0 0.5rem;
  color: #1F61B8;
`;

const CardDescription = styled.p`
  color: #555;
  font-size: 0.95rem;
`;

const FilterSection = styled.section`
  background-color: #fff;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 4rem;
  text-align: center;
`;

const FilterHeader = styled.h2`
  font-size: 2rem;
  color: #1F61B8;
  margin-bottom: 1rem;
`;

const FilterSubheading = styled.p`
  color: #555;
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
`;

const FilterRow = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  
  @media (max-width: 500px) {
    flex-direction: column;
    align-items: center;
  }
`;

const Select = styled.select`
  padding: 1rem;
  font-size: 1rem;
  border-radius: 8px;
  border: 1px solid #ddd;
  background-color: #F0F2F5;
  cursor: pointer;
  min-width: 200px;
  
  &:focus {
    outline: none;
    border-color: #1F61B8;
    box-shadow: 0 0 0 3px rgba(31, 97, 184, 0.2);
  }
`;

const BookButton = styled.button`
  background-color: #FF6B00;
  color: #fff;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-size: 1rem;
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

const WhyUsSection = styled.section`
  background: linear-gradient(45deg, #1F61B8 0%, #1A5499 100%);
  color: #fff;
  padding: 4rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-top: 4rem;
  margin-bottom: 4rem;
  
  ${SectionHeader} {
    color: #FF6B00;
    &::after {
      background-color: #F0F2F5;
    }
  }
`;

const FeatureList = styled.ul`
  list-style: none;
  padding: 0;
  max-width: 600px;
  margin: 2rem auto 0;
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
`;

const FeatureIcon = styled.span`
  font-size: 1.2rem;
  margin-right: 1rem;
`;

const TestimonialsSection = styled.section`
  background-color: #fff;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  margin-bottom: 4rem;
`;

const TestimonialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  justify-items: center;
  margin-top: 2rem;
`;

const TestimonialCard = styled.blockquote`
  background-color: #F0F2F5;
  padding: 2rem;
  border-radius: 15px;
  font-style: italic;
  position: relative;
  border-left: 5px solid #1F61B8; /* Brand blue accent */
  
  p {
    margin: 0;
    color: #555;
    font-size: 1.1rem;
  }
`;

const AuthorText = styled.p`
  text-align: right;
  font-weight: bold;
  margin-top: 1rem;
  color: #333;
`;

export default BrowseServices;
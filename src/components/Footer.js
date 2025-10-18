import React from 'react';
import styled from 'styled-components';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <FooterContainer>
      <ContentWrapper>
        <FooterSection>
          <Logo>QuickFix</Logo>
          <p>Connecting you with local service professionals instantly.</p>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Services</SectionTitle>
          <FooterLink href="#">Browse Services</FooterLink>
          <FooterLink href="#">Become a Provider</FooterLink>
          <FooterLink href="#">Book a Service</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Company</SectionTitle>
          <FooterLink href="#">About Us</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
          <FooterLink href="#">FAQ</FooterLink>
        </FooterSection>

        <FooterSection>
          <SectionTitle>Follow Us</SectionTitle>
          <SocialIcons>
            <SocialIcon href="#" target="_blank" aria-label="Facebook"><FaFacebookF /></SocialIcon>
            <SocialIcon href="#" target="_blank" aria-label="Twitter"><FaTwitter /></SocialIcon>
            <SocialIcon href="#" target="_blank" aria-label="Instagram"><FaInstagram /></SocialIcon>
            <SocialIcon href="#" target="_blank" aria-label="LinkedIn"><FaLinkedinIn /></SocialIcon>
          </SocialIcons>
        </FooterSection>
      </ContentWrapper>

      <Copyright>
        &copy; {new Date().getFullYear()} QuickFix. All Rights Reserved.
      </Copyright>
    </FooterContainer>
  );
};

// Styled Components for a Modern Footer
const FooterContainer = styled.footer`
  background-color: #1A1A1A; /* Dark mode-friendly background */
  color: #F0F2F5; /* Light grey text */
  padding: 4rem 3rem 1.5rem;
  margin-top: 5rem;
  border-top: 5px solid #1F61B8; /* Brand blue accent line */
  font-family: 'Inter', sans-serif; /* A modern, clean font */
`;

const ContentWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto 3rem;
  border-bottom: 1px solid #333;
  padding-bottom: 2rem;
`;

const FooterSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const Logo = styled.h3`
  font-size: 1.8rem;
  font-weight: 800;
  color: #1F61B8;
  letter-spacing: -0.5px;
  margin-bottom: 0.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
`;

const SectionTitle = styled.h4`
  color: #FF6B00; /* Neon orange accent */
  font-size: 1rem;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: -5px;
    width: 40px;
    height: 3px;
    background-color: #1F61B8;
    border-radius: 2px;
  }
`;

const FooterLink = styled.a`
  color: #A0A2A5; /* Softer text color */
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
  
  &:hover {
    color: #F0F2F5; /* Light grey on hover */
    transform: translateX(5px);
  }
`;

const SocialIcons = styled.div`
  display: flex;
  gap: 1rem;
`;

const SocialIcon = styled.a`
  font-size: 1.5rem;
  color: #1F61B8; /* Brand blue */
  transition: color 0.3s ease-in-out, transform 0.3s ease-in-out;
  
  &:hover {
    color: #FF6B00; /* Neon orange on hover */
    transform: translateY(-3px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  margin-top: 2rem;
  font-size: 0.8rem;
  color: #666;
`;

export default Footer;
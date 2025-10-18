import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { FaBars, FaTimes, FaUser, FaSignOutAlt, FaHome, FaWrench, FaCalendarCheck, FaUserShield, FaUserTie } from 'react-icons/fa';
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

const Navbar = () => {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setIsLoggedIn(true);
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserName(docSnap.data().name);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setIsLoggedIn(false);
        setUserName('');
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Logout Error:', error);
    }
  };

  return (
    <Nav>
      <Logo to="/home">QuickFix</Logo>
      
      <Hamburger onClick={() => setMenuOpen(!menuOpen)}>
        {menuOpen ? <FaTimes /> : <FaBars />}
      </Hamburger>

      <Menu open={menuOpen}>
        <NavList>
          <li><NavLink to="/home" onClick={() => setMenuOpen(false)}><FaHome /> Home</NavLink></li>
          <li><NavLink to="/browse" onClick={() => setMenuOpen(false)}><FaWrench /> Browse Services</NavLink></li>
          <li><NavLink to="/booking" onClick={() => setMenuOpen(false)}><FaCalendarCheck /> Book a Service</NavLink></li>
          <li><NavLink to="/admin" onClick={() => setMenuOpen(false)}><FaUserShield /> Admin Panel</NavLink></li>
        </NavList>
        <AuthSection>
          <ProviderButton to="/register-provider" onClick={() => setMenuOpen(false)}>
            <FaUserTie /> Become a Provider
          </ProviderButton>
          {isLoggedIn ? (
            <UserMenu>
              {userName && <WelcomeText>Welcome, {userName}</WelcomeText>}
              <ProfileButton to="/userdashboard" onClick={() => setMenuOpen(false)}><FaUser /> Profile</ProfileButton>
              <LogoutButton onClick={handleLogout}><FaSignOutAlt /> Logout</LogoutButton>
            </UserMenu>
          ) : (
            <LoginButton to="/login" onClick={() => setMenuOpen(false)}>Login</LoginButton>
          )}
        </AuthSection>
      </Menu>
    </Nav>
  );
};

// Keyframes & Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.03); }
  100% { transform: scale(1); }
`;

// Styled Components
const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 3rem;
  background-color: #F8FAFC;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: sticky;
  top: 0;
  z-index: 1000;
  animation: ${fadeIn} 0.5s ease-out;

  @media (max-width: 768px) {
    padding: 1rem 1.5rem;
  }
`;

const Logo = styled(Link)`
  font-size: 2.2rem;
  font-weight: 900;
  color: #1F61B8;
  text-decoration: none;
  letter-spacing: -1px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05) rotate(-2deg);
  }
`;

const NavList = styled.ul`
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2.5rem;
  
  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
    width: 100%;
    margin-bottom: 2rem;
    align-items: flex-start;
  }
`;

const NavLink = styled(Link)`
  font-size: 1.1rem;
  font-weight: 600;
  color: #4A5568;
  text-decoration: none;
  position: relative;
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:hover {
    color: #1F61B8;
    transform: translateY(-2px);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 0;
    height: 4px;
    background-color: #FF6B00;
    border-radius: 2px;
    transition: width 0.3s ease-in-out;
  }
  
  &:hover::after {
    width: 100%;
  }
`;

const Button = styled(Link)`
  padding: 0.9rem 1.8rem;
  border-radius: 50px;
  font-weight: 700;
  text-decoration: none;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  user-select: none;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
`;

const LoginButton = styled(Button)`
  background-color: #1F61B8;
  color: #fff;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #1A5499;
  }
`;

const ProfileButton = styled(Button)`
  background-color: #28a745;
  color: #fff;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #218838;
  }
`;

const LogoutButton = styled.button`
  ${Button}
  background-color: #dc3545;
  color: #fff;
  border: none;
  cursor: pointer;
  
  &:hover {
    background-color: #c82333;
  }
`;

const ProviderButton = styled(Button)`
  background-color: #FF6B00;
  color: #fff;
  margin-left: 1rem;
  animation: ${pulse} 2s infinite;

  &:hover {
    background-color: #E65C00;
  }

  @media (max-width: 768px) {
    margin-left: 0;
    margin-top: 1rem;
    animation: none;
  }
`;

const Hamburger = styled.div`
  display: none;
  font-size: 2rem;
  cursor: pointer;
  color: #333;
  z-index: 1001;

  @media (max-width: 768px) {
    display: block;
  }
`;

const Menu = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;

  @media (max-width: 768px) {
    display: ${({ open }) => (open ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    width: 100%;
    background-color: #F8FAFC;
    padding: 2rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    transform: translateY(-20px);
    animation: ${fadeIn} 0.4s ease-out forwards;
  }
`;

const AuthSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }
`;

const UserMenu = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
    width: 100%;
  }
`;

const WelcomeText = styled.span`
  color: #1F61B8;
  font-weight: 600;
  margin-right: 1rem;

  @media (max-width: 768px) {
    margin-right: 0;
  }
`;

export default Navbar;
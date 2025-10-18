import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { FaUserPlus, FaSignInAlt, FaSignOutAlt, FaUserEdit } from 'react-icons/fa';
import { auth, db } from '../firebaseConfig';
import { collection, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';

const Login = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [pincode, setPincode] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setUser(user);
      if (user) {
        try {
          const docRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData(data);
            setName(data.name || '');
            setAddress(data.address || '');
            setPhone(data.phone || '');
            setPincode(data.pincode || '');
            setEmail(user.email || '');
          } else {
            setUserData(null);
            setEmail(user.email || '');
          }
        } catch (err) {
          console.error('Error fetching user data:', err.message);
        }
      } else {
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      if (isSignup) {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const newUser = userCredential.user;

        await setDoc(doc(db, 'users', newUser.uid), {
          name,
          address,
          phone,
          pincode,
          email,
          createdAt: new Date(),
        });

        setMessage('✅ Account created and user data saved to Firestore.');
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        setMessage('✅ Logged in successfully.');
      }
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      setMessage('✅ Signed out successfully.');
    } catch (error) {
      setMessage(`❌ ${error.message}`);
    }
  };

  const updateField = async (field, value) => {
    setMessage('');
    try {
      await updateDoc(doc(db, 'users', user.uid), { [field]: value });
      setMessage('✅ Profile updated.');
    } catch (err) {
      setMessage(`❌ Failed to update: ${err.message}`);
    }
  };

  return (
    <Container>
      <AuthBox>
        <Header>
          <HeaderIcon>{isSignup ? <FaUserPlus /> : user ? <FaUserEdit /> : <FaSignInAlt />}</HeaderIcon>
          <Title>{isSignup ? 'Create Account' : user ? 'Your Profile' : 'Login'}</Title>
        </Header>

        {user && userData ? (
          <ProfileForm>
            <ProfileInput
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                updateField('name', e.target.value);
              }}
              placeholder="Full Name"
            />
            <ProfileInput
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                updateField('address', e.target.value);
              }}
              placeholder="Address"
            />
            <ProfileInput
              type="tel"
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value);
                updateField('phone', e.target.value);
              }}
              placeholder="Phone"
            />
            <ProfileInput
              type="text"
              value={pincode}
              onChange={(e) => {
                setPincode(e.target.value);
                updateField('pincode', e.target.value);
              }}
              placeholder="Pincode"
            />
            <ProfileInput
              type="email"
              value={email}
              disabled
              style={{ cursor: 'not-allowed' }}
            />
            <SignOutButton onClick={handleSignOut}>
              <FaSignOutAlt /> Logout
            </SignOutButton>
          </ProfileForm>
        ) : (
          <AuthForm onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <AuthInput type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <AuthInput type="text" placeholder="Address" value={address} onChange={(e) => setAddress(e.target.value)} required />
                <AuthInput type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
                <AuthInput type="text" placeholder="Pincode" value={pincode} onChange={(e) => setPincode(e.target.value)} required />
              </>
            )}
            <AuthInput type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <AuthInput type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <SubmitButton type="submit">{isSignup ? 'Create Account' : 'Login'}</SubmitButton>
          </AuthForm>
        )}

        {!user && (
          <ToggleText>
            {isSignup ? 'Already have an account?' : "Don't have an account?"}{' '}
            <ToggleButton onClick={() => setIsSignup(!isSignup)}>
              {isSignup ? 'Login here' : 'Sign up here'}
            </ToggleButton>
          </ToggleText>
        )}

        {message && <Message>{message}</Message>}
      </AuthBox>
    </Container>
  );
};

// Styled Components
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  background-color: #F0F2F5; /* Light grey background */
  padding: 2rem;
  font-family: 'Inter', sans-serif;
`;

const AuthBox = styled.div`
  background: #fff;
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 450px;
  text-align: center;
  animation: ${fadeIn} 0.5s ease-out;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const HeaderIcon = styled.div`
  font-size: 3rem;
  color: #1F61B8; /* Brand blue */
  margin-bottom: 0.5rem;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  color: #333;
  margin: 0;
`;

const AuthForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const ProfileForm = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
`;

const AuthInput = styled.input`
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

const ProfileInput = styled(AuthInput)`
  cursor: text;
  background-color: #fff;
`;

const SubmitButton = styled.button`
  padding: 1rem;
  font-size: 1.1rem;
  background-color: #FF6B00; /* Neon orange accent */
  color: #fff;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  font-weight: bold;
  margin-top: 0.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background-color: #E65C00;
    transform: translateY(-3px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
  }
`;

const SignOutButton = styled(SubmitButton)`
  background-color: #dc3545;
  
  &:hover {
    background-color: #c82333;
  }
`;

const ToggleText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.95rem;
  color: #666;
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: #1F61B8;
  cursor: pointer;
  font-weight: bold;
  text-decoration: underline;
  transition: color 0.3s ease-in-out;
  
  &:hover {
    color: #0d4a99;
  }
`;

const Message = styled.p`
  margin-top: 1.5rem;
  font-weight: bold;
  color: ${({ children }) => (children.includes('✅') ? '#28a745' : '#dc3545')};
  background-color: ${({ children }) => (children.includes('✅') ? '#d4edda' : '#f8d7da')};
  padding: 0.8rem;
  border-radius: 10px;
`;

export default Login;
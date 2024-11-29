import React, { useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import { auth } from '../services/firebase'; // Firebase auth instance
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { db } from '../services/firebase'; // Firebase Firestore instance
import { setDoc, doc } from 'firebase/firestore'; // Firestore methods
import { Link, useNavigate } from 'react-router-dom'; // Added Link for navigation

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('role');
  const recaptchaRef = React.createRef();
  const key = import.meta.env.VITE_RECAPTCHA_KEY;

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = recaptchaRef.current.getValue();
    recaptchaRef.current.reset();

    if (token) {
      try {
        // Register the user in Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Save the user data in Firestore
        await setDoc(doc(db, "Users", user.uid), {
          name,
          email,
          role, // Save the role in Firestore
          createdAt: new Date(),
        });


        setName('');
        setEmail('');
        setPassword('');
        setRole('role'); 


        toast.success("User registered successfully", { position: "top-center" });

        navigate('/login');
      } catch (error) {
        toast.error(error.message, { position: "bottom-center" });
        setName('');
        setEmail('');
        setPassword('');
        setRole('role');
      }
    } else {
      alert('Please complete the reCAPTCHA');
    }
  };

  return (
    <div className="h-full min-h-screen flex items-center justify-center bg-backgroundBlue pt-28 pb-8 px-4 md:px-0">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Register</h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Role Selection */}
        <select
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        >
          <option value="role">Role</option>
          <option value="applicant">Applicant</option>
          <option value="recruiter">Recruiter</option>
        </select>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <div className="h-20 flex justify-center">
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={key}
            className="mt-4"
          />
        </div>

        <button type="submit" className="w-full mt-6 bg-Authbutton p-2 text-white py-3 rounded-lg hover:bg-blue-950 transition duration-300">
          Register
        </button>

        {/* Section for login link */}
        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?  
          <Link to="/login" className="text-blue-600 hover:underline">
            Login 
          </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default RegisterForm;
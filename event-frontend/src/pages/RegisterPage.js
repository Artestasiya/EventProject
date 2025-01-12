import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Surname is required';
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = 'Enter a valid email';
    if (!formData.password.trim() || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.dateOfBirth)
      newErrors.dateOfBirth = 'Date of Birth is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: new Date(formData.dateOfBirth)
            .toISOString()
            .split('T')[0],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setServerError(data.message || 'Server error. Please try again later.');
        return;
      }

      console.log('Registration successful:', data);
      navigate('/');
    } catch (error) {
      console.error('Error during registration:', error);
      setServerError('Server error. Please try again later.');
    }
  };

  return (
    <div>
      <h1>Registration</h1>
      {serverError && <p style={{ color: 'red' }}>{serverError}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          {errors.firstName && (
            <span style={{ color: 'red' }}>{errors.firstName}</span>
          )}
        </div>
        <div>
          <label>Surname:</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          {errors.lastName && (
            <span style={{ color: 'red' }}>{errors.lastName}</span>
          )}
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span style={{ color: 'red' }}>{errors.email}</span>}
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          {errors.password && (
            <span style={{ color: 'red' }}>{errors.password}</span>
          )}
        </div>
        <div>
          <label>Confirm password:</label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
          {errors.confirmPassword && (
            <span style={{ color: 'red' }}>{errors.confirmPassword}</span>
          )}
        </div>
        <div>
          <label>Date of Birth:</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
          {errors.dateOfBirth && (
            <span style={{ color: 'red' }}>{errors.dateOfBirth}</span>
          )}
        </div>
        <button type="submit">Register</button>
        <button type="button" onClick={() => navigate('/')}>
          Back
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;

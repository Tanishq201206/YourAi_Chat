import client from './client';

export const status = () => client.get('/api/auth/status').then(r => r.data);
export const logout = () => client.post('/api/auth/logout').then(r => r.data);


export const loginStep1 = (payload) =>
  client.post('/api/auth/login', payload).then(r => r.data); // sends OTP to email

export const loginStep2 = (payload) =>
  client.post('/api/auth/verify-login', payload).then(r => r.data); // sets cookie


export const registerUser = (payload) =>
  client.post('/api/auth/register', payload).then(r => r.data);

export const verifyRegister = (payload) =>
  client.post('/api/auth/verify-register', payload).then(r => r.data);


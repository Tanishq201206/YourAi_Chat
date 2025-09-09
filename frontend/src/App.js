import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import SidebarLayout from './layout/SidebarLayout';
import Profile from './pages/Profile';
import Welcome from './pages/Welcome';
import AdminDashboard from './pages/AdminDashboard';
import Company from './pages/Company';
import News from './pages/News';
import Terms from './pages/Terms';


export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/company" element={<Company />} />
      <Route path="/news" element={<News />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/chat/:id" element={<Chat />} />
      <Route path="/app" element={<SidebarLayout />}>
          <Route index element={<Welcome />} />
          <Route path=":id" element={<Chat />} />
          <Route path="admin" element={<AdminDashboard />} />
      </Route>
      <Route path="/account" element={<Profile />} />
    </Routes>
  );
}

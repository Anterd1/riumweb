import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Contact from '@/pages/Contact';
import Project from '@/pages/Project';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="project/:projectId" element={<Project />} />
      </Route>
    </Routes>
  );
}



export default App;


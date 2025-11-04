import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Contact from '@/pages/Contact';
import Project from '@/pages/Project';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import PostEditor from '@/pages/admin/PostEditor';
import ProtectedRoute from '@/components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogPost />} />
        <Route path="project/:projectId" element={<Project />} />
      </Route>
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/new"
        element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/posts/:id"
        element={
          <ProtectedRoute>
            <PostEditor />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}



export default App;


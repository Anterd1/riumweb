import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Contact from '@/pages/Contact';
import Project from '@/pages/Project';
import Blog from '@/pages/Blog';
import BlogPost from '@/pages/BlogPost';
import Sitemap from '@/pages/Sitemap';
import NotFound from '@/pages/NotFound';
import DisenoTuPaginaWeb from '@/pages/DisenoTuPaginaWeb';
import Login from '@/pages/admin/Login';
import Dashboard from '@/pages/admin/Dashboard';
import PostEditor from '@/pages/admin/PostEditor';
import Requests from '@/pages/admin/Requests';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import GoogleAnalytics from '@/components/GoogleAnalytics';

function App() {
  return (
    <>
      <GoogleAnalytics />
      <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="blog" element={<Blog />} />
        <Route path="blog/:id" element={<BlogPost />} />
        <Route path="project/:projectId" element={<Project />} />
        <Route path="diseno-tu-pagina-web" element={<DisenoTuPaginaWeb />} />
      </Route>
      
      {/* Sitemap - sin layout */}
      <Route path="/sitemap.xml" element={<Sitemap />} />
      
      {/* Admin Routes */}
      <Route path="/admin/login" element={<Login />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="requests" element={<Requests />} />
      </Route>
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
      
      {/* 404 - Catch all route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  );
}



export default App;


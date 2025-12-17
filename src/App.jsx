import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Contact from '@/pages/Contact';
import Login from '@/pages/admin/Login';
import ProtectedRoute from '@/components/ProtectedRoute';
import AdminLayout from '@/components/AdminLayout';
import PageLoader from '@/components/PageLoader';
import LanguageRedirect from '@/components/LanguageRedirect';
import BlogPostRedirect from '@/components/BlogPostRedirect';
import NewsPostRedirect from '@/components/NewsPostRedirect';

// Lazy load de páginas públicas
const Blog = lazy(() => import('./pages/Blog'));
const BlogPost = lazy(() => import('./pages/BlogPost'));
const News = lazy(() => import('./pages/News'));
const NewsPost = lazy(() => import('./pages/NewsPost'));
const Project = lazy(() => import('./pages/Project'));
const DisenoTuPaginaWeb = lazy(() => import('./pages/DisenoTuPaginaWeb'));
const Sitemap = lazy(() => import('./pages/Sitemap'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Lazy load de páginas admin
const Dashboard = lazy(() => import('./pages/admin/Dashboard'));
const NewsDashboard = lazy(() => import('./pages/admin/NewsDashboard'));
const PostEditor = lazy(() => import('./pages/admin/PostEditor'));
const Requests = lazy(() => import('./pages/admin/Requests'));
const Users = lazy(() => import('./pages/admin/Users'));
const Settings = lazy(() => import('./pages/admin/Settings'));
const NewsletterSubscriptions = lazy(() => import('./pages/admin/NewsletterSubscriptions'));

function App() {
  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Redirect root to /es */}
          <Route path="/" element={<LanguageRedirect />} />
          
          {/* Redirect old blog routes without language prefix */}
          <Route path="/blog" element={<LanguageRedirect />} />
          <Route path="/blog/:slug" element={<BlogPostRedirect />} />
          
          {/* Redirect old news routes without language prefix */}
          <Route path="/noticias" element={<LanguageRedirect />} />
          <Route path="/noticias/:slug" element={<NewsPostRedirect />} />
          
          {/* Language-specific routes */}
          <Route path="/:lang" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="contact" element={<Contact />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:slug" element={<BlogPost />} />
            <Route path="noticias" element={<News />} />
            <Route path="noticias/:slug" element={<NewsPost />} />
            <Route path="project/:projectId" element={<Project />} />
            <Route path="diseno-tu-pagina-web" element={<DisenoTuPaginaWeb />} />
          </Route>
          
          {/* Redirect old routes without language to /es - handled by Layout */}
      
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
        <Route path="news" element={<NewsDashboard />} />
        <Route path="requests" element={<Requests />} />
        <Route path="newsletter" element={<NewsletterSubscriptions />} />
        <Route path="users" element={<Users />} />
        <Route path="settings" element={<Settings />} />
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
      </Suspense>
    </>
  );
}



export default App;


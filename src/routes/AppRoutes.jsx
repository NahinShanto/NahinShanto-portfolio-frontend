import { Route, Routes } from 'react-router-dom'
import About from '../pages/About'
import Blog from '../pages/Blog'
import BlogDetail from '../pages/BlogDetail'
import Contact from '../pages/Contact'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import ProjectDetail from '../pages/ProjectDetail'
import Projects from '../pages/Projects'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:slug" element={<ProjectDetail />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:slug" element={<BlogDetail />} />
      <Route path="/contact" element={<Contact />} />

      {/* কোথাও লিংক নেই, শুধু URL টাইপ করে যাওয়া যায় */}
      <Route path="/login" element={<Login />} />

      {/* Owner only: dashboard পেজগুলো F7-এ এখানে যোগ হবে */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<div className="container-page section">Dashboard</div>} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}
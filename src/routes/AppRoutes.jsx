import { Route, Routes } from 'react-router-dom'
import DashboardLayout from '../components/dashboard/DashboardLayout'
import PublicLayout from '../components/layout/PublicLayout'
import About from '../pages/About'
import Blog from '../pages/Blog'
import BlogDetail from '../pages/BlogDetail'
import Contact from '../pages/Contact'
import Home from '../pages/Home'
import Login from '../pages/Login'
import NotFound from '../pages/NotFound'
import ProjectDetail from '../pages/ProjectDetail'
import Projects from '../pages/Projects'
import DashboardComments from '../pages/dashboard/DashboardComments'
import DashboardExperience from '../pages/dashboard/DashboardExperience'
import DashboardHome from '../pages/dashboard/DashboardHome'
import DashboardMessages from '../pages/dashboard/DashboardMessages'
import DashboardPosts from '../pages/dashboard/DashboardPosts'
import DashboardProfile from '../pages/dashboard/DashboardProfile'
import DashboardProjects from '../pages/dashboard/DashboardProjects'
import DashboardSkills from '../pages/dashboard/DashboardSkills'
import DashboardTaxonomy from '../pages/dashboard/DashboardTaxonomy'
import PostEditor from '../pages/dashboard/PostEditor'
import ProjectEditor from '../pages/dashboard/ProjectEditor'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* কোথাও লিংক নেই, শুধু URL টাইপ করে যাওয়া যায় */}
      <Route path="/login" element={<Login />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/dashboard/posts" element={<DashboardPosts />} />
          <Route path="/dashboard/posts/new" element={<PostEditor />} />
          <Route path="/dashboard/posts/:slug/edit" element={<PostEditor />} />
          <Route path="/dashboard/projects" element={<DashboardProjects />} />
          <Route path="/dashboard/projects/new" element={<ProjectEditor />} />
          <Route path="/dashboard/projects/:slug/edit" element={<ProjectEditor />} />
          <Route path="/dashboard/skills" element={<DashboardSkills />} />
          <Route path="/dashboard/experience" element={<DashboardExperience />} />
          <Route path="/dashboard/taxonomy" element={<DashboardTaxonomy />} />
          <Route path="/dashboard/comments" element={<DashboardComments />} />
          <Route path="/dashboard/messages" element={<DashboardMessages />} />
          <Route path="/dashboard/profile" element={<DashboardProfile />} />
        </Route>
      </Route>
    </Routes>
  )
}
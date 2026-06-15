import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import AdminLayout from './layouts/AdminLayout';
import LoginPage from './pages/Login';
import DashboardPage from './pages/Dashboard';
import PostListPage from './pages/PostList';
import PostEditPage from './pages/PostEdit';
import UserListPage from './pages/UserList';
import SettingsPage from './pages/Settings';
import AnimePage from './pages/AnimeManage';
import AlbumsPage from './pages/AlbumsManage';
import DiaryPage from './pages/DiaryManage';
import LinksPage from './pages/LinksManage';
import AboutPage from './pages/AboutManage';
import TagsPage from './pages/TagsManage';
import CategoriesPage from './pages/CategoriesManage';
import AnnouncementsPage from './pages/AnnouncementsManage';
import CommentPage from './pages/CommentManage';

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <ConfigProvider locale={zhCN} theme={{ token: { colorPrimary: '#E8738A', borderRadius: 8 } }}>
      <BrowserRouter basename="/admin">
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="posts" element={<PostListPage />} />
            <Route path="posts/new" element={<PostEditPage />} />
            <Route path="posts/:id/edit" element={<PostEditPage />} />
            <Route path="anime" element={<AnimePage />} />
            <Route path="albums" element={<AlbumsPage />} />
            <Route path="diary" element={<DiaryPage />} />
            <Route path="links" element={<LinksPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="users" element={<UserListPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="tags" element={<TagsPage />} />
            <Route path="categories" element={<CategoriesPage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="comments" element={<CommentPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

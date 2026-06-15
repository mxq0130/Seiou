import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Dropdown, Avatar, theme } from 'antd';
import {
  DashboardOutlined, FileTextOutlined, UserOutlined, SettingOutlined,
  LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined,
  PlayCircleOutlined, PictureOutlined, BookOutlined, LinkOutlined,
  IdcardOutlined, TagsOutlined, FolderOutlined, NotificationOutlined, MessageOutlined,
} from '@ant-design/icons';

const { Header, Sider, Content } = Layout;

const menuItems = [
  { key: '/', icon: <DashboardOutlined />, label: '仪表盘' },
  { key: '/posts', icon: <FileTextOutlined />, label: '文章管理' },
  { key: '/anime', icon: <PlayCircleOutlined />, label: '追番管理' },
  { key: '/albums', icon: <PictureOutlined />, label: '图集管理' },
  { key: '/diary', icon: <BookOutlined />, label: '日记管理' },
  { key: '/links', icon: <LinkOutlined />, label: '友链管理' },
  { key: '/about', icon: <IdcardOutlined />, label: '关于页' },
  { key: '/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/settings', icon: <SettingOutlined />, label: '站点设置' },
  { key: '/tags', icon: <TagsOutlined />, label: '标签管理' },
  { key: '/categories', icon: <FolderOutlined />, label: '分类管理' },
  { key: '/announcements', icon: <NotificationOutlined />, label: '公告管理' },
  { key: '/comments', icon: <MessageOutlined />, label: '评论管理' },
];

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = theme.useToken();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const selectedKey = '/' + location.pathname.split('/').filter(Boolean)[0];
  if (!selectedKey || selectedKey === '/') {
    return null; // will match '/' in menu
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed} theme="light" style={{ borderRight: '1px solid #f0f0f0' }}>
        <div style={{ height:64,display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:collapsed?18:20,color:token.colorPrimary,borderBottom:'1px solid #f0f0f0' }}>
          {collapsed ? '🌸' : '🌸 博客后台'}
        </div>
        <Menu mode="inline" selectedKeys={[location.pathname === '/' ? '/' : '/' + location.pathname.split('/').filter(Boolean)[0]]} items={menuItems} onClick={({ key }) => navigate(key)} style={{ borderRight: 0 }} />
      </Sider>
      <Layout>
        <Header style={{ padding:'0 24px',background:token.colorBgContainer,display:'flex',alignItems:'center',justifyContent:'space-between',borderBottom:'1px solid #f0f0f0' }}>
          <Button type="text" icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />} onClick={() => setCollapsed(!collapsed)} />
          <Dropdown menu={{ items: [{ key:'logout', icon:<LogoutOutlined />, label:'退出登录', onClick: handleLogout }] }}>
            <Avatar style={{ backgroundColor: token.colorPrimary, cursor: 'pointer' }} icon={<UserOutlined />} />
          </Dropdown>
        </Header>
        <Content style={{ margin: 24, padding: 24, background: token.colorBgContainer, borderRadius: token.borderRadius }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

import { Card, Col, Row, Statistic } from 'antd';
import { FileTextOutlined, UserOutlined, CommentOutlined, EyeOutlined } from '@ant-design/icons';

export default function DashboardPage() {
  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>仪表盘</h2>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="文章总数" value={42} prefix={<FileTextOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="注册用户" value={128} prefix={<UserOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="评论数" value={256} prefix={<CommentOutlined />} />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic title="今日访问" value={89} prefix={<EyeOutlined />} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="欢迎使用博客管理后台">
            <p>在这里你可以管理文章、用户、评论等内容。</p>
            <p>左侧菜单导航到各个管理模块。</p>
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card title="快捷操作">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <a href="/posts/new">✏️ 写新文章</a>
              <a href="/posts">📋 管理文章</a>
              <a href="/users">👥 管理用户</a>
              <a href="/settings">⚙️ 站点设置</a>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

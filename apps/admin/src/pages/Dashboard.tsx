import { useEffect, useState } from 'react';
import { Card, Row, Col, Statistic, List, Tag, Spin, Result } from 'antd';
import { FileTextOutlined, UserOutlined, FolderOutlined, ClockCircleOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function DashboardPage() {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.get('/stats')
      .then((res: any) => setData(res.data))
      .catch((err: any) => setError(err.message || '加载失败'));
  }, []);

  if (error) {
    return (
      <div>
        <h2 style={{ marginBottom: 24 }}>📊 仪表盘</h2>
        <Result status="error" title="数据加载失败" subTitle={error} />
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{ textAlign: 'center', padding: 100 }}>
        <Spin size="large" />
        <p style={{ marginTop: 16, color: '#999' }}>正在加载数据...</p>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ marginBottom: 24 }}>📊 仪表盘</h2>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}><Card><Statistic title="文章" value={data.posts} prefix={<FileTextOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="分类" value={data.categories} prefix={<FolderOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="用户" value={data.users} prefix={<UserOutlined />} /></Card></Col>
        <Col span={6}><Card><Statistic title="运行天数" value={data.runningDays} prefix={<ClockCircleOutlined />} /></Card></Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="📝 最近文章" size="small">
            {data.recentPosts?.length > 0 ? (
              <List dataSource={data.recentPosts} renderItem={(item: any) => (
                <List.Item extra={<Tag>{item.date}</Tag>}>{item.title}</List.Item>
              )} />
            ) : (
              <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>暂无文章</p>
            )}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="👤 最近用户" size="small">
            {data.recentUsers?.length > 0 ? (
              <List dataSource={data.recentUsers} renderItem={(item: any) => (
                <List.Item extra={<Tag color={item.role==='ADMIN'?'red':'blue'}>{item.role}</Tag>}>{item.username}</List.Item>
              )} />
            ) : (
              <p style={{ color: '#999', textAlign: 'center', padding: 20 }}>暂无用户</p>
            )}
          </Card>
        </Col>
      </Row>
    </div>
  );
}

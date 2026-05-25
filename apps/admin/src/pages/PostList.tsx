import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button, Space, Tag, Input, message, Popconfirm } from 'antd';
import { PlusOutlined, SearchOutlined } from '@ant-design/icons';
import { getPosts, deletePost } from '../api/posts';

export default function PostListPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [q, setQ] = useState('');
  const navigate = useNavigate();

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const res: any = await getPosts({ page, limit: 10, q });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPosts(); }, [page]);

  const handleDelete = async (id: number) => {
    try {
      await deletePost(id);
      message.success('删除成功');
      fetchPosts();
    } catch {
      message.error('删除失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '标题', dataIndex: 'title', ellipsis: true,
      render: (t: string, r: any) => <a onClick={() => navigate(`/posts/${r.id}/edit`)}>{t}</a>,
    },
    {
      title: '分类', dataIndex: ['category', 'name'], width: 100,
      render: (t: string) => t ? <Tag>{t}</Tag> : '-',
    },
    {
      title: '状态', dataIndex: 'status', width: 90,
      render: (s: string) => <Tag color={s === 'PUBLISHED' ? 'green' : 'orange'}>{s === 'PUBLISHED' ? '已发布' : '草稿'}</Tag>,
    },
    { title: '阅读', dataIndex: 'viewCount', width: 70 },
    {
      title: '发布时间', dataIndex: 'createdAt', width: 180,
      render: (t: string) => new Date(t).toLocaleString('zh-CN'),
    },
    {
      title: '操作', width: 160,
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" onClick={() => navigate(`/posts/${r.id}/edit`)}>编辑</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>文章管理</h2>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
        <Space>
          <Input
            prefix={<SearchOutlined />}
            placeholder="搜索文章..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onPressEnter={() => { setPage(1); fetchPosts(); }}
            style={{ width: 240 }}
          />
          <Button onClick={() => { setPage(1); fetchPosts(); }}>搜索</Button>
        </Space>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/posts/new')}>
          新建文章
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ current: page, total, onChange: setPage, showSizeChanger: false }}
      />
    </div>
  );
}

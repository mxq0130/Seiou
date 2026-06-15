import { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, message, Popconfirm } from 'antd';
import { CheckOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function CommentPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetch = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/comments/all');
      setData(res.data?.list || []);
    } catch { message.error('加载失败'); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetch(); }, []);

  const handleApprove = async (id: number, approve: boolean) => {
    await api.put(`/comments/${id}/approve`, { approved: approve });
    message.success(approve ? '已通过' : '已驳回');
    fetch();
  };
  const handleDelete = async (id: number) => {
    await api.delete(`/comments/${id}`);
    message.success('已删除');
    fetch();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户', dataIndex: ['user', 'username'] },
    { title: '内容', dataIndex: 'content', ellipsis: true, render: (s: string) => s?.length > 40 ? s.substring(0, 40) + '...' : s },
    { title: '类型', dataIndex: 'targetType', render: (s: string) => <Tag>{s}</Tag> },
    { title: '状态', dataIndex: 'approved', render: (v: boolean) => <Tag color={v ? 'green' : 'orange'}>{v ? '已审核' : '待审'}</Tag> },
    { title: '时间', dataIndex: 'createdAt', render: (s: string) => s ? new Date(s).toLocaleString('zh-CN') : '-' },
    { title: '操作', render: (_: any, r: any) => (
      <Space>
        {r.approved ? (
          <Button size="small" onClick={() => handleApprove(r.id, false)}>驳回</Button>
        ) : (
          <Button size="small" type="primary" icon={<CheckOutlined />} onClick={() => handleApprove(r.id, true)}>通过</Button>
        )}
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
          <Button size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>💬 评论管理</h2>
      <Table columns={columns} dataSource={data} rowKey="id" loading={loading} pagination={{ pageSize: 20 }} />
    </div>
  );
}

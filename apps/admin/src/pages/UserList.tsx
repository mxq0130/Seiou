import { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message, Popconfirm } from 'antd';
import api from '../api/client';

export default function UserListPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await api.get('/users', { params: { page, limit: 10 } });
      setData(res.data.list);
      setTotal(res.data.total);
    } catch {
      message.error('加载失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page]);

  const handleToggle = async (id: number, status: string) => {
    try {
      await api.put(`/users/${id}`, { status: status === 'ACTIVE' ? 'DISABLED' : 'ACTIVE' });
      message.success('更新成功');
      fetchUsers();
    } catch {
      message.error('操作失败');
    }
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username' },
    { title: '邮箱', dataIndex: 'email' },
    {
      title: '角色', dataIndex: 'role', width: 80,
      render: (r: string) => <Tag color={r === 'ADMIN' ? 'purple' : 'blue'}>{r === 'ADMIN' ? '管理员' : '用户'}</Tag>,
    },
    {
      title: '状态', dataIndex: 'status', width: 80,
      render: (s: string) => <Tag color={s === 'ACTIVE' ? 'green' : 'red'}>{s === 'ACTIVE' ? '正常' : '禁用'}</Tag>,
    },
    {
      title: '注册时间', dataIndex: 'createdAt', width: 180,
      render: (t: string) => new Date(t).toLocaleString('zh-CN'),
    },
    {
      title: '操作', width: 120,
      render: (_: any, r: any) => (
        <Space>
          <Popconfirm title="确定操作？" onConfirm={() => handleToggle(r.id, r.status)}>
            <Button size="small" danger={r.status === 'ACTIVE'}>
              {r.status === 'ACTIVE' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>用户管理</h2>
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

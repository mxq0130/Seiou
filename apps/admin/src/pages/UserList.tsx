import { useEffect, useState } from 'react';
import { Table, Tag, Space, Button, message, Popconfirm, Modal, Form, Input, Select } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function UserListPage() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [editOpen, setEditOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [editForm] = Form.useForm();

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

  const handleChangeRole = async (id: number, role: string) => {
    try {
      await api.put(`/users/${id}`, { role: role === 'ADMIN' ? 'USER' : 'ADMIN' });
      message.success(role === 'ADMIN' ? '已取消管理员' : '已设为管理员');
      fetchUsers();
    } catch {
      message.error('操作失败');
    }
  };

  const openEdit = (r: any) => {
    setEditing(r);
    editForm.setFieldsValue(r);
    setEditOpen(true);
  };

  const handleEditSave = async () => {
    const values = await editForm.validateFields();
    await api.put(`/users/${editing.id}`, values);
    message.success('用户信息已更新');
    setEditOpen(false);
    fetchUsers();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '用户名', dataIndex: 'username' },
    { title: '邮箱', dataIndex: 'email' },
    {
      title: '标签', dataIndex: 'label', width: 80,
      render: (l: string) => l ? <Tag color="orange">{l}</Tag> : <span style={{color:'#999'}}>-</span>,
    },
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
      title: '操作', width: 200,
      render: (_: any, r: any) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => openEdit(r)}>编辑</Button>
          <Popconfirm title="确定操作？" onConfirm={() => handleToggle(r.id, r.status)}>
            <Button size="small" danger={r.status === 'ACTIVE'}>
              {r.status === 'ACTIVE' ? '禁用' : '启用'}
            </Button>
          </Popconfirm>
          <Popconfirm title={r.role === 'ADMIN' ? '取消管理员权限？' : '授予管理员权限？'} onConfirm={() => handleChangeRole(r.id, r.role)}>
            <Button size="small" type={r.role === 'ADMIN' ? 'default' : 'primary'}>
              {r.role === 'ADMIN' ? '取消管理员' : '设为管理员'}
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
      <Modal title="编辑用户" open={editOpen} onOk={handleEditSave} onCancel={() => setEditOpen(false)} width={500}>
        <Form form={editForm} layout="vertical">
          <Form.Item name="username" label="用户名" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}><Input /></Form.Item>
          <Form.Item name="avatar" label="头像URL"><Input placeholder="https://..." /></Form.Item>
          <Form.Item name="label" label="用户标签"><Input placeholder="如：博主、摄影师、画师" /></Form.Item>
          <Form.Item name="role" label="角色"><Select options={[{ value: 'ADMIN', label: '管理员' }, { value: 'USER', label: '普通用户' }]} /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={[{ value: 'ACTIVE', label: '正常' }, { value: 'DISABLED', label: '禁用' }]} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

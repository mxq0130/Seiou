import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Tag, Switch } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function AnnouncementsPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetch = () => api.get('/announcements').then((r: any) => setData(r.data || []));
  useEffect(() => { fetch(); }, []);

  const openEdit = (r?: any) => {
    if (r) { setEditing(r); form.setFieldsValue(r); } else { setEditing(null); form.resetFields(); }
    setOpen(true);
  };
  const handleSave = async () => {
    const values = await form.validateFields();
    if (editing) { await api.put(`/announcements/${editing.id}`, values); message.success('更新成功'); }
    else { await api.post('/announcements', values); message.success('创建成功'); }
    setOpen(false); fetch();
  };
  const handleDelete = async (id: number) => {
    await api.delete(`/announcements/${id}`); message.success('已删除'); fetch();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '内容', dataIndex: 'content', ellipsis: true, render: (s: string) => s?.length > 50 ? s.substring(0, 50) + '...' : s },
    { title: '状态', dataIndex: 'active', render: (v: boolean) => <Tag color={v ? 'green' : 'default'}>{v ? '启用' : '禁用'}</Tag> },
    { title: '创建时间', dataIndex: 'createdAt', render: (s: string) => s ? new Date(s).toLocaleString('zh-CN') : '-' },
    { title: '操作', render: (_: any, r: any) => (
      <Space>
        <Button size="small" onClick={() => openEdit(r)}>编辑</Button>
        <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
          <Button size="small" danger>删除</Button>
        </Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>📢 公告管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit()} style={{ marginBottom: 16 }}>新建公告</Button>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
      <Modal title={editing ? '编辑公告' : '新建公告'} open={open} onOk={handleSave} onCancel={() => setOpen(false)} width={600}>
        <Form form={form} layout="vertical">
          <Form.Item name="content" label="内容" rules={[{ required: true }]}><Input.TextArea rows={4} /></Form.Item>
          <Form.Item name="active" label="启用" valuePropName="checked" initialValue={true}><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

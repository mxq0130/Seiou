import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function TagsPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const fetch = () => api.get('/tags').then((r: any) => setData(r.data || []));
  useEffect(() => { fetch(); }, []);

  const openEdit = (r?: any) => {
    if (r) { setEditing(r); form.setFieldsValue(r); } else { setEditing(null); form.resetFields(); }
    setOpen(true);
  };
  const handleSave = async () => {
    const values = await form.validateFields();
    if (editing) { await api.put(`/tags/${editing.id}`, values); message.success('更新成功'); }
    else { await api.post('/tags', values); message.success('创建成功'); }
    setOpen(false); fetch();
  };
  const handleDelete = async (id: number) => {
    await api.delete(`/tags/${id}`); message.success('已删除'); fetch();
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name' },
    { title: 'Slug', dataIndex: 'slug' },
    { title: '文章数', dataIndex: 'postCount' },
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
      <h2 style={{ marginBottom: 16 }}>🏷️ 标签管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit()} style={{ marginBottom: 16 }}>新建标签</Button>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
      <Modal title={editing ? '编辑标签' : '新建标签'} open={open} onOk={handleSave} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="slug" label="Slug" rules={[{ required: true }]} extra="英文小写+连字符"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

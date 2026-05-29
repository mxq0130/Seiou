import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function LinksPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = () => api.get('/links').then((r:any) => setData(r.data));
  useEffect(() => { load(); }, []);

  const onFinish = async (v: any) => {
    if (editing) await api.put(`/links/${editing.id}`, v);
    else await api.post('/links', v);
    message.success(editing ? '更新成功' : '添加成功');
    setOpen(false); setEditing(null); form.resetFields(); load();
  };

  const columns = [
    { title:'名称', dataIndex:'name' },
    { title:'URL', dataIndex:'url', ellipsis:true },
    { title:'描述', dataIndex:'description' },
    { title:'审核', dataIndex:'approved', render:(v:boolean) => v ? <Tag color="green">通过</Tag> : <Tag color="orange">待审</Tag> },
    { title:'操作', render:(_:any, r:any) => (
      <Space>
        <Button size="small" onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true); }}>编辑</Button>
        <Popconfirm title="确认删除?" onConfirm={async () => { await api.delete(`/links/${r.id}`); message.success('已删除'); load(); }}><Button size="small" danger>删除</Button></Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <h2>🔗 友链管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }} style={{ marginBottom:16 }}>添加友链</Button>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal title={editing?'编辑友链':'添加友链'} open={open} onCancel={() => { setOpen(false); setEditing(null); }} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="名称" rules={[{required:true}]}><Input /></Form.Item>
          <Form.Item name="url" label="URL" rules={[{required:true}]}><Input /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="avatar" label="头像URL"><Input /></Form.Item>
          <Form.Item name="approved" label="审核通过" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Switch, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function AlbumsPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = () => api.get('/albums').then((r:any) => setData(r.data));
  useEffect(() => { load(); }, []);

  const onFinish = async (v: any) => {
    if (editing) await api.put(`/albums/${editing.id}`, v);
    else await api.post('/albums', v);
    message.success(editing ? '更新成功' : '创建成功');
    setOpen(false); setEditing(null); form.resetFields(); load();
  };

  const columns = [
    { title:'名称', dataIndex:'name' },
    { title:'描述', dataIndex:'description' },
    { title:'照片数', dataIndex:'imageCount' },
    { title:'加密', dataIndex:'encrypted', render:(v:boolean) => v ? <Tag color="red">🔒 是</Tag> : <Tag>否</Tag> },
    { title:'操作', render:(_:any, r:any) => (
      <Space>
        <Button size="small" onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true); }}>编辑</Button>
        <Popconfirm title="确认删除?" onConfirm={async () => { await api.delete(`/albums/${r.id}`); message.success('已删除'); load(); }}><Button size="small" danger>删除</Button></Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <h2>📷 图集管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }} style={{ marginBottom:16 }}>新建相册</Button>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal title={editing?'编辑相册':'新建相册'} open={open} onCancel={() => { setOpen(false); setEditing(null); }} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="名称" rules={[{required:true}]}><Input /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="encrypted" label="加密" valuePropName="checked"><Switch /></Form.Item>
          <Form.Item name="coverUrl" label="封面URL"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Select, Space, message, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function DiaryPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const load = () => api.get('/diary').then((r:any) => setData(r.data));
  useEffect(() => { load(); }, []);

  const onFinish = async (v: any) => {
    await api.post('/diary', v);
    message.success('发表成功');
    setOpen(false); form.resetFields(); load();
  };

  const columns = [
    { title:'内容', dataIndex:'content', ellipsis:true },
    { title:'天气', dataIndex:'weather', width:60 },
    { title:'位置', dataIndex:'location', width:100 },
    { title:'时间', dataIndex:'createdAt', width:120, render:(d:string) => new Date(d).toLocaleDateString() },
    { title:'操作', width:100, render:(_:any, r:any) => (
      <Popconfirm title="确认删除?" onConfirm={async () => { await api.delete(`/diary/${r.id}`); message.success('已删除'); load(); }}><Button size="small" danger>删除</Button></Popconfirm>
    )},
  ];

  return (
    <div>
      <h2>📔 日记管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { form.resetFields(); setOpen(true); }} style={{ marginBottom:16 }}>写日记</Button>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal title="写日记" open={open} onCancel={() => setOpen(false)} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="content" label="内容" rules={[{required:true}]}><Input.TextArea rows={4} /></Form.Item>
          <Form.Item name="weather" label="天气"><Select options={['☀️','⛅','🌧️','❄️','🌙'].map(v=>({value:v,label:v}))} /></Form.Item>
          <Form.Item name="location" label="位置"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

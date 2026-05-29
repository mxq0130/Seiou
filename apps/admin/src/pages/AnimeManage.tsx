import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, Space, message, Popconfirm, Tag } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import api from '../api/client';

const statusColors: Record<string,string> = { watching:'blue', completed:'green', planning:'orange', dropped:'red' };
const statusLabels: Record<string,string> = { watching:'在看', completed:'已看', planning:'想看', dropped:'弃番' };

export default function AnimePage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  const load = () => api.get('/anime').then((r:any) => setData(r.data));
  useEffect(() => { load(); }, []);

  const onFinish = async (v: any) => {
    if (editing) await api.put(`/anime/${editing.id}`, v);
    else await api.post('/anime', v);
    message.success(editing ? '更新成功' : '添加成功');
    setOpen(false); setEditing(null); form.resetFields(); load();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/anime/${id}`);
    message.success('已删除');
    load();
  };

  const columns = [
    { title:'标题', dataIndex:'title', key:'title' },
    { title:'进度', key:'progress', render:(_:any,r:any) => `${r.progress}/${r.total}` },
    { title:'评分', dataIndex:'rating', key:'rating' },
    { title:'状态', dataIndex:'status', key:'status', render:(s:string) => <Tag color={statusColors[s]}>{statusLabels[s]}</Tag> },
    { title:'年份', dataIndex:'year' },
    { title:'工作室', dataIndex:'studio' },
    { title:'操作', key:'action', render:(_:any, r:any) => (
      <Space>
        <Button size="small" onClick={() => { setEditing(r); form.setFieldsValue(r); setOpen(true); }}>编辑</Button>
        <Popconfirm title="确认删除?" onConfirm={() => handleDelete(r.id)}><Button size="small" danger>删除</Button></Popconfirm>
      </Space>
    )},
  ];

  return (
    <div>
      <h2 style={{ marginBottom:16 }}>🎬 追番管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setEditing(null); form.resetFields(); setOpen(true); }} style={{ marginBottom:16 }}>添加番剧</Button>
      <Table dataSource={data} columns={columns} rowKey="id" />
      <Modal title={editing?'编辑番剧':'添加番剧'} open={open} onCancel={() => { setOpen(false); setEditing(null); }} onOk={() => form.submit()}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="title" label="标题" rules={[{required:true}]}><Input /></Form.Item>
          <Form.Item name="year" label="年份"><InputNumber style={{width:'100%'}} /></Form.Item>
          <Form.Item name="studio" label="工作室"><Input /></Form.Item>
          <Form.Item name="genre" label="类型"><Input /></Form.Item>
          <Form.Item name="rating" label="评分"><InputNumber min={0} max={10} step={0.1} style={{width:'100%'}} /></Form.Item>
          <Form.Item name="progress" label="已看"><InputNumber min={0} style={{width:'100%'}} /></Form.Item>
          <Form.Item name="total" label="总集数"><InputNumber min={1} style={{width:'100%'}} /></Form.Item>
          <Form.Item name="status" label="状态"><Select options={Object.entries(statusLabels).map(([k,v]) => ({value:k,label:v}))} /></Form.Item>
          <Form.Item name="note" label="备注"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="cover" label="封面URL"><Input /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

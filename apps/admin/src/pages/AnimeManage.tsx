import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, InputNumber, Select, message, Space, Tag, Card } from 'antd';
import { PlusOutlined, SyncOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function AnimePage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [biliUid, setBiliUid] = useState('');
  const [form] = Form.useForm();

  const fetch = () => api.get('/anime').then((r: any) => setData(r.data || []));
  useEffect(() => { fetch(); }, []);

  const handleSync = async () => {
    if (!biliUid) return message.warning('请输入 B站 UID');
    setSyncing(true);
    try {
      const res: any = await api.post('/anime/sync', { uid: biliUid });
      message.success(res.message);
      fetch();
    } catch (e: any) { message.error(e.message || '同步失败'); }
    finally { setSyncing(false); }
  };

  const openEdit = (r?: any) => {
    if (r) { setEditing(r); form.setFieldsValue(r); } else { setEditing(null); form.resetFields(); }
    setOpen(true);
  };

  const handleSave = async () => {
    const values = await form.validateFields();
    if (editing) { await api.put(`/anime/${editing.id}`, values); message.success('更新成功'); }
    else { await api.post('/anime', values); message.success('添加成功'); }
    setOpen(false); fetch();
  };

  const handleDelete = async (id: number) => {
    await api.delete(`/anime/${id}`); message.success('已删除'); fetch();
  };

  const columns = [
    { title: '标题', dataIndex: 'title' },
    { title: '进度', render: (_: any, r: any) => `${r.progress}/${r.total}` },
    { title: '评分', dataIndex: 'rating' },
    { title: '状态', dataIndex: 'status', render: (s: string) => <Tag color={s === 'WATCHING' ? 'blue' : s === 'COMPLETED' ? 'green' : s === 'PLANNING' ? 'orange' : 'red'}>{s}</Tag> },
    { title: '年份', dataIndex: 'year' },
    { title: '操作', render: (_: any, r: any) => (<Space><Button size="small" onClick={() => openEdit(r)}>编辑</Button><Button size="small" danger onClick={() => handleDelete(r.id)}>删除</Button></Space>) },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>📺 追番管理</h2>
      <Card size="small" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ whiteSpace: 'nowrap' }}>B站 UID:</span>
          <Input placeholder="输入 B站用户 UID" value={biliUid} onChange={e => setBiliUid(e.target.value)} style={{ width: 200 }} />
          <Button type="primary" icon={<SyncOutlined />} loading={syncing} onClick={handleSync}>同步追番列表</Button>
          <span style={{ fontSize: 12, color: '#999' }}>B站个人主页 URL 中的数字</span>
        </div>
      </Card>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit()} style={{ marginBottom: 16 }}>添加番剧</Button>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />
      <Modal title={editing ? '编辑番剧' : '添加番剧'} open={open} onOk={handleSave} onCancel={() => setOpen(false)} width={500}>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="bilibiliId" label="B站 ID"><Input placeholder="B站媒体ID" /></Form.Item>
          <Form.Item name="year" label="年份"><InputNumber style={{ width: '100%' }} /></Form.Item>
          <Form.Item name="studio" label="制作公司"><Input /></Form.Item>
          <Form.Item name="genre" label="类型"><Input placeholder="Action, Daily, Romance" /></Form.Item>
          <Form.Item name="cover" label="封面 URL"><Input placeholder="图片链接" /></Form.Item>
          <Space><Form.Item name="progress" label="已看"><InputNumber min={0} /></Form.Item><Form.Item name="total" label="总集数"><InputNumber min={0} /></Form.Item><Form.Item name="rating" label="评分"><InputNumber min={0} max={10} step={0.1} /></Form.Item></Space>
          <Form.Item name="status" label="状态" initialValue="WATCHING"><Select options={[{ value: 'WATCHING', label: '在看' }, { value: 'COMPLETED', label: '已看' }, { value: 'PLANNING', label: '想看' }, { value: 'DROPPED', label: '弃番' }]} /></Form.Item>
          <Form.Item name="note" label="备注"><Input.TextArea rows={2} /></Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

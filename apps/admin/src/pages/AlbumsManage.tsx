import { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Input, Space, message, Popconfirm, Upload } from 'antd';
import { PlusOutlined, UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function AlbumsPage() {
  const [data, setData] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [imgOpen, setImgOpen] = useState(false);
  const [selAlbum, setSelAlbum] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [imgUrl, setImgUrl] = useState('');
  const [form] = Form.useForm();

  const fetch = () => api.get('/albums').then((r: any) => setData(r.data || []));
  useEffect(() => { fetch(); }, []);

  const openEdit = (r?: any) => {
    if (r) { setEditing(r); form.setFieldsValue(r); } else { setEditing(null); form.resetFields(); }
    setOpen(true);
  };
  const handleSave = async () => {
    const values = await form.validateFields();
    if (editing) { await api.put(`/albums/${editing.id}`, values); message.success('更新成功'); }
    else { await api.post('/albums', values); message.success('创建成功'); }
    setOpen(false); fetch();
  };
  const handleDelete = async (id: number) => { await api.delete(`/albums/${id}`); message.success('已删除'); fetch(); };

  const openImages = async (album: any) => {
    setSelAlbum(album);
    try { const r = await api.get(`/albums/${album.id}/images`); setImages(r.data || []); } catch { setImages([]); }
    setImgUrl(''); setImgOpen(true);
  };
  const addImage = async () => {
    if (!imgUrl) return message.warning('请输入图片 URL');
    await api.post(`/albums/${selAlbum.id}/images`, { url: imgUrl });
    message.success('已添加');
    const r = await api.get(`/albums/${selAlbum.id}/images`); setImages(r.data || []);
    setImgUrl('');
  };
  const delImage = async (id: number) => {
    await api.delete(`/albums/${selAlbum.id}/images/${id}`);
    message.success('已删除'); setImages(images.filter(i => i.id !== id));
  };

  const columns = [
    { title: 'ID', dataIndex: 'id', width: 60 },
    { title: '名称', dataIndex: 'name' },
    { title: '描述', dataIndex: 'description' },
    { title: '照片数', dataIndex: 'imageCount' },
    {
      title: '操作', render: (_: any, r: any) => (
        <Space>
          <Button size="small" onClick={() => openEdit(r)}>编辑</Button>
          <Button size="small" onClick={() => openImages(r)}>图片</Button>
          <Popconfirm title="确定删除？" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>📷 图集管理</h2>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => openEdit()} style={{ marginBottom: 16 }}>新建相册</Button>
      <Table columns={columns} dataSource={data} rowKey="id" pagination={false} />

      <Modal title={editing ? '编辑相册' : '新建相册'} open={open} onOk={handleSave} onCancel={() => setOpen(false)}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="名称" rules={[{ required: true }]}><Input /></Form.Item>
          <Form.Item name="description" label="描述"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="coverUrl" label="封面 URL"><div style={{ display: 'flex', gap: 8 }}><Input placeholder="图片链接" style={{ flex: 1 }} /><Upload showUploadList={false} customRequest={({ file, onSuccess }: any) => {const fd = new FormData(); fd.append('file', file); api.post('/images/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: [(d: any) => d] }).then((r: any) => {if (r.code === 0) { form.setFieldValue('coverUrl', r.data.url); message.success('上传成功'); onSuccess?.(r.data); }}).catch(() => message.error('上传失败'));}}><Button icon={<UploadOutlined />}>上传封面</Button></Upload></div></Form.Item>
        </Form>
      </Modal>

      <Modal title={`管理图片 - ${selAlbum?.name || ''}`} open={imgOpen} onCancel={() => setImgOpen(false)} width={750} footer={null}>
        <div style={{ marginBottom: 16, display: 'flex', gap: 8 }}>
          <Input placeholder="图片 URL 或先上传获取链接" value={imgUrl} onChange={e => setImgUrl(e.target.value)} style={{ flex: 1 }} />
          <Button onClick={addImage} type="primary">添加 URL</Button>
          <Upload showUploadList={false} customRequest={({ file, onSuccess }: any) => {
            const fd = new FormData(); fd.append('file', file);
            api.post('/images/upload', fd, { headers: { 'Content-Type': 'multipart/form-data' }, transformRequest: [(d: any) => d] }).then((r: any) => {
              if (r.code === 0) { setImgUrl(r.data.url); message.success('上传成功'); onSuccess?.(r.data); }
            }).catch((e: any) => message.error('上传失败: ' + (e?.message || '未知错误')));
          }}>
            <Button icon={<UploadOutlined />}>本地上传</Button>
          </Upload>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {images.map((img: any) => (
            <div key={img.id} style={{ position: 'relative', borderRadius: 8, overflow: 'hidden', border: '1px solid #eee' }}>
              <img src={img.url} alt="" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} />
              <Button size="small" danger icon={<DeleteOutlined />} onClick={() => delImage(img.id)} style={{ position: 'absolute', top: 4, right: 4 }} />
            </div>
          ))}
        </div>
        {images.length === 0 && <p style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无图片，添加或上传吧</p>}
      </Modal>
    </div>
  );
}

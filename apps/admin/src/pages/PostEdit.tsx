import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Input, Button, Select, message, Space, Switch } from 'antd';
import { SaveOutlined, SendOutlined } from '@ant-design/icons';
import { getPost, createPost, updatePost } from '../api/posts';
import api from '../api/client';

export default function PostEditPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [categories, setCategories] = useState<{ value: number; label: string }[]>([]);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    api.get('/categories').then((res: any) => {
      setCategories((res.data || []).map((c: any) => ({ value: c.id, label: c.name })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (isEdit) {
      getPost(String(id)).then((res: any) => {
        const p = res.data;
        form.setFieldsValue({
          title: p.title,
          slug: p.slug,
          categoryId: p.categoryId,
          excerpt: p.excerpt,
          cover: p.cover,
          pinned: p.pinned || false,
        });
        setContent(p.content || '');
      }).catch((err: any) => message.error('加载文章失败: ' + (err.message || '未知错误')));
    }
  }, [id]);

  const handleSave = async (status: 'DRAFT' | 'PUBLISHED') => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      const data = { ...values, content, status };
      if (isEdit) {
        await updatePost(Number(id), data);
        message.success('更新成功');
      } else {
        await createPost(data);
        message.success('创建成功');
        navigate('/posts');
      }
    } catch (err: any) {
      if (err.message) message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>{isEdit ? '编辑文章' : '新建文章'}</h2>
      <Card>
        <Form form={form} layout="vertical">
          <Form.Item name="title" label="标题" rules={[{ required: true, message: '请输入标题' }]}>
            <Input placeholder="文章标题" size="large" />
          </Form.Item>
          <Form.Item name="slug" label="URL 标识" rules={[{ required: true, message: '请输入 URL 标识' }]} extra="英文小写+连字符，如 my-first-post。发布后请勿修改！">
            <Input placeholder="例如: my-first-post" />
          </Form.Item>
          <Form.Item name="categoryId" label="分类">
            <Select placeholder="选择分类" allowClear options={categories} />
          </Form.Item>
          <Form.Item name="cover" label="封面图" extra="填入图片 URL，或使用 Unsplash 免费图源">
            <Input placeholder="https://images.unsplash.com/photo-xxx?w=800&h=800&fit=crop" />
          </Form.Item>
          <Form.Item name="excerpt" label="摘要" extra="文章简述，会显示在列表卡片中">
            <Input.TextArea placeholder="可选，留空则自动截取正文开头" rows={2} />
          </Form.Item>
          <Form.Item name="pinned" label="置顶" valuePropName="checked" extra="置顶文章会显示在列表最前面（仅管理员可用）">
            <Switch />
          </Form.Item>
          <Form.Item label="正文" required>
            <Input.TextArea value={content} onChange={e => setContent(e.target.value)} placeholder="支持 Markdown 语法..." rows={20} />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button type="primary" icon={<SendOutlined />} loading={loading} onClick={() => handleSave('PUBLISHED')}>发布</Button>
              <Button icon={<SaveOutlined />} loading={loading} onClick={() => handleSave('DRAFT')}>保存草稿</Button>
              <Button onClick={() => navigate('/posts')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, Form, Input, Button, Select, message, Space, Tabs } from 'antd';
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
    // 加载分类列表
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
          <Form.Item
            name="slug"
            label="URL 标识"
            rules={[{ required: true, message: '请输入 URL 标识' }]}
            extra="文章的唯一英文标识，如 my-first-post。发布后请勿修改，否则链接会失效。"
          >
            <Input placeholder="例如: my-first-post" />
          </Form.Item>
          <Form.Item name="categoryId" label="分类">
            <Select placeholder="选择分类" allowClear options={categories} />
          </Form.Item>
          <Form.Item name="excerpt" label="摘要" extra="文章简述，会显示在列表卡片中">
            <Input.TextArea placeholder="可选，留空则自动截取正文开头" rows={2} />
          </Form.Item>
          <Form.Item label="正文" required>
            <Tabs
              items={[
                {
                  key: 'edit',
                  label: '编辑',
                  children: (
                    <Input.TextArea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="支持 Markdown 语法..."
                      rows={20}
                    />
                  ),
                },
                {
                  key: 'preview',
                  label: '预览',
                  children: (
                    <div
                      style={{ minHeight: 400, padding: 16, border: '1px solid #d9d9d9', borderRadius: 8, whiteSpace: 'pre-wrap' }}
                    >
                      {content || '暂无内容'}
                    </div>
                  ),
                },
              ]}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={() => handleSave('PUBLISHED')}
              >
                发布
              </Button>
              <Button
                icon={<SaveOutlined />}
                loading={loading}
                onClick={() => handleSave('DRAFT')}
              >
                保存草稿
              </Button>
              <Button onClick={() => navigate('/posts')}>取消</Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

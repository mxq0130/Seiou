import { useEffect, useState } from 'react';
import {
  Card, Form, Input, Button, message, Switch, Divider, Space, Row, Col, Spin, Upload,
} from 'antd';
import { SaveOutlined, UploadOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function SettingsPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get('/settings')
      .then((res: any) => {
        const s = res.data;
        // 数组字段转字符串，适配表单控件
        if (Array.isArray(s.keywords)) s.keywords = s.keywords.join(', ');
        if (Array.isArray(s.musicPlaylist)) s.musicPlaylist = s.musicPlaylist.map((m: any) => `${m.title} - ${m.artist}`).join('\n');
        form.setFieldsValue(s);
      })
      .catch(() => message.warning('无法加载设置，使用默认值'))
      .finally(() => setFetching(false));
  }, [form]);

  const handleSave = async (values: any) => {
    setLoading(true);
    try {
      // 字符串字段转数组再发送
      const payload = { ...values };
      if (typeof payload.keywords === 'string') {
        payload.keywords = payload.keywords.split(/[,，]/).map((s: string) => s.trim()).filter(Boolean);
      }
      if (typeof payload.musicPlaylist === 'string') {
        payload.musicPlaylist = payload.musicPlaylist.split('\n').map((line: string) => {
          const [title, artist] = line.split('-').map(s => s.trim());
          return { title: title || '', artist: artist || '' };
        }).filter((m: any) => m.title);
      }
      await api.put('/settings', payload);
      message.success('站点设置已保存 ✅');
    } catch (e: any) {
      message.error(e.message || '保存失败');
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <Spin size="large" style={{ display: 'block', margin: '100px auto' }} />;

  return (
    <div style={{ maxWidth: 900 }}>
      <h2 style={{ marginBottom: 24 }}>⚙️ 站点设置</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSave}
        initialValues={{
          title: '🌸 小破站',
          subtitle: 'わたしの部屋',
          description: '二次元风格个人博客 - 记录生活与技术',
          keywords: ['博客', '二次元', '前端', 'Astro'],
          author: 'まつざか ゆき',
          authorBio: '一个热爱二次元的前端开发者。',
          announcement: 'ブログへようこそ！',
          footer: '© 2025 まつざか ゆき. All Rights Reserved.',
          socialLinks: { github: '', bilibili: '', email: '' },
          sidebarWidgets: { stats: true, announcement: true, categories: true, tags: true, music: true, calendar: true },
          homepageSections: { hero: true, about: true, posts: true, stats: true, quickLinks: true },
        }}
      >
        {/* ===== 基本信息 ===== */}
        <Card title="📋 基本信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="站点标题" name="title" rules={[{ required: true }]}>
                <Input placeholder="🌸 小破站" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="副标题" name="subtitle">
                <Input placeholder="わたしの部屋" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="站点描述" name="description">
            <Input.TextArea rows={2} placeholder="用于 SEO 和首页展示" />
          </Form.Item>
          <Form.Item label="关键词" name="keywords">
            <Input placeholder="逗号分隔，用于 SEO" />
          </Form.Item>
        </Card>

        {/* ===== 站长信息 ===== */}
        <Card title="👤 站长信息" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="昵称" name="author">
                <Input />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="个人简介" name="authorBio">
            <Input.TextArea rows={3} placeholder="展示在首页个人卡片中" />
          </Form.Item>
        </Card>

        {/* ===== 社交链接 ===== */}
        <Card title="🔗 社交链接" style={{ marginBottom: 16 }}>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="GitHub" name={['socialLinks', 'github']}>
                <Input placeholder="https://github.com/..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Bilibili" name={['socialLinks', 'bilibili']}>
                <Input placeholder="https://space.bilibili.com/..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Email" name={['socialLinks', 'email']}>
                <Input placeholder="example@mail.com" />
              </Form.Item>
            </Col>
          </Row>
        </Card>

        {/* ===== 首页配置 ===== */}
        <Card title="🏠 首页配置" style={{ marginBottom: 16 }}>
          <Form.Item label="首页公告" name="announcement">
            <Input.TextArea rows={2} />
          </Form.Item>
          <Divider plain>首页轮播图</Divider>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>
            每行一个图片URL，支持格式：图片URL | 标题 | 副标题 | 链接
          </p>
          <Form.Item label="轮播图配置">
            <Form.List name="carouselSlides">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...rest }) => (
                    <Row key={key} gutter={8} style={{ marginBottom: 8 }}>
                      <Col span={8}>
                        <Form.Item {...rest} name={[name, 'image']} noStyle>
                          <Input placeholder="图片URL" />
                        </Form.Item>
                        <Upload showUploadList={false} customRequest={({ file, onSuccess }: any) => {
                          const fd = new FormData(); fd.append('file', file);
                          api.post('/images/upload', fd, { headers:{'Content-Type':'multipart/form-data'}, transformRequest:[(d:any)=>d] }).then((r:any) => {
                            if (r.code===0) {
                              const slides = form.getFieldValue('carouselSlides') || [];
                              slides[name] = { ...slides[name], image: r.data.url };
                              form.setFieldValue('carouselSlides', slides);
                              message.success('上传成功'); onSuccess?.(r.data);
                            }
                          }).catch(()=>message.error('上传失败'));
                        }}><Button size="small" icon={<UploadOutlined />} /></Upload>
                      </Col>
                      <Col span={5}>
                        <Form.Item {...rest} name={[name, 'title']} noStyle>
                          <Input placeholder="标题" />
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item {...rest} name={[name, 'subtitle']} noStyle>
                          <Input placeholder="副标题" />
                        </Form.Item>
                      </Col>
                      <Col span={4}>
                        <Form.Item {...rest} name={[name, 'link']} noStyle>
                          <Input placeholder="链接" />
                        </Form.Item>
                      </Col>
                      <Col span={2}>
                        <Button danger size="small" onClick={() => remove(name)}>删</Button>
                      </Col>
                    </Row>
                  ))}
                  <Button type="dashed" onClick={() => add({ image: '', title: '', subtitle: '', link: '' })} block>
                    + 添加轮播图
                  </Button>
                </>
              )}
            </Form.List>
          </Form.Item>
          <Divider plain>首页区块开关</Divider>
          <Space size="large" wrap>
            <Form.Item label="Hero大屏" name={['homepageSections', 'hero']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="个人卡片" name={['homepageSections', 'about']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="文章列表" name={['homepageSections', 'posts']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="统计数字" name={['homepageSections', 'stats']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="快捷入口" name={['homepageSections', 'quickLinks']} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
        </Card>

        {/* ===== 侧边栏配置 ===== */}
        <Card title="📱 侧边栏 Widget 开关" style={{ marginBottom: 16 }}>
          <Space size="large" wrap>
            <Form.Item label="站点统计" name={['sidebarWidgets', 'stats']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="公告栏" name={['sidebarWidgets', 'announcement']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="分类云" name={['sidebarWidgets', 'categories']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="标签云" name={['sidebarWidgets', 'tags']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="音乐播放器" name={['sidebarWidgets', 'music']} valuePropName="checked">
              <Switch />
            </Form.Item>
            <Form.Item label="日历" name={['sidebarWidgets', 'calendar']} valuePropName="checked">
              <Switch />
            </Form.Item>
          </Space>
        </Card>

        {/* ===== 音乐播放列表 ===== */}
        <Card title="🎵 音乐播放列表" style={{ marginBottom: 16 }}>
          <p style={{ fontSize: 12, color: '#999', marginBottom: 8 }}>每行一首，格式：歌名 - 歌手</p>
          <Form.Item name="musicPlaylist">
            <Input.TextArea rows={4} placeholder={`secret base ~君がくれたもの~ - あの花\n打上花火 - DAOKO × 米津玄師`} />
          </Form.Item>
        </Card>

        {/* ===== 页脚 ===== */}
        <Card title="📄 页脚" style={{ marginBottom: 24 }}>
          <Form.Item label="页脚文字" name="footer">
            <Input />
          </Form.Item>
        </Card>

        <Form.Item>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">
            保存全部设置
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

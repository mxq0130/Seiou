import { Card, Form, Input, Button, message } from 'antd';

export default function SettingsPage() {
  const handleSave = () => {
    message.success('设置已保存（演示）');
  };

  return (
    <div>
      <h2 style={{ marginBottom: 16 }}>站点设置</h2>
      <Card style={{ maxWidth: 600 }}>
        <Form layout="vertical" onFinish={handleSave}>
          <Form.Item label="站点名称" name="siteName" initialValue="二次元博客">
            <Input />
          </Form.Item>
          <Form.Item label="站点描述" name="siteDesc" initialValue="一个二次元风格的个人博客">
            <Input.TextArea rows={3} />
          </Form.Item>
          <Form.Item label="站长邮箱" name="email" initialValue="hello@example.com">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存设置</Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}

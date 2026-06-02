import { useEffect, useState } from 'react';
import { Card, Form, Input, InputNumber, Button, message, Row, Col, Spin } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import api from '../api/client';

export default function AboutPage() {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    api.get('/about').then((r:any) => form.setFieldsValue(r.data)).finally(() => setFetching(false));
  }, [form]);

  const handleSave = async (v: any) => {
    setLoading(true);
    await api.put('/about', v);
    message.success('已保存');
    setLoading(false);
  };

  if (fetching) return <Spin style={{ display:'block', margin:'100px auto' }} />;

  return (
    <div style={{ maxWidth:800 }}>
      <h2>👤 关于页管理</h2>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Card title="基本信息" style={{ marginBottom:16 }}>
          <Row gutter={16}>
            <Col span={12}><Form.Item name="name" label="昵称"><Input /></Form.Item></Col>
          </Row>
          <Form.Item name="bio" label="个人简介"><Input.TextArea rows={3} /></Form.Item>
          <Row gutter={16}>
            <Col span={8}><Form.Item name={['socialLinks','github']} label="GitHub"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name={['socialLinks','bilibili']} label="Bilibili"><Input /></Form.Item></Col>
            <Col span={8}><Form.Item name={['socialLinks','email']} label="Email"><Input /></Form.Item></Col>
          </Row>
        </Card>

        <Card title="技能栈" style={{ marginBottom:16 }}>
          <Form.List name="skills">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Row key={key} gutter={8} style={{ marginBottom:8 }}>
                    <Col span={10}><Form.Item {...rest} name={[name,'name']} noStyle><Input placeholder="技能名" /></Form.Item></Col>
                    <Col span={8}><Form.Item {...rest} name={[name,'level']} noStyle><InputNumber min={0} max={100} placeholder="熟练度" style={{width:'100%'}} /></Form.Item></Col>
                    <Col span={6}><Button danger onClick={() => remove(name)}>删除</Button></Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add({ name:'', level:50 })} block>+ 添加技能</Button>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="项目经历" style={{ marginBottom:16 }}>
          <Form.List name="projects">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Row key={key} gutter={8} style={{ marginBottom:8 }}>
                    <Col span={6}><Form.Item {...rest} name={[name,'name']} noStyle><Input placeholder="项目名" /></Form.Item></Col>
                    <Col span={8}><Form.Item {...rest} name={[name,'desc']} noStyle><Input placeholder="描述" /></Form.Item></Col>
                    <Col span={6}><Form.Item {...rest} name={[name,'url']} noStyle><Input placeholder="链接" /></Form.Item></Col>
                    <Col span={4}><Button danger onClick={() => remove(name)}>删除</Button></Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add({ name:'', desc:'', url:'' })} block>+ 添加项目</Button>
              </>
            )}
          </Form.List>
        </Card>

        <Card title="时间线">
          <Form.List name="timeline">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...rest }) => (
                  <Row key={key} gutter={8} style={{ marginBottom:8 }}>
                    <Col span={4}><Form.Item {...rest} name={[name,'year']} noStyle><Input placeholder="年份" /></Form.Item></Col>
                    <Col span={8}><Form.Item {...rest} name={[name,'event']} noStyle><Input placeholder="事件" /></Form.Item></Col>
                    <Col span={8}><Form.Item {...rest} name={[name,'desc']} noStyle><Input placeholder="描述" /></Form.Item></Col>
                    <Col span={4}><Button danger onClick={() => remove(name)}>删除</Button></Col>
                  </Row>
                ))}
                <Button type="dashed" onClick={() => add({ year:'', event:'', desc:'' })} block>+ 添加时间线</Button>
              </>
            )}
          </Form.List>
        </Card>

        <Form.Item style={{ marginTop:24 }}>
          <Button type="primary" htmlType="submit" icon={<SaveOutlined />} loading={loading} size="large">保存</Button>
        </Form.Item>
      </Form>
    </div>
  );
}

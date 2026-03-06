"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Card, Typography, Space, App } from "antd";
import { LockOutlined, ArrowLeftOutlined, UserOutlined } from "@ant-design/icons";
import { useUserStore } from "@/store/user";
import { useAuthStore } from "@/store/auth";

const { Title, Text, Link } = Typography;

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleSubmit = async (values: { username: string; password: string }) => {
    const success = await login(values);
    if (success) {
      message.success(t("auth.loginSuccess"));
      router.push("/analyze");
    } else {
      message.error(t("auth.loginError"));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <Card className="w-full max-w-md shadow-xl relative">
        <Button
          type="text"
          icon={<ArrowLeftOutlined />}
          onClick={() => router.push("/")}
          className="absolute left-2 top-2 z-10"
        />
        <div className="text-center mb-8">
          <Title level={2}>{t("auth.login")}</Title>
          <Text type="secondary">{t("app.description")}</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            name="username"
            label={t("auth.username")}
            rules={[{ required: true, message: "Please enter your username" }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t("auth.username")} size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("auth.password")}
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("auth.password")}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
              {t("auth.login")}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Space>
            <Text type="secondary">{t("auth.noAccount")}</Text>
            <Link onClick={() => router.push("/register")}>{t("nav.register")}</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}

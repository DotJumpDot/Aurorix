"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Form, Input, Button, Card, Typography, Space, App } from "antd";
import { MailOutlined, LockOutlined, UserOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { useUserStore } from "@/store/user";
import { useAuthStore } from "@/store/auth";

const { Title, Text, Link } = Typography;

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { register, isLoading } = useAuthStore();
  const { message } = App.useApp();
  const [form] = Form.useForm();

  const handleSubmit = async (values: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  }) => {
    if (values.password !== values.confirmPassword) {
      message.error("Passwords do not match");
      return;
    }

    const success = await register({
      email: values.email,
      username: values.username,
      password: values.password,
    });

    if (success) {
      message.success(t("auth.registerSuccess"));
      router.push("/analyze");
    } else {
      message.error(t("auth.registerError"));
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
          <Title level={2}>{t("auth.register")}</Title>
          <Text type="secondary">{t("app.description")}</Text>
        </div>

        <Form form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item
            name="username"
            label={t("auth.username")}
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input prefix={<UserOutlined />} placeholder={t("auth.username")} size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            label={t("auth.email")}
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder={t("auth.email")} size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label={t("auth.password")}
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 4, message: "Password must be at least 4 characters" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("auth.password")}
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label={t("auth.confirmPassword")}
            rules={[
              { required: true, message: "Please confirm your password" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Passwords do not match"));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder={t("auth.confirmPassword")}
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
              {t("auth.register")}
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center">
          <Space>
            <Text type="secondary">{t("auth.hasAccount")}</Text>
            <Link onClick={() => router.push("/login")}>{t("nav.login")}</Link>
          </Space>
        </div>
      </Card>
    </div>
  );
}

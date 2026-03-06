"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { Button, Card, Row, Col, Typography, Space } from "antd";
import { LoginOutlined, UserAddOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { useUserStore } from "@/store/user";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const { Title, Text, Paragraph } = Typography;

// Simple hydration helper
function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isAuthenticated, checkAuth } = useUserStore();
  const hydrated = useHydrated();

  useEffect(() => {
    if (hydrated) {
      checkAuth();
    }
  }, [hydrated, checkAuth]);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.push("/analyze");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="animate-pulse">
          <div className="h-8 w-32 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span className="text-xl font-bold text-gray-900 dark:text-white">
                {t("app.name")}
              </span>
            </div>
            <Space>
              <LanguageSwitcher />
              <ThemeSwitcher />
            </Space>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <Title
              level={1}
              className="!text-5xl md:!text-6xl font-bold mb-4 !text-gray-900 dark:!text-white"
            >
              {t("landing.title")}
            </Title>
            <Text className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
              {t("landing.subtitle")}
            </Text>
            <Paragraph className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              {t("landing.description")}
            </Paragraph>
          </div>

          {/* Auth Buttons */}
          <div className="flex justify-center gap-4 mb-16">
            <Button
              type="primary"
              size="large"
              icon={<LoginOutlined />}
              onClick={() => router.push("/login")}
              className="h-14 px-8 text-lg"
            >
              {t("nav.login")}
            </Button>
            <Button
              size="large"
              icon={<UserAddOutlined />}
              onClick={() => router.push("/register")}
              className="h-14 px-8 text-lg"
            >
              {t("nav.register")}
            </Button>
          </div>

          {/* Features Section */}
          <div className="mt-16">
            <Row gutter={[24, 24]}>
              <Col xs={24} md={8}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📊</div>
                    <Title level={4}>{t("landing.features.characterCount")}</Title>
                    <Text className="text-gray-600 dark:text-gray-400">
                      {t("landing.features.characterCountDesc")}
                    </Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📈</div>
                    <Title level={4}>{t("landing.features.wordDensity")}</Title>
                    <Text className="text-gray-600 dark:text-gray-400">
                      {t("landing.features.wordDensityDesc")}
                    </Text>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card className="h-full hover:shadow-lg transition-shadow duration-300">
                  <div className="text-center">
                    <div className="text-4xl mb-4">📖</div>
                    <Title level={4}>{t("landing.features.readingLevel")}</Title>
                    <Text className="text-gray-600 dark:text-gray-400">
                      {t("landing.features.readingLevelDesc")}
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Get Started CTA */}
          <div className="text-center mt-16">
            <Button
              type="primary"
              size="large"
              icon={<ArrowRightOutlined />}
              iconPlacement="end"
              onClick={() => router.push("/register")}
              className="h-14 px-10 text-lg bg-blue-600 hover:bg-blue-700"
            >
              {t("landing.getStarted")}
            </Button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Text className="text-gray-500 dark:text-gray-400">
            © 2026 Aurorix. All rights reserved.
          </Text>
        </div>
      </footer>
    </div>
  );
}

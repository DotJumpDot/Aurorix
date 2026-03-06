"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import {
  Card,
  Input,
  Button,
  Typography,
  Space,
  Row,
  Col,
  Statistic,
  Divider,
  Spin,
  Modal,
  App,
  message,
  Progress,
} from "antd";
import {
  SendOutlined,
  ClearOutlined,
  LogoutOutlined,
  MenuOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useUserStore } from "@/store/user";
import { useAuthStore } from "@/store/auth";
import { useThemeStore } from "@/store/theme";
import { useIdle } from "@/hooks/useIdle";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import { analysisService } from "@/service/analysis";
import type { AnalysisResult } from "@/type";

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

export default function AnalyzePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, isAuthenticated, checkAuth } = useUserStore();
  const { logout } = useAuthStore();
  const { mode } = useThemeStore();
  const { message } = App.useApp();

  const [text, setText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isSlid, setIsSlid] = useState(false);
  const [idleModalVisible, setIdleModalVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Idle detection hook
  const { isIdle, remainingTime, reset } = useIdle({
    timeout: "10s",
    warning: "2s",
    onIdle: () => {
      setIdleModalVisible(true);
    },
    onActive: () => {
      setIdleModalVisible(false);
      reset();
    },
    onWarning: (remaining) => {
      // Could show countdown in modal
    },
    immediate: true,
  });

  useEffect(() => {
    setMounted(true);
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push("/login");
    }
  }, [mounted, isAuthenticated, router]);

  // Handle keyboard submit
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleAnalyze();
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) {
      message.warning("Please enter some text to analyze");
      return;
    }

    setIsAnalyzing(true);

    try {
      const result = await analysisService.analyze({ text });
      if (result) {
        setAnalysisResult(result);
        setShowResults(true);
        setIsSlid(true);
        message.success("Analysis complete!");
      }
    } catch (error) {
      message.error("Analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleClear = () => {
    setText("");
    setShowResults(false);
    setAnalysisResult(null);
    setIsSlid(false);
  };

  const handleLogout = async () => {
    await logout();
    router.push("/");
  };

  const handleStayLoggedIn = () => {
    reset();
    setIdleModalVisible(false);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
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
              <Text className="text-gray-600 dark:text-gray-300">
                <UserOutlined /> {user?.username || user?.email}
              </Text>
              <Button icon={<LogoutOutlined />} onClick={handleLogout} danger>
                {t("nav.logout")}
              </Button>
              <LanguageSwitcher />
              <ThemeSwitcher />
            </Space>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="pt-24 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Input Section - Slides to left when analyzed */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isSlid ? "lg:w-1/3 min-w-[300px]" : "w-full"
              }`}
            >
              <Card className="h-full">
                <div className="mb-4">
                  <Title level={4}>{t("analysis.input")}</Title>
                  <Text type="secondary">Enter text and press Analyze or Ctrl+Enter</Text>
                </div>

                <TextArea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={t("analysis.input")}
                  rows={isSlid ? 20 : 15}
                  className="mb-4"
                  disabled={isAnalyzing}
                />

                <Space>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleAnalyze}
                    loading={isAnalyzing}
                    size="large"
                  >
                    {isAnalyzing ? t("analysis.analyzing") : t("analysis.analyze")}
                  </Button>
                  <Button icon={<ClearOutlined />} onClick={handleClear} size="large">
                    {t("analysis.clear")}
                  </Button>
                </Space>
              </Card>
            </div>

            {/* Results Section - Slides in from right */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                isSlid ? "w-full lg:w-[66.666667%] opacity-100" : "lg:w-0 opacity-0 overflow-hidden"
              }`}
              style={{ minWidth: isSlid ? "400px" : 0 }}
            >
              {showResults && analysisResult && (
                <Card className="h-full overflow-auto">
                  <Title level={3}>{t("analysis.results")}</Title>

                  {/* Basic Stats */}
                  <Row gutter={[16, 16]} className="mb-6">
                    <Col xs={12} sm={6}>
                      <Statistic
                        title={t("analysis.characterCount")}
                        value={analysisResult.character_analysis.total_characters}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title={t("analysis.wordCount")}
                        value={analysisResult.word_analysis.total_words}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title={t("analysis.sentenceCount")}
                        value={analysisResult ? getSentenceCount(analysisResult.text_content) : 0}
                      />
                    </Col>
                    <Col xs={12} sm={6}>
                      <Statistic
                        title={t("analysis.paragraphCount")}
                        value={analysisResult ? getParagraphCount(analysisResult.text_content) : 0}
                      />
                    </Col>
                  </Row>

                  <Divider />

                  {/* Reading Level */}
                  <div className="mb-6">
                    <Title level={4}>{t("analysis.readingLevel")}</Title>
                    <Row gutter={[16, 16]}>
                      <Col xs={12} sm={6}>
                        <Card size="small">
                          <Statistic
                            title={t("analysis.fleschKincaid")}
                            value={analysisResult.reading_level.flesch_kincaid_grade ?? 0}
                            precision={2}
                          />
                          <Text type="secondary" className="text-xs">
                            {getReadingLevelLabel(
                              analysisResult.reading_level.flesch_kincaid_grade ?? 0,
                              t
                            )}
                          </Text>
                        </Card>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Card size="small">
                          <Statistic
                            title={t("analysis.smog")}
                            value={analysisResult.reading_level.smog_index ?? 0}
                            precision={2}
                          />
                        </Card>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Card size="small">
                          <Statistic
                            title={t("analysis.colemanLiau")}
                            value={analysisResult.reading_level.coleman_liau_index ?? 0}
                            precision={2}
                          />
                        </Card>
                      </Col>
                      <Col xs={12} sm={6}>
                        <Card size="small">
                          <Statistic
                            title={t("analysis.ari")}
                            value={analysisResult.reading_level.automated_readability_index ?? 0}
                            precision={2}
                          />
                        </Card>
                      </Col>
                    </Row>
                    <div className="mt-4">
                      <Text strong>{t("analysis.average")}: </Text>
                      <Text>
                        {(analysisResult.reading_level.flesch_kincaid_grade +
                          analysisResult.reading_level.smog_index +
                          analysisResult.reading_level.coleman_liau_index +
                          analysisResult.reading_level.automated_readability_index) /
                          4}
                      </Text>
                    </div>
                  </div>

                  <Divider />

                  {/* Character Frequency */}
                  <div className="mb-6">
                    <Title level={4}>{t("analysis.characterFrequency")}</Title>
                    <div className="max-h-37 overflow-y-auto pr-2 custom-scrollbar">
                      {Object.entries(analysisResult.character_analysis?.character_frequency || {})
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 20)
                        .map(([char, count]) => (
                          <div key={char} className="flex items-center justify-between py-1">
                            <Text code>{char === " " ? "Space" : char}</Text>
                            <Progress
                              percent={Math.round(
                                (count / analysisResult.character_analysis.total_characters) * 100
                              )}
                              size="small"
                              style={{ width: 150 }}
                            />
                            <Text>{count}</Text>
                          </div>
                        ))}
                    </div>
                  </div>

                  <Divider />

                  {/* Word Density */}
                  <div>
                    <Title level={4}>{t("analysis.wordDensity")}</Title>
                    <div className="max-h-28 overflow-y-auto pr-2 custom-scrollbar">
                      {Object.entries(analysisResult.word_analysis?.word_frequency || {})
                        .sort(([, a], [, b]) => b - a)
                        .slice(0, 20)
                        .map(([word, count]) => (
                          <div key={word} className="flex items-center justify-between py-1">
                            <Text>{word}</Text>
                            <Progress
                              percent={Math.round(
                                (count / analysisResult.word_analysis.total_words) * 100
                              )}
                              size="small"
                              style={{ width: 150 }}
                            />
                            <Text>
                              {((count / analysisResult.word_analysis.total_words) * 100).toFixed(
                                1
                              )}
                              %
                            </Text>
                          </div>
                        ))}
                    </div>
                  </div>
                </Card>
              )}

              {!showResults && (
                <div className="h-full flex items-center justify-center">
                  <Card className="w-full text-center">
                    <Text type="secondary">{t("analysis.noResults")}</Text>
                  </Card>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Idle Modal */}
      <Modal
        title={t("idle.title")}
        open={idleModalVisible}
        footer={[
          <Button key="logout" onClick={handleLogout}>
            {t("idle.logout")}
          </Button>,
          <Button key="stay" type="primary" onClick={handleStayLoggedIn}>
            {t("idle.stayLoggedIn")}
          </Button>,
        ]}
        closable={false}
        mask={{ closable: false }}
      >
        <p>{t("idle.message")}</p>
        {remainingTime > 0 && (
          <p>{t("idle.autoLogout", { seconds: Math.ceil(remainingTime / 1000) })}</p>
        )}
      </Modal>
    </div>
  );
}

function getReadingLevelLabel(score: number, t: (key: string) => string): string {
  if (score <= 30) return t("analysis.veryDifficult");
  if (score <= 50) return t("analysis.difficult");
  if (score <= 60) return t("analysis.fairlyDifficult");
  if (score <= 70) return t("analysis.standard");
  if (score <= 80) return t("analysis.fairlyEasy");
  if (score <= 90) return t("analysis.easy");
  return t("analysis.veryEasy");
}

function getSentenceCount(text: string): number {
  const sentences = text.split(/[.!?]+\s*(?=[A-Z]|$)/);
  return sentences.filter((s) => s.trim().length > 0).length || 1;
}

function getParagraphCount(text: string): number {
  const paragraphs = text.split(/\n\s*\n/);
  return paragraphs.filter((p) => p.trim().length > 0).length || 1;
}

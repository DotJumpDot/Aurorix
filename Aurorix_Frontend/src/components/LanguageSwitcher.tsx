"use client";

import { Select } from "antd";
import { useTranslation } from "react-i18next";
import { GlobalOutlined } from "@ant-design/icons";
import { useThemeStore } from "@/store/theme";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { setLanguage } = useThemeStore();

  const handleChange = (value: string) => {
    i18n.changeLanguage(value);
    setLanguage(value as "en" | "th");
  };

  return (
    <Select
      value={i18n.language}
      onChange={handleChange}
      style={{ width: 100 }}
      suffixIcon={<GlobalOutlined />}
      options={[
        { value: "en", label: "EN" },
        { value: "th", label: "TH" },
      ]}
    />
  );
}

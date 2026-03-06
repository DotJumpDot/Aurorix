"use client";

import { Select } from "antd";
import { useThemeStore } from "@/store/theme";
import { SunOutlined, MoonOutlined, DesktopOutlined } from "@ant-design/icons";
import type { ThemeMode } from "@/type";

export default function ThemeSwitcher() {
  const { mode, setMode } = useThemeStore();

  const handleChange = (value: ThemeMode) => {
    setMode(value);
  };

  return (
    <Select
      value={mode}
      onChange={handleChange}
      style={{ width: 120 }}
      options={[
        {
          value: "light",
          label: (
            <span>
              <SunOutlined /> Light
            </span>
          ),
        },
        {
          value: "dark",
          label: (
            <span>
              <MoonOutlined /> Dark
            </span>
          ),
        },
        {
          value: "system",
          label: (
            <span>
              <DesktopOutlined /> System
            </span>
          ),
        },
      ]}
    />
  );
}

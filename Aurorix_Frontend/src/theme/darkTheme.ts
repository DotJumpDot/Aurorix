// Dark Theme Configuration for Ant Design

export const darkTheme = {
  token: {
    colorPrimary: "#60a5fa",
    colorSuccess: "#4ade80",
    colorWarning: "#fbbf24",
    colorError: "#f87171",
    colorInfo: "#60a5fa",
    colorBgBase: "#0f172a",
    colorBgContainer: "#1e293b",
    colorBgElevated: "#334155",
    colorTextBase: "#f1f5f9",
    colorTextSecondary: "#94a3b8",
    colorBorder: "#334155",
    colorBorderSecondary: "#1e293b",
    borderRadius: 8,
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
    },
    Modal: {
      borderRadius: 12,
    },
  },
};

export default darkTheme;

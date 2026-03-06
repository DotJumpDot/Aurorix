// Light Theme Configuration for Ant Design

export const lightTheme = {
  token: {
    colorPrimary: "#3b82f6",
    colorSuccess: "#22c55e",
    colorWarning: "#f59e0b",
    colorError: "#ef4444",
    colorInfo: "#3b82f6",
    colorBgBase: "#ffffff",
    colorBgContainer: "#f8fafc",
    colorBgElevated: "#ffffff",
    colorTextBase: "#1e293b",
    colorTextSecondary: "#64748b",
    colorBorder: "#e2e8f0",
    colorBorderSecondary: "#f1f5f9",
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

export default lightTheme;

import Starveil from "starveil";

// Lazy initialization of Starveil to avoid SSR issues
let sessionStorage: Starveil | null = null;

function getSessionStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!sessionStorage) {
    sessionStorage = new Starveil({
      name: "aurorix",
      expire: "24h",
    });
  }

  return sessionStorage;
}

// Session management helpers using Starveil
export const session = {
  setToken: (token: string) => {
    getSessionStorage()?.set("token", token);
  },

  getToken: () => {
    return getSessionStorage()?.get("token") as string | null;
  },

  setUser: (user: object) => {
    getSessionStorage()?.set("user", user);
  },

  getUser: <T = object>() => {
    return getSessionStorage()?.get("user") as T | null;
  },

  setApiKey: (apiKey: string) => {
    getSessionStorage()?.set("apiKey", apiKey);
  },

  getApiKey: () => {
    return getSessionStorage()?.get("apiKey") as string | null;
  },

  clear: () => {
    getSessionStorage()?.clear();
  },

  isAuthenticated: () => {
    return !!getSessionStorage()?.get("token");
  },
};

export default sessionStorage;

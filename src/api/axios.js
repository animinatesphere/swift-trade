import axios from "axios";

const api = axios.create({
  baseURL: "https://swift-jet-iota.vercel.app/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/** Auth endpoints that may legitimately return 401 — don't trigger token refresh. */
function isPublicAuthRequest(config) {
  const url = config?.url || "";
  return (
    url.includes("/auth/login") ||
    url.includes("/auth/register") ||
    url.includes("/auth/verify-email") ||
    url.includes("/auth/resend-verification") ||
    url.includes("/auth/refresh")
  );
}

const FIELD_KEY_MAP = {
  full_name: "fullName",
  email: "email",
  phone_number: "phone",
  password: "password",
  confirm_password: "confirm",
  token: "token",
};

function extractDetail(data) {
  return data?.detail ?? data?.message ?? data?.error;
}

export function getApiErrorMessage(
  error,
  fallback = "Something went wrong. Please try again.",
) {
  const data = error?.response?.data;
  if (!data) return error?.message || fallback;

  const detail = extractDetail(data);
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((item) =>
        typeof item === "string"
          ? item
          : item?.msg || item?.message || String(item),
      )
      .join(", ");
  }
  if (typeof detail === "object" && detail !== null) {
    return Object.values(detail).flat().join(", ");
  }
  return fallback;
}

/** Map FastAPI/Pydantic validation errors to form field keys. */
export function parseApiFieldErrors(error) {
  const data = error?.response?.data;
  const detail = extractDetail(data);
  const fields = {};
  let general = "";

  if (typeof detail === "string") {
    general = detail;
  } else if (Array.isArray(detail)) {
    detail.forEach((item) => {
      if (typeof item === "string") {
        general = general ? `${general}, ${item}` : item;
        return;
      }
      const loc = Array.isArray(item?.loc) ? item.loc : [];
      const apiKey = loc[loc.length - 1];
      const formKey = FIELD_KEY_MAP[apiKey];
      const msg = item?.msg || item?.message;
      if (formKey && msg) fields[formKey] = msg;
      else if (msg) general = general ? `${general}, ${msg}` : msg;
    });
  }

  if (!general && !Object.keys(fields).length) {
    general = getApiErrorMessage(error);
  }

  return { fields, general };
}

// Request Interceptor: Attach Access Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor: Handle 401s and Refresh Token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip refresh redirect for login/register etc. — let callers handle those 401s
    if (
      error.response?.status === 401 &&
      isPublicAuthRequest(originalRequest)
    ) {
      return Promise.reject(error);
    }

    // If error is 401 Unauthorized and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh_token");

      if (refreshToken) {
        try {
          // Attempt to refresh the token.
          // Note: If the backend endpoint is exactly /auth/refresh
          const response = await axios.post(
            "https://swift-jet-iota.vercel.app/api/auth/refresh",
            {
              refresh: refreshToken,
            },
          );

          const newAccess = response.data.access;
          localStorage.setItem("access_token", newAccess);

          if (response.data.refresh) {
            localStorage.setItem("refresh_token", response.data.refresh);
          }

          api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
          originalRequest.headers.Authorization = `Bearer ${newAccess}`;

          return api(originalRequest);
        } catch (refreshError) {
          // Refresh failed (e.g. refresh token expired or invalid)
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login"; // Force logout
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token — clear stale credentials and reject (don't reload if already on login)
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  },
);

export default api;

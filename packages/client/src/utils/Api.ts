import { RequestMethod, ApiResponse, RegisterUser, ErrorResponse } from "./Types";

const getAuthToken = () => {
  return localStorage.getItem("jwtToken");
};

const fetchWithAuth = async <T>(
  endpoint: string,
  method: RequestMethod,
  body: Record<string, unknown> = {},
): Promise<T> => {
  const token = getAuthToken();
  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: method,
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      if (response.status === 401) {
        try {
          await refresh();
          return await fetchWithAuth(endpoint, method, body);
        } catch (error) {
          console.error("Error refreshing token:", error);
          // todo redirect to login
          if (window.location.pathname !== "/tea-market/signUp") {
            window.location.href = "/tea-market/signUp";
            alert("Войдите в систему.");
          }
        }
      }
      const errorResponse: ErrorResponse = (await response.json()) as ErrorResponse;
      throw new Error(errorResponse.message);
    }
    return await (response.json() as Promise<T>);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

const login = async (email: string, password: string) => {
  const tokens = await fetchWithAuth<ApiResponse>("auth/sign-in", "POST", { email, password });
  localStorage.setItem("jwtToken", tokens.access_token);
  localStorage.setItem("refreshToken", tokens.refresh_token);

  const encodedRole = tokens.access_token.split(".")[1];
  const decodedParams = atob(encodedRole);

  type UserToken = {
    sub: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
  };

  const decodedRole = (JSON.parse(decodedParams) as UserToken).role;

  localStorage.setItem("userRole", decodedRole);
};

const logout = () => {
  localStorage.clear();
  window.location.reload();
};

const refresh = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await fetch(`/api/auth/refresh-token`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.clear();
      // todo redirect to login
      if (window.location.pathname !== "/tea-market/signUp") {
        window.location.href = "/tea-market/signUp";
        alert("Войдите в систему.");
      }
    }
    throw new Error(`HTTP error! status: ${String(response.status)}`);
  }

  const newTokens = (await response.json()) as ApiResponse;

  localStorage.setItem("jwtToken", newTokens.access_token);
  localStorage.setItem("refreshToken", newTokens.refresh_token);
};

const registerUser = async (body: RegisterUser) => {
  const tokens = await fetchWithAuth<ApiResponse>("auth/sign-up", "POST", body);
  localStorage.setItem("jwtToken", tokens.access_token);
  localStorage.setItem("refreshToken", tokens.refresh_token);

  const encodedRole = tokens.access_token.split(".")[1];
  const decodedParams = atob(encodedRole);

  type UserToken = {
    sub: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
  };

  const decodedRole = (JSON.parse(decodedParams) as UserToken).role;

  localStorage.setItem("userRole", decodedRole);
};

const fetchWithoutAuth = async <T>(
  endpoint: string,
  method: RequestMethod,
  body?: Record<string, unknown>,
): Promise<T> => {
  try {
    const response = await fetch(`/api/${endpoint}`, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (!response.ok) {
      const errorResponse: ErrorResponse = (await response.json()) as ErrorResponse;
      throw new Error(errorResponse.message);
    }
    return await (response.json() as Promise<T>);
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const api = {
  fetchWithAuth,
  fetchWithoutAuth,
  login,
  logout,
  registerUser,
};

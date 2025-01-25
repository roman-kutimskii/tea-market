import { useNavigate } from "react-router";
import { RequestMethod, ApiResponse, RegisterUser, ErrorResponse } from "./Types";

const getAuthToken = () => {
  return localStorage.getItem("jwtToken");
};

const fetchWithAuth = async <T>(
  setAuth: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: ReturnType<typeof useNavigate>,
  endpoint: string,
  method: RequestMethod,
  body?: Record<string, unknown>,
): Promise<T> => {
  const token = getAuthToken();
  const headers = {
    Authorization: token ? `Bearer ${token}` : "",
    "Content-Type": "application/json",
  };
  try {
    const response = await fetch(`/tea-market/api/${endpoint}`, {
      method: method,
      headers,
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      if (response.status === 401) {
        try {
          await refresh(setAuth, navigate);
          return await fetchWithAuth(setAuth, navigate, endpoint, method, body);
        } catch (error) {
          console.error("Error refreshing token:", error);

          if (window.location.pathname !== "/signIn") {
            await navigate("/signIn");
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

const login = async (
  setAuth: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: ReturnType<typeof useNavigate>,
  email: string,
  password: string,
) => {
  const tokens = await fetchWithAuth<ApiResponse>(setAuth, navigate, "auth/sign-in", "POST", { email, password });
  setAuth(true);
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

  const decodedData = JSON.parse(decodedParams) as UserToken;
  const userRole = decodedData.role;
  const userId = String(decodedData.sub);

  localStorage.setItem("userRole", userRole);
  localStorage.setItem("userId", userId);
};

const logout = () => {
  localStorage.clear();
  // window.location.reload();
};

const refresh = async (
  setAuth: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: ReturnType<typeof useNavigate>,
) => {
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await fetch(`/tea-market/api/auth/refresh-token`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    logout();
    setAuth(false);
    if (response.status === 401) {
      if (window.location.pathname !== "/signIn") {
        await navigate("/signIn");
      }
    }
    throw new Error(`HTTP error! status: ${String(response.status)}`);
  }

  const newTokens = (await response.json()) as ApiResponse;

  localStorage.setItem("jwtToken", newTokens.access_token);
  localStorage.setItem("refreshToken", newTokens.refresh_token);
};

const registerUser = async (
  setAuth: React.Dispatch<React.SetStateAction<boolean>>,
  navigate: ReturnType<typeof useNavigate>,
  body: RegisterUser,
) => {
  const tokens = await fetchWithAuth<ApiResponse>(setAuth, navigate, "auth/sign-up", "POST", body);
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
  await login(setAuth, navigate, body.email, body.password);
};

const fetchWithoutAuth = async <T>(
  endpoint: string,
  method: RequestMethod,
  body?: Record<string, unknown>,
): Promise<T> => {
  try {
    const response = await fetch(`/tea-market/api/${endpoint}`, {
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

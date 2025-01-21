import { RequestMethod, ApiResponse, CreateUser, User, RegisterUser } from "./Types";

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
          if (window.location.pathname !== "auth/sign-in") {
            window.location.href = "auth/sign-in";
            alert("Войдите в систему.");
          }
        }
      }
      throw new Error(`HTTP error! status: ${String(response.status)}`);
    }
    return await (response.json() as Promise<T>);
  } catch (error) {
    console.error(error);
    throw new Error(`HTTP error! status: ${String(error)}`);
  }
};

const login = async (email: string, password: string) => {
  const tokens = await fetchWithAuth<ApiResponse>("auth/sign-in", "POST", { email, password });
  localStorage.setItem("jwtToken", tokens.access_token);
  localStorage.setItem("refreshToken", tokens.refresh_token);

  const encodedRole = tokens.access_token.split(".")[1]; 
  const decodedParams = Buffer.from(encodedRole, "base64").toString("utf-8");

  type UserToken = {
    sub: number;
    email: string;
    role: string;
    iat: number;
    exp: number;
  }

  const decodedRole = (JSON.parse(decodedParams) as UserToken).role;

  localStorage.setItem("userRole", decodedRole);
};

const refresh = async () => {
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await fetch(`tea-market/api/refresh-token`, {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      localStorage.clear();
      // todo redirect to login
      if (window.location.pathname !== "auth/sign-in") {
        window.location.href = "auth/sign-in";
        alert("Войдите в систему.");
      }
    }
    throw new Error(`HTTP error! status: ${String(response.status)}`);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const newTokens: ApiResponse = await response.json();

  localStorage.setItem("jwtToken", newTokens.access_token);
  localStorage.setItem("refreshToken", newTokens.refresh_token);
};

const createUser = async (body: CreateUser): Promise<User> => {
  return fetchWithAuth<User>("auth/sign-up", "POST", body);
};

const registerUser = async (body: RegisterUser): Promise<User> => {
  return fetchWithAuth<User>("auth/sign-up", "POST", body);
};

export const api = {
  fetchWithAuth,
  login,
  createUser,
  registerUser,
};

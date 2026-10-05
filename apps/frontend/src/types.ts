export type UserRole = "ADMIN" | "USER";

export type ProxyStatus = "ONLINE" | "OFFLINE" | "PAUSED";

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: UserRole;
}

export interface Proxy {
  id: string;
  name: string;
  targetUrl: string;
  protocol: "HTTP" | "HTTPS" | "SOCKS5";
  status: ProxyStatus;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

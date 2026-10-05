import { useEffect, useMemo, useState } from "react";
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { authApi, proxyApi } from "./services/api";
import { Proxy, User } from "./types";

type Mode = "login" | "register";

const chartData = [
  { name: "Mon", requests: 1200 },
  { name: "Tue", requests: 1700 },
  { name: "Wed", requests: 1500 },
  { name: "Thu", requests: 2200 },
  { name: "Fri", requests: 2600 },
  { name: "Sat", requests: 2100 },
  { name: "Sun", requests: 2800 },
];

export default function App() {
  const [mode, setMode] = useState<Mode>("login");
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [user, setUser] = useState<User | null>(null);
  const [proxies, setProxies] = useState<Proxy[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    targetUrl: "",
    protocol: "HTTPS",
  });

  useEffect(() => {
    if (!token) {
      setUser(null);
      return;
    }

    authApi
      .me()
      .then((res) => {
        setUser(res.data.user);
        return proxyApi.list();
      })
      .then((res) => {
        setProxies(res.data);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
      });
  }, [token]);

  const activeCount = useMemo(() => {
    return proxies.filter((proxy) => proxy.status === "ONLINE").length;
  }, [proxies]);

  async function handleAuthSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const payload = { email: form.email, password: form.password, name: form.name || undefined };

      const res =
        mode === "login"
          ? await authApi.login({ email: form.email, password: form.password })
          : await authApi.register(payload);

      const { token: newToken, user: newUser } = res.data;

      localStorage.setItem("token", newToken);
      setToken(newToken);
      setUser(newUser);
    } catch (err: any) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleProxyCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await proxyApi.create({
        name: form.name,
        targetUrl: form.targetUrl,
        protocol: form.protocol,
      });

      const res = await proxyApi.list();
      setProxies(res.data);
      setForm((prev) => ({ ...prev, name: "", targetUrl: "", protocol: "HTTPS" }));
    } catch (err: any) {
      setError(err.response?.data?.error || "Failed to create proxy");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setProxies([]);
  }

  if (!token || !user) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-200">
        <div className="mx-auto max-w-md px-6 py-24">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">LetsGoPlay</p>
              <h1 className="mt-2 text-3xl font-bold text-white">
                {mode === "login" ? "Welcome back" : "Create account"}
              </h1>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4">
              {mode === "register" && (
                <input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Full name"
                  className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-3"
                />
              )}

              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email address"
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-3"
              />

              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Password"
                className="w-full rounded-xl border border-slate-600 bg-slate-900 px-3 py-3"
              />

              {error && <p className="text-sm text-red-400">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-500 px-4 py-3 font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-60"
              >
                {loading ? "Please wait..." : mode === "login" ? "Login" : "Create account"}
              </button>
            </form>

            <div className="mt-5 text-center">
              <button
                type="button"
                onClick={() => setMode(mode === "login" ? "register" : "login")}
                className="text-sm text-cyan-400 hover:text-cyan-300"
              >
                {mode === "login" ? "Need an account? Register" : "Already have an account? Login"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100">
      <div className="mx-auto max-w-7xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-cyan-400">Proxy Control</p>
            <h1 className="text-4xl font-bold text-white">LetsGoPlay Dashboard</h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1 text-sm">
              {user.email}
            </span>
            <button
              onClick={logout}
              className="rounded-xl border border-slate-600 px-4 py-2 hover:bg-slate-800"
            >
              Logout
            </button>
          </div>
        </header>

        <section className="mb-8 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-sm text-slate-400">Total Requests</p>
            <p className="mt-2 text-3xl font-bold">12.4k</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-sm text-slate-400">Active Proxies</p>
            <p className="mt-2 text-3xl font-bold">{activeCount}</p>
          </div>
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <p className="text-sm text-slate-400">Avg Latency</p>
            <p className="mt-2 text-3xl font-bold">132ms</p>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="mb-4 text-xl font-semibold">Traffic Overview</h2>

            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line type="monotone" dataKey="requests" stroke="#22d3ee" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-700 bg-slate-800 p-5">
            <h2 className="mb-4 text-xl font-semibold">Add Proxy</h2>

            <form onSubmit={handleProxyCreate} className="space-y-4">
              <input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Proxy name"
                className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
              />

              <input
                value={form.targetUrl}
                onChange={(e) => setForm({ ...form, targetUrl: e.target.value })}
                placeholder="Target URL"
                className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
              />

              <select
                value={form.protocol}
                onChange={(e) => setForm({ ...form, protocol: e.target.value })}
                className="w-full rounded border border-slate-600 bg-slate-900 px-3 py-2"
              >
                <option value="HTTPS">HTTPS</option>
                <option value="HTTP">HTTP</option>
                <option value="SOCKS5">SOCKS5</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-cyan-500 px-4 py-2 font-medium text-slate-900 hover:bg-cyan-400 disabled:opacity-60"
              >
                {loading ? "Please wait..." : "Save Proxy"}
              </button>

              {error && <p className="text-sm text-red-400">{error}</p>}
            </form>
          </div>
        </div>

        <section className="mt-8 rounded-2xl border border-slate-700 bg-slate-800 p-5">
          <h2 className="mb-4 text-xl font-semibold">Proxy List</h2>

          <div className="space-y-4">
            {proxies.length === 0 ? (
              <p className="text-slate-400">No proxies configured yet.</p>
            ) : (
              proxies.map((proxy) => (
                <div
                  key={proxy.id}
                  className="flex flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="font-medium">{proxy.name}</p>
                    <p className="text-sm text-slate-400">
                      {proxy.protocol} • {proxy.targetUrl}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        proxy.status === "ONLINE"
                          ? "bg-green-500/20 text-green-400"
                          : proxy.status === "OFFLINE"
                            ? "bg-red-500/20 text-red-400"
                            : "bg-yellow-500/20 text-yellow-400"
                      }`}
                    >
                      {proxy.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

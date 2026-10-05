import httpProxy from "http-proxy";

const proxy = httpProxy.createProxyServer({
  changeOrigin: true,
  secure: false,
});

export const proxyService = {
  testProxy: async (targetUrl: string): Promise<boolean> => {
    try {
      const response = await fetch(targetUrl, {
        method: "GET",
        headers: {
          "User-Agent": "LetsGoPlay-Proxy-Checker/1.0",
        },
      });

      return response.ok;
    } catch {
      return false;
    }
  },

  createProxyHandler: (target: string) => {
    return (req: any, res: any) => {
      proxy.web(req, res, { target });
    };
  },
};

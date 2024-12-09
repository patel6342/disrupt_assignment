import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {

  const env = loadEnv(mode, process.cwd());


  process.env = { ...process.env, ...env };
  const isLocal =  mode === 'development';

  return {
    plugins: [react()],
    server: isLocal
      ? {
          proxy: {
            "/api": process.env.VITE_PROXY_TARGET
          },
        }
      : {},
  };
});


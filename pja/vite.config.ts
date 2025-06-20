import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import basicSsl from "@vitejs/plugin-basic-ssl";

// 개발환경에서는 임시로 https사용하기
// 배포시 vercel가 자동으로 인증서 해줌
// https://vite.dev/config/
// https로 설정
export default defineConfig({
  plugins: [react(), basicSsl()],
  server: {
    https: {},
    proxy: {
      "/api": {
        target: "http://13.125.204.95:8080",
        // 배포하면 proxy삭제해도 됨
      },
    },
  },
});

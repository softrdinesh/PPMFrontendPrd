/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: "http://localhost:8080/api",
    // API_URL: "https://ppmbackendcode.onrender.com",
  },
};

export default nextConfig;

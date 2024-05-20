/** @type {import('tailwindcss').Config} */
const { nextui } = require("@nextui-org/react");
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        12: "12px", // define a custom font size of 12px
        14: "14px", // define a custom font size of 14px
        16: "16px", // define a custom font size of 16px
        20: "20px", // define a custom font size of 20px
        32: "32px", // define a custom font size of 32px
        48: "48px", // define a custom font size of 48px
      },
      colors: {
        primary: "#1778B0",
        darkGray: "#666687",
        darkGrayishBlue: "#8e8ea9",
        borderColor: "#eaeaef",
        inputBorderColor: "#dcdce4",
        darkRed: "#d02c20",
        white: "#fff",
      },
      borderColor: {},
      textColor: {
        // primary: "#1778B0",
      },
    },
  },
  darkMode: "class",
  plugins: [nextui()],
};

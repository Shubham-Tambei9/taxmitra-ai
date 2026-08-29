/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        railNavy: "#0B132B",
        railBlue: "#0284C7",
        railCyan: "#38BDF8",
        railGreen: "#10B981",
        railAmber: "#F59E0B",
        railSurface: "#1E293B",
      },
    },
  },
  plugins: [],
};

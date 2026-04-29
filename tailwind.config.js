/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  content: [
    ".app/components/**/*.{js,vue,ts}",
    ".app/layouts/**/*.vue",
    ".app/pages/**/*.vue",
    ".app/plugins/**/*.{js,ts}",
    ".app/app.vue",
    ".app/error.vue",
    "./nuxt.config.{js,ts}",
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  safelist: [
    // Add Syncfusion classes here to avoid purging
    /^e-/,
    /^e-btn/,
    /^e-input/,
    /^e-toolbar/,
    /^e-richtexteditor/,
    // Add more Syncfusion classes as needed
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      height: {
        "50vh": "50vh",
        "60vh": "60vh",
        "65vh": "65vh",
        "70vh": "70vh",
        "75vh": "75vh",
        "80vh": "80vh",
        "85vh": "85vh",
        "90vh": "90vh",
        "30r": "30rem",
        "15r": "10rem",
        "99vh": "99vh",
      },
      width: {
        // Thêm phần width vào extend
        "10p": "10%",
        "15p": "15%",
        "20p": "20%",
        "22p": "22%", // Định nghĩa w-22p
        "25p": "25%",
        "30p": "30%",
        "40p": "40%",
        "45p": "46%",
        "55p": "55%",
        "60p": "60%",
        "65p": "65%",
        "70p": "70%",
        "75p": "75%",
        "80p": "80%",
        "85p": "85%",
        "90p": "90%",
      },
      zIndex: {
        1500: "1500",
      },
      fontSize: {
        h1: "3.25rem", // text-5xl (khoảng 52px)
        h2: "2.5rem", // text-4xl (khoảng 40px)
        h3: "2rem", // text-3xl (khoảng 32px)
        h4: "1.5rem", // text-2xl (khoảng 24px)
        h5: "1.25rem", // text-xl (khoảng 20px)
        h6: "1rem", // text-base (khoảng 16px)
        p: "1rem", // text-base (khoảng 16px)
        span: "0.875rem", // text-sm (khoảng 14px)
        small: "0.75rem", // text-xs (khoảng 12px)
      },
      fontWeight: {
        h1: "100", // font-light
        h2: "100", // font-light
        h3: "100", // font-normal
        h4: "100", // font-normal
        h5: "100", // font-normal
        h6: "100", // font-normal
      },
      lineHeight: {
        p: "1.625", // leading-relaxed
      },
      textColor: {
        small: "#6B7280", // text-gray-500
      },
      scrollbar: {
        width: "2px",
        "&:hover": {
          width: "3px",
        },
      },
    },
    animation: {
      fadeIn: "fadeIn 1s ease-in-out",
      shimmer: "shimmer 2s infinite linear",
      pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      float: "float 8s ease-in-out infinite",
      "float-delayed": "float-delayed 10s ease-in-out infinite 2s",
      "scroll-down": "scroll-down 1.5s ease-in-out infinite",
    },
    keyframes: {
      shimmer: {
        "0%": { backgroundPosition: "-1000px 0" },
        "100%": { backgroundPosition: "1000px 0" },
      },
      float: {
        "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
        "50%": { transform: "translateY(-20px) rotate(5deg)" },
      },
      "float-delayed": {
        "0%, 100%": { transform: "translateY(0) rotate(0deg)" },
        "50%": { transform: "translateY(-30px) rotate(-5deg)" },
      },
      "scroll-down": {
        "0%": { transform: "translateY(0)", opacity: "1" },
        "100%": { transform: "translateY(8px)", opacity: "0" },
      },
    },
  },

  plugins: [require("daisyui")],
  variants: {
    extend: {
      display: ["print"], // Cho phép sử dụng print:block, print:hidden
      backgroundColor: ["print"], // Đảm bảo màu nền hiển thị
      borderColor: ["print"], // Đảm bảo viền hiển thị khi in
      textColor: ["print"], // Chữ màu đúng khi in
    },
  },
  daisyui: {
    themes: ["light"],
  },
};

import { compression } from "vite-plugin-compression2";

export default defineNuxtConfig({
  app: {
    head: {
      htmlAttrs: {
        lang: "vi",
        class: "h-full",
      },
      bodyAttrs: {
        class: "h-full",
      },
      title: "Enterprise Meeting Dashboard",
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
        { rel: "apple-touch-icon", sizes: "180x180", href: "/favicon.ico" },
        {
          rel: "icon",
          type: "image/png",
          sizes: "32x32",
          href: "/favicon.ico",
        },
        {
          rel: "icon",
          type: "image/png",
          sizes: "16x16",
          href: "/favicon.ico",
        },
      ],
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1.0, viewport-fit=cover",
        },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
        {
          name: "description",
          content:
            "Nền tảng toàn diện: Thiết kế Email chuyên nghiệp với drag & drop editor, gửi Email hàng loạt. Hoàn toàn miễn phí.",
        },
        {
          name: "keywords",
          content:
            "EM, thiết kế Email, gửi Email hàng loạt, Email marketing, drag drop editor, template Email, analytics Email, công cụ email marketing",
        },
        { name: "author", content: "EM" },
        { name: "robots", content: "index, follow" },
        { name: "theme-color", content: "#FFFFFF" },
        { name: "mobile-web-app-capable", content: "yes" },
        { name: "apple-mobile-web-app-status-bar-style", content: "default" },
        { name: "apple-mobile-web-app-title", content: "Email & File Tools" },
        {
          property: "og:title",
          content: "Thiết Kế Email & Meeting",
        },
        {
          property: "og:description",
          content:
            "Nền tảng toàn diện: Thiết kế Email chuyên nghiệp với drag & drop, gửi Email hàng loạt. Hoàn toàn miễn phí.",
        },
        { property: "og:type", content: "website" },
        { property: "og:url", content: "https://emtools.site" },
        { name: "monetag", content: "f0078ac69c56d44c1cb3f9ecc2a1fee5" },

        {
          property: "og:image",
          content:
            "https://res.cloudinary.com/dpcigceaq/image/upload/v1775893407/AdminAssets/ox1owzzrncplpxb9rmra.jpg",
        },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:site", content: "@enterprise-meeting" },
        {
          name: "twitter:title",
          content: "Thiết Kế Email & Meeting",
        },
        {
          name: "twitter:description",
          content:
            "Nền tảng toàn diện: Thiết kế Email chuyên nghiệp với drag & drop, gửi Email hàng loạt. Hoàn toàn miễn phí.",
        },
        {
          name: "twitter:image",
          content:
            "https://res.cloudinary.com/dpcigceaq/image/upload/v1775893407/AdminAssets/ox1owzzrncplpxb9rmra.jpg",
        },
      ],
      script: [
        // Google Analytics gtag
        {
          // src: "https://www.googletagmanager.com/gtag/js?id=G-W22VBQLJGT",
          // async: true,
        },
        {
          // innerHTML: `
          //   window.dataLayer = window.dataLayer || [];
          //   function gtag(){dataLayer.push(arguments);}
          //   gtag('js', new Date());
          //   gtag('config', 'G-W22VBQLJGT');
          // `,
        },
        // Monetag / data-zone script
        // {
        //   src: "https://quge5.com/88/tag.min.js",
        //   "data-zone": "220279",
        //   async: true,
        //   "data-cfasync": "false",
        // },
        // Google AdSense
        {
          // src: "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4065642758618862",
          // async: true,
          // crossorigin: "anonymous",
        },
        // AMP Auto Ads - temporarily disabled due to nested script issues
        // {
        //   innerHTML: `
        //     <script async custom-element="amp-auto-ads"
        //             src="https://cdn.ampproject.org/v0/amp-auto-ads-0.1.js">
        //     </script>
        //   `
        // }
      ],
    },
  },
  appConfig: {
    api: {
      baseUrl: process.env.API_URL,
    } as {
      baseUrl?: string;
      env?: string;
    },
    base: {
      secret: process.env.SECRET_KEY,
      baseUrl: process.env.BASE_URL,
    } as {
      secret?: string;
      baseUrl?: string;
    },
    cloudflare: {
      account_id: process.env.CLOUDFLARE_ACCOUNT_ID,
      hash: process.env.CLOUDFLARE_HASH,
      delivery_url: process.env.CLOUDFLARE_DELIVERY_URL,
      api_token: process.env.CLOUDFLARE_API_TOKEN,
      api_url: process.env.CLOUDFLARE_API_URL,
      url: process.env.CLOUDFLARE_URL,
    } as {
      account_id?: string;
      hash?: string;
      delivery_url?: string;
      api_token?: string;
      api_url?: string;
    },
    googleAuth: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
    } as {
      clientId?: string;
      redirectUri?: string;
    },
    payment: {
      mode: process.env.MODE_PAYMENT,
      enable_mode: process.env.ENABLE_PAYMENT == "true",
      enable_onepay: process.env.ENABLE_ONEPAY == "true",
      enable_payos: process.env.ENABLE_PAYOS == "true",
    } as {
      clientId?: string;
      enable_mode?: boolean;
      enable_onepay?: boolean;
      enable_payos?: boolean;
    },
  },
  devServer: {
    port: 4995,
  },
  compatibilityDate: "2025-07-15",
  devtools: {
    enabled: false,
    lighthouse: {
      disabled: true,
    },
  },
  modules: ["@pinia/nuxt", "@nuxtjs/sitemap"],
  pages: true,

  css: [
    "./app/assets/scss/style.scss",
    "./app/assets/scss/main.scss",
    "./app/assets/css/tailwind.css",
    "./app/assets/css/main.css",
    "./app/assets/css/icon.css",
    "./app/assets/css/layout.css",
    "./app/assets/css/transitions.css",
    "./app/assets/css/lenis.css",
  ],
  postcss: {
    plugins: {
      "@tailwindcss/postcss": {
        optimize: true,
        minify: true,
      },
      autoprefixer: {
        grid: true,
        flexbox: true,
      },
    },
  },

  // SCSS Configuration
  vite: {
    optimizeDeps: {
      include: [
        "axios",
        "js-cookie",
        "moment",
        "moment/dist/locale/vi",
        "socket.io-client",
        "@syncfusion/ej2-base",
        "lodash",
        "@syncfusion/ej2-vue-schedule",
        "@syncfusion/ej2-schedule",
        "@syncfusion/ej2-vue-calendars",
        "@syncfusion/ej2-vue-dropdowns",
        "@syncfusion/ej2-vue-inputs",
        "@syncfusion/ej2-vue-notifications",
        "vue-email",
      ],
    },

    plugins: [
      compression({
        include: /\.(html|xml|css|json|js|mjs|svg)$/,
        algorithms: ["gzip"],
        threshold: 10240,
        deleteOriginalAssets: false,
      }),
      compression({
        algorithms: ["brotliCompress"],
        threshold: 10240,
      }),
    ],

    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ["pinia", "vue"],
            utils: ["axios", "lodash", "moment"],
          },
        },
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "sass:math";`,
          charset: false,
        },
      },
    },
  },
  nitro: {
    preset: "cloudflare_pages",
  },
  pinia: {
    storesDirs: ["./stores/**"],
  },
  plugins: [],

  runtimeConfig: {
    public: {
      apiBase: process.env.API_URL,
      backendUrl: process.env.API_URL,
      urlCDN: process.env.BASE_API,
      realtimeServer: process.env.NUXT_PUBLIC_REALTIME_SERVER,
      API_IMAGE_BASE_URL: process.env.API_IMAGE_BASE_URL,
      DISABLE_SOCKET: process.env.DISABLE_SOCKET,
      useMockTickets: process.env.NUXT_PUBLIC_USE_MOCK_TICKETS || 'true',
    },
  },
  sitemap: {
    // Exclude private and dynamic routes from auto-generated sitemap
    exclude: [
      "/admin/**",
      "/auth/**",
      "/callback/**",
      "/dashboard/**",
      "/profile/**",
      "/settings/**",
      "/favicon.ico",
    ],
    // Default values for remaining URLs
    defaults: {
      changefreq: "weekly",
      priority: 0.5,
      lastmod: new Date().toISOString(),
    },
  },
  imports: {
    dirs: ["stores"],
    autoImport: true,
  },
  routeRules: {
    "/hr-and-employee/**": { ssr: true },
    "/portfolio/**": { ssr: true },
    "/hr-and-employee": { ssr: true },
    "/**": { ssr: false },
  },
});

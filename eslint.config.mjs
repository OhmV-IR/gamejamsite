import nextConfig from "eslint-config-next";

export default [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts"
    ]
  },

  // Next.js recommended rules
  ...nextConfig,

  // Custom rules
  {
    rules: {
      "@next/next/no-img-element": "off"
    }
  }
];
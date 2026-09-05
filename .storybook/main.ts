import type { StorybookConfig } from "@storybook/html-vite";

const config: StorybookConfig = {
  stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  addons: ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  framework: {
    name: "@storybook/html-vite",
    options: {},
  },
  viteFinal: async config => {
    // TS/JSX/TSX are transformed natively by Vite's built-in esbuild transform,
    // so no extra loader/plugin is needed here (replaces the webpack esbuild-loader rule).
    config.build = config.build || {};
    config.build.sourcemap = true; // replaces the webpack SourceMapDevToolPlugin above
    return config;
  },
};

export default config;

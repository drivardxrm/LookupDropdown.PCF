const webpack = require('webpack');
module.exports = {
  "stories": ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|ts|tsx)"],
  "addons": ["@storybook/addon-links", "@storybook/addon-essentials", "@storybook/addon-interactions"],
  "framework": {
    name: "@storybook/html-webpack5",
    options: {},
  },
  webpackFinal: async config => {
    config.devtool = false;
    config.resolve.fallback = config.resolve.fallback || {};
    config.resolve.fallback.fs = false;
    
    config.module.rules.push({
      test: /\.(ts|tsx|js|jsx)$/,
      loader: require.resolve("esbuild-loader"),
      options: {
      },
    });
    config.plugins.push(new webpack.SourceMapDevToolPlugin({
      append: '\n//# sourceMappingURL=[url]',
      fileContext: './',
      filename: '[file].map'
    }));
    return config;
  },
  features: {
    // storyStoreV7: true
  }
};
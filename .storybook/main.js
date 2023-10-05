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
    config.module.rules.forEach(rule => {
      if ("a.tsx".match(rule.test)) {
        //console.log(rule.use);
        rule.use = [{
          loader: 'esbuild-loader',
          options: {
            loader: 'tsx',
            // Or 'ts' if you don't need tsx
            target: 'es2015'
          }
        }];
      }
    });
    config.plugins.push(new webpack.SourceMapDevToolPlugin({
      append: '\n//# sourceMappingURL=[url]',
      fileContext: './',
      filename: '[file].map'
    }));
    return config;
  },
  features: {
    storyStoreV7: true
  }
};
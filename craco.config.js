const path = require('path');
const webpack = require('webpack');

module.exports = {
  style: {
    postcss: {
      plugins: [
        require('tailwindcss'),
        require('autoprefixer'),
      ],
    },
  },

  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.resolve = {
        ...(webpackConfig.resolve || {}),
        alias: {
          ...(webpackConfig.resolve?.alias || {}),
          'process/browser': path.resolve(__dirname, 'node_modules/process/browser.js'),
        },
        fallback: {
          ...(webpackConfig.resolve?.fallback || {}),
          process: require.resolve('process/browser'),
        },
        extensions: ['.js', '.jsx', '.mjs', '.cjs'],
      };

      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: 'javascript/auto',
      });

      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: 'process/browser',
        })
      );

      return webpackConfig;
    },
  },
};

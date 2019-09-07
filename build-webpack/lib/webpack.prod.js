const merge = require('webpack-merge');
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');
const baseConfig = require('./webpack.base');

const prodConfig = {
  mode: 'production',
  plugins: [
    new OptimizeCssAssetWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: cssnano,
    }),
    new HtmlWebpackExternalsPlugin({
      externals: [
        {
          module: 'react',
          entry: 'https://cdn.bootcss.com/react/16.9.0-rc.0/cjs/react.development.js',
          global: 'React',
        },
        {
          module: 'react-dom',
          entry: 'https://cdn.bootcss.com/react-dom/16.9.0-alpha.0/cjs/react-dom-server.browser.development.js',
          global: 'ReactDOM',
        },
      ],
    }),
  ],
  devServer: {
    contentBase: './dist',
    hot: true,
  },
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'common',
          chunks: 'all',
          minChunks: 2,
        },
      },
    },
  },
};

module.exports = merge(baseConfig, prodConfig);

const HappyPack = require('happypack')
const path = require('path')
const glob = require('glob')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin')
const friendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const SpeedMeasureWebpackPlugin = require('speed-measure-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')

const smp = new SpeedMeasureWebpackPlugin()

const setMPA = () => {
  const entry = {}
  const htmlWebpackPlugins = []

  const entryFiles = glob.sync(path.join(__dirname, './src/*/index.js'))

  Object.keys(entryFiles).map(index => {
    const entryFile = entryFiles[index]

    const match = entryFile.match(/src\/(.*)\/index\.js/)
    const pageName = match && match[1]

    entry[pageName] = entryFile
    htmlWebpackPlugins.push(
      new HtmlWebpackPlugin({
        template: path.join(__dirname, `src/${pageName}/index.html`),
        filename: `${pageName}.html`,
        chunks: ['vendors', `${pageName}`],
        inject: true,
        minify: {
          html5: true,
          collapseWhitespace: true,
          preserveLineBreaks: true,
          minifyCSS: true,
          minifyJS: true,
          removeComments: true
        }
      })
    )
  })

  return {
    entry,
    htmlWebpackPlugins
  }
}

const { entry, htmlWebpackPlugins } = setMPA()

module.exports = smp.wrap({
  entry: entry,
  output: {
    filename: '[name]_[chunkhash:8].js',
    path: path.join(__dirname, 'dist')
  },
  mode: 'production',
  performance: { hints: false },
  module: {
    rules: [
      {
        test: /.js$/,
        include: path.resolve('src'),
        use: [
          // 'babel-loader',
          'happypack/loader'
        ]
        // , 'eslint-loader'
      },
      {
        test: /.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        test: /.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          'less-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('autoprefixer')({
                  overrideBrowserslist: ['last 2 version', '>1%', 'ios 7']
                })
              ]
            }
          },
          {
            loader: 'px2rem-loader',
            options: {
              remUnit: 75,
              remPrecision: 8
            }
          }
        ]
      },
      {
        test: /.(woff|woff2|eot|ttf|otf)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]'
            }
          }
        ]
      },
      {
        test: /.(png|jpg|gif|jpeg|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name]_[hash:8].[ext]',
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name]_[contenthash:8].css'
    }),
    new OptimizeCssAssetWebpackPlugin({
      assetNameRegExp: /\.css$/g,
      cssProcessor: require('cssnano')
    }),
    new CleanWebpackPlugin(),
    // new BundleAnalyzerPlugin(),
    new HappyPack({
      loaders: ['babel-loader']
    }),
    // new HtmlWebpackExternalsPlugin({
    //   externals: [
    //     {
    //       module: 'react',
    //       entry: 'https://cdn.bootcss.com/react/16.9.0-rc.0/cjs/react.development.js',
    //       global: 'React'
    //     },
    //     {
    //       module: 'react-dom',
    //       entry: 'https://cdn.bootcss.com/react-dom/16.9.0-alpha.0/cjs/react-dom-server.browser.development.js',
    //       global: 'ReactDOM'
    //     }
    //   ]
    // })
    // new friendlyErrorsWebpackPlugin(),
    function() {
      this.hooks.done.tap('done', stats => {
        if (stats.compilation.errors.length > 1 && process.argv.indexOf('--watch') == -1) {
          console.log('build error')
          process.exit(1)
        }
      })
    }
  ].concat(htmlWebpackPlugins),
  optimization: {
    splitChunks: {
      minSize: 0,
      cacheGroups: {
        commons: {
          name: 'vendors',
          chunks: 'all',
          minChunks: 2
        }
      }
    }
  },
  // devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    hot: true
  }
  // stats: 'errors-only'
})

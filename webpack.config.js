const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin')


module.exports = {
  context: path.resolve(__dirname, './src'),
  mode: process.env.NODE_ENV,
  entry: {
    index: 'index.js'
  },
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: './js/[name].js'
  },
  resolve: {
    modules: [
      path.resolve('src'),
      path.resolve('src/js'),
      path.resolve('src/css'),
      path.resolve('src/scss'),
      path.resolve('src/assets'),
      path.resolve('src/images'),
      path.resolve('node_modules'),
    ],
    extensions: ['.js'],
  },
  optimization: { // 將使用的 node_module 套件用 vender.js 分開打包
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          name: 'vendor',       // 輸出的 js 名稱
          chunks: 'initial',
          enforce: true,
        },
      },
    },
  },
  devServer: {
    compress: true,
    port: 3000,
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
        include: path.resolve('src/css'),
        exclude: path.resolve('node_modules'),
      },
      // {
      //   test: /\.html$/,
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[path][name].[ext]',
      //       }
      //     },
      //   ],
      // },
      {
        test: /\.js$/,
        include: path.resolve('src'),
        exclude: path.resolve('node_modules'),
        use: {
          loader: 'babel-loader',
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        // use:[MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'sass-loader'],
        use:['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'], // 配合 base 64 圖片
      },
      {
        test: /\.(gif|png|jpe?g|svg)$/i,
        include: path.resolve('src/images'),
        exclude: path.resolve('node_modules'),
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 8192,
            },
          },
          {
            loader: 'image-webpack-loader',
            options: {
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              // optipng.enabled: false will disable optipng
              optipng: {
                enabled: false,
              },
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              },
              gifsicle: {
                interlaced: false,
              },
              // the webp option will enable WEBP
              webp: {
                quality: 75
              }
            },
          },
        ],
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/,
        include: path.resolve('src/assets'),
        exclude: path.resolve('node_modules'),
        use: {
          loader: 'file-loader',
          options: {
            name:'[path][name].[ext]?[hash:8]',
          },
        },
      },
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
      chunkFilename: './css/[id].css',
    }),
    new CopyPlugin([
      { from: 'assets', to: 'assets' },
    ]),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new HtmlWebpackPlugin({
      title: 'Webpack-React 前端自動化開發', // html title
      filename: 'index.html', // 輸出後檔名
      template: 'html/index.html', // 使用的模板內容
      viewport: 'width=device-width, initial-scale=1.0', // 網頁的 view-port content 設定
      chunks: ['vendor','index'] // 對應讀取的 js 檔案，這裡取的是 entry 的 key 值，會在模板中生成 script 載入 此 js
    }),
  ],
}
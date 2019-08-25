const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'[name]_[chunkhash:8].js',
        path:path.join(__dirname,'dist'),
    },
    mode:'production',
    module:{
        rules:[
            {
                test:/.js$/,
                use:'babel-loader'
            },
            {
                test:/.css$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test:/.less$/,
                use:[
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader'
                ]
            },
            {
                test:/.(png|jpg|gif|jpeg|svg)$/,
                use:[
                    'file-loader'
                ]
            },
            {
                test:/.(woff|woff2|eot|ttf|otf)$/,
                use:[
                    {
                        loader:'file-loader',
                        options:{
                            name:'[name]_[hash:8].[ext]'
                        }
                    }
                 ]
            },
            {
                test:/.(png|jpg|gif|jpeg|svg)$/,
                use:[
                   {
                       loader:'file-loader',
                       options:{
                           name:'[name]_[hash:8].[ext]'
                       }
                   }
                ]
            },
        ]
    },
    plugins:[
        new MiniCssExtractPlugin({
            filename:'[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetWebpackPlugin({
            assetNameRegExp:/\.css$/g,
            cssProcessor:require('cssnano')
        }),
        new HtmlWebpackPlugin({
            template:'./src/index.html',
            filename:'index.html',
            chunks:['index'],
            inject:true,
            minify:{
                collapseWhitespace: true,
                removeComments: true,
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true,
                useShortDoctype: true,
                collapseInlineTagWhitespace:true,
                preserveLineBreaks:false
            }
        })
    ],
    devServer:{
        contentBase:'./dist',
        hot:true
    }
}
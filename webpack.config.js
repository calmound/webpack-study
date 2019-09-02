const path = require('path')
const webpack = require('webpack')


module.exports = {
    entry:'./src/index.js',
    output:{
        filename:'bundle.js',
        path:path.join(__dirname,'dist'),
    },
    mode:'development',
    module:{
        rules:[
            {
                test:/.js$/,
                use:'babel-loader'
            },
            {
                test:/.css$/,
                use:[
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test:/.less$/,
                use:[
                    'style-loader',
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
                    'file-loader'
                ]
            },
            {
                test:/.(png|jpg|gif|jpeg|svg)$/,
                use:[
                   {
                       loader:'url-loader',
                       options:{
                           limit:1024
                       }
                   }
                ]
            },
        ]
    },
    plugins:[
        new webpack.HotModuleReplacementPlugin()
    ],
    devServer:{
        contentBase:'./dist',
        hot:true
    }
}
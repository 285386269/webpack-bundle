const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: './src/index.js',
        search: './src/search.js'
    },
    output: {
        path: path.join(__dirname, './dist'),
        filename: '[name]_[chunkhash:8].js'
    },
    mode: 'production',
    module: {
        rules: [
            {test: /\.js$/, use: 'babel-loader'},
            {test:/\.css$/, use: [ MiniCssExtractPlugin.loader, 'css-loader' ]},
            {
                test:/\.less$/, 
                use: [ 
                    MiniCssExtractPlugin.loader, 
                    'css-loader', 
                    'less-loader',
                    {
                        loader: 'postcss-loader',
                        options: {
                            plugins: () => [
                                require('autoprefixer')()
                            ]
                        }
                    },
                    {
                        loader: 'px2rem-loader',
                        options: {
                            remUnit: 75,
                            remPrecision: 8
                        }
                    },
                ]},
            {
                test:/\.(png|jpg|gif|jpeg)$/, 
                use: [{
                    loader: 'file-loader',
                    options: {
                        name:"[name]_[hash:8][ext]"
                    }
                }]
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [{
                    loader: 'file-loader',
                    options: {
                        name: "[name]_[hash:8][ext]"
                    }
                }]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src/search.html"),
            filename: "search.html",
            chunks: ['search'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src/index.html"),
            filename: "index.html",
            chunks: ['index'],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true, //是否去除空格
                preserveLineBreaks: false, //保持行中断
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }),
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin()
    ],
    devServer: {
        contentBase: './dist',
        hot: true
    }
}
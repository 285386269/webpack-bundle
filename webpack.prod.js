const glob = require('glob');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackExternalsPlugin = require('html-webpack-externals-plugin');

const setMPA = () => {
    const entry = {};
    const htmlWebpackPlugins = [];
    const entryFiles = glob.sync((path.join(__dirname, './src/*/index.js')));
    Object.keys(entryFiles).map(index => {
        const entryFile = entryFiles[index];
        const pageName = entryFile.match(/src\/(.*)\/index\.js/)[1];
        entry[pageName] = entryFile;

        htmlWebpackPlugins.push(new HtmlWebpackPlugin({
            template: path.join(__dirname, `src/${pageName}/index.html`),
            filename: `${pageName}.html`,
            chunks: ['vendors', pageName],
            inject: true,
            minify: {
                html5: true,
                collapseWhitespace: true,
                preserveLineBreaks: false,
                minifyCSS: true,
                minifyJS: true,
                removeComments: false
            }
        }));
    })
    console.log('entryFiles', entryFiles);
    return {
        entry,
        htmlWebpackPlugins
    }
}
const { entry, htmlWebpackPlugins} = setMPA();
module.exports = {
    entry,
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
        new MiniCssExtractPlugin({
            filename: '[name]_[contenthash:8].css'
        }),
        new OptimizeCssAssetsPlugin({
            assetNameRegExp: /\.css$/g,
            cssProcessor: require('cssnano')
        }),
        new CleanWebpackPlugin(),
        // new HtmlWebpackExternalsPlugin({
        //     externals: [
        //       {
        //         module: 'react',
        //         entry: 'https://11.url.cn/now/lib/16.2.0/react.min.js',
        //         global: 'React',
        //       },
        //       {
        //         module: 'react-dom',
        //         entry: 'https://11.url.cn/now/lib/16.2.0/react-dom.min.js',
        //         global: 'ReactDOM',
        //       },
        //     ],
        //   }),
        ...htmlWebpackPlugins,
    ],
    optimization: {
        splitChunks: {
            minSize: 0,
            cacheGroups: {
                commons: {
                    test: /(react|react-dom)/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    devServer: {
        contentBase: './dist',
        hot: true
    }
}
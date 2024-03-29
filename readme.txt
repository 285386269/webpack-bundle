babel-loader --- (用来支持es6、es7的语法新特性)
css-loader
less-loader
sass-loader
ts-loader --- (.ts -> .js)
file-loader --- (进行图片、字体等的打包)
raw-loader --- (将文件以字符串的形式导入)
thread-loader --- (多进程打包js和css)

Plugins 用于 bundle 文件的优化，资源管理和环境变量的注入，作用于整个构建过程

CommonsChunkPlugin --- (将 chunks 相同的代码提取到公共的 js 中)
CleanWebpackPlugin --- (清理构建目录)
ExtractTextWebpackPlugin --- (将 css 从 bundle 文件里提取成一个独立的 css 文件)
CopyWebpackPlugin --- (将文件或文件夹拷贝到构建的输出目录)
HtmlWebpackPlugin --- (创建 html 文件去承载输出的 bundle)
UglifyjsWebpackPlugin --- (压缩 js)
ZipWebpackPlugin --- (将打包出的资源生成一个zip包)

mode = development (设置 process.env.NODE_ENV 的值为 development)
    --- 默认开启 NamedChunksPlugin 和 NamedModulesPlugin
mode = production (设置 process.env.NODE_ENV 的值为 production)
    --- FlagDependencyUsagePlugin ... 优化
mode = none (不开启任何优化)

webpack 中的文件监听
启动 webpack 命令时，带上 --watch 参数；
也可以在配置 webpack.config.js 中设置 watch: true;
监听原理 --- 轮询判断最后的编辑时间，在某个时刻进行统一更新：
module.export = {
    watch: true,
    watchOptions: {
        //默认为空，不监听的文件或文件夹，支持正则匹配
        ignored: /node_modules/,
        //监听到变化后会等300ms再去执行，默认为300ms
        aggregateTimeout: 300,
        //判断文件是否发生变化，是通过不停询问系统指定文件有没有变化实现的，默认每秒1000次
        poll: 1000
    }
}

WDS 不刷新浏览器，通常和 HotModuleReplacementPlugin 插件一起使用，实现热更新；
WDS 不输出文件，而是放在内存中。
如何实现热更新？webpack-dev-server --open 和 webpack.HotModuleReplacementPlugin 即可。
也可以使用 webpack-dev-middleware 和 express / koa2 一起实现热更新 也可。

文件指纹？
index_51776.js 中的 51776 就是文件指纹，主要用来做版本管理。没有修改的文件，可以直接用缓存；
常见的文件指纹：
Hash(和整个项目的构建相关，只要项目文件修改，整个项目构建的hash就会修改 --- 图片文件可用)、
Chunkhash(和webpack打包的chunk相关，不同的entry会生成不同的chunk --- js bundle输出常用)、
Contenthash(根据文件内容来定义hash，针对css通常使用 Contenthash --- css 独立文件常用，需要考虑 MiniCssExtractPlugin.loader)。

代码压缩？
html 压缩 --- html-webpack-plugin，设置压缩参数
css 压缩 --- 使用 optimize-css-assets-webpack-plugin 和 cssnano(预处理器)
js 压缩 --- UglifyjsWebpackPlugin 在 webpack 4 中已内置，默认打包出来的 js 文件已经过压缩了。也可以自己下载这个插件，然后开启并行压缩；

PostCSS 插件？(它是一个后处理器)
使用这个插件 PostCSS 中的 autoprefixer 可以自动补齐 CSS3 前缀。根据 Can I Use 规则(https://caniuse.com/)

浏览器的分辨率？(rem)
移动端 CSS px 自动转换成 rem，使用 px2rem-loader。可以利用 lib-flexible.js。

静态资源内联？(jss/css/图片)
使用 raw-loader(建议使用0.5的版本) 可以内联 html 和 js。
内联html --- <script>${require('raw-loader!babel-loader!./meta.html')}</script>
内联js --- <script>${require('raw-loader!babel-loader!../node_modules/lib-flexible')}</script>
内联css --- 借助 style-loader，或者借助 html-inline-css-webpack-plugin(这个用的多)。

多页面应用？
它对SEO更加友好，分离功能和应用，单个页面加载会更快。

sourmap？
eval: 使用 eval 来包裹代码；
source-map：会产生 .map 文件；
cheap：不包含列的信息；
inline：sourcemap 内联在了js文件中，不单独生成.map文件；
module：包含 loader 的 sourcemap。

提取公共资源？
基础库分离，例如：react、react-dom 不打入 bundle 中，可以使用 html-webpack-externals-plugin 进行分离，
然后通过 CDN 方式引入。用法是：html-webpack-externals-plugin 分离 + html 中引入。

其它公共脚本，可以利用 SplitChunksPlugin 进行分离，替代 CommonsChunkPlugin(废弃掉)。
chunks 参数说明 --- async(异步引入)、initial(同步引入)、all(推荐)。

可以通过 splitChunks 将 react 和 react-dom 提取成公共基础包 vendors：
1) 引入 chunks: ['vendors', pageName],
2) 配置
optimization: {
    splitChunks: {
        minSize: 0,
        cacheGroups: { // 这个可以是多个属性，方便扩展
            vendors: {
                test: /(react|react-dom)/,
                name: 'vendors',
                chunks: 'all'
            }
        }
    }
},

也可以将其它公共代码，提取一个公共基础包，例如：commons 文件夹下的 js 文件多个地方用到：
1) 引入 chunks: ['vendors', 'commons', pageName],
2) 配置
splitChunks: {
    minSize: 0,
    cacheGroups: {
        commons: {
            name: 'commons',
            chunks: 'all',
            minChunks: 2
        }
    }
}

tree shaking？
在 webpack 4 中设置了 mode=production 时，会自动用上。前提是：es6语法。
利用 es6 模块的特点，进行 DCE 检测，然后借助 uglifyjs 擦除用不到的代码。

代码分割后的异步加载？
import('./text.js').then((Text)=> {
    Text: Text.default
})

webpack 和 ESLint 结合？
Airbnb：eslint-config-airbnb、eslint-config-airbnb-base、eslint-react...
国内也有自己来定制规范。一般为了避免重复造轮子，可以基于 eslint:recommend 配置进行改进，能够帮助发现代码错误的规则，全部开启。
帮助保持团队的代码风格统一，而不是限制开发体验。
ESLint 如何落地？可以和 CI/CD 系统集成，或者和 webpack 集成。
使用eslint-loader，构建时检查 js 规范。
npm install eslint eslint-plugin-import eslint-plugin-react eslint-plugin-jsx-a11y -D
npm install eslint-loader -D
npm install babel-eslint -D

webpack 打包组件和库？
一般分为压缩版和非压缩版，支持 AMD/CJS/ESM。

服务器端渲染 SSR？
浏览器的全局变量(node.js 中没有 document，window)
组件适配：组件内的内容做一些调整，例如：
1) import -> require；
2) ReactDOM.render -> module.exports = <Search></Search>；
3) 服务端针对 window 特殊处理(放在顶部)：
if(typeof window === 'undefined') {
    global.window = {};
}
请求适配：将 fetch 或者 ajax 发送请求的写法 isomorphic-fetch 或者 axios。

样式问题(node.js 无法解析样式模块)
方案1：服务端打包通过 ignore-loader 忽略掉 css 的解析(推荐)；
方案2：将 style-loader 替换成 isomorphic-style-loader。

我们可以在模板中设定占位符，然后动态插入组件，以此来应用客户端的样式；
数据同样可以通过设定占位符，然后动态添加到前端去。
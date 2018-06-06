const path = require('path'); // 引入path
const glob = require('glob');
const uglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 引入uglify插件 压缩代码  不需要安装
const htmlPlugin =  require('html-webpack-plugin'); //  打包HTML文件 插件
const extractTextPlugin = require("extract-text-webpack-plugin"); // CSS分离与图片路径处理
const PurifyCSSPlugin = require("purifycss-webpack"); // 消除未使用的css
const entry = require("./webpackConfig/entry_webpack.js");
const webpack = require("webpack");
const copyWebpackPlugin = require("copy-webpack-plugin");


// 声明一个路径  处理静态文件路径
console.log(encodeURIComponent(process.env.type));
if(process.env.type == "build"){
    var filePath = {
        publicPath: "http://genghongshuo.com.cn:1818/"
    }
}else{
    var filePath = {
        publicPath: "http://localhost:1818/"
    }
}

module.exports = {
    // devtool:'eval-source-map',
     // 入口文件配置
     entry:{
        entry:'./src/entry.js',
        jquery:'jquery',
        vue:'vue'
    },
    
    // 出口文件配置
    output:{
        path: path.resolve(__dirname,'dist'), // 出口地址 绝对路径
        filename:'[name].js', // 需要打包的文件名
        publicPath: filePath.publicPath  // 引用这个对象的publicPath属性 打包成功之后会从相对路径改变成绝对路径
    },
     // 模块
    module:{
        rules:[
            {
                test: /\.css$/,
                use: extractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: [
                        { loader: 'css-loader', options: { importLoaders: 1 } },
                        'postcss-loader'
                    ]
                })
            },{  // 配置图片
                test: /\.(png|jpg|gif)/,
                use:[{
                    loader:'url-loader',  // url-loader
                    options:{
                        limit:1000, // 是把小于400000B的文件打成Base64的格式
                        outputPath: 'images/'  // 图片路径打包地址
                    }
                }]
            },{
                test: /\.(htm|html)$/i,
                use:[ 'html-withimg-loader'] 
            },{ // lless 配置
                test: /\.less$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    },{
                        loader: "less-loader"
                    }],
                    fallback: "style-loader"
                }) 
            },{ // sass 配置
                test: /\.scss$/,
                use: extractTextPlugin.extract({
                    use: [{
                        loader: "css-loader"
                    }, {
                        loader: "sass-loader"
                    }],
                    fallback: "style-loader"
                })
            },{  // babel 转换
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                },
                exclude:/node_modules/
            }
        ]
    },
     //插件，用于生产模版和各项功能
    plugins:[
        // 代码压缩
        // new uglifyJsPlugin(),

        // 多文件抽离
        new webpack.optimize.CommonsChunkPlugin({
            //name对应入口文件中的名字，我们起的是jQuery
            name:['jquery','vue'],
            //把文件打包到哪里，是一个路径
            filename:"assets/js/[name].js",
            //最小打包的文件模块数，这里直接写2就好
            minChunks:2
        }),

        // html 打包
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true  // minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash:true, // 为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template:'./src/index.html' //是要打包的html模版路径和文件名称
        }),
        new extractTextPlugin("css/index.css"), // CSS分离与图片路径处理
        // 消除未使用的css
        new PurifyCSSPlugin({
            paths: glob.sync(path.join(__dirname, 'src/*.html'))
        }),

        // 配置第三方插件
        new webpack.ProvidePlugin({
            $:'jquery'
        }),
        // 版权注释
        new webpack.BannerPlugin('hsgeng版权所有'),

        // 静态文件输出配置
        new copyWebpackPlugin([{
            from:__dirname+'/src/public', // 要打包的静态资源目录地址
            to:'./public' // 要打包到的文件夹路径，跟随output配置中的目录
        }]),

        // 热更新： 打包运行之后，页面自动进行更新
        new webpack.HotModuleReplacementPlugin()
    ],
     //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的IP地址，可以使用IP也可以使用localhost
        host:'localhost',
        //服务端压缩是否开启
        compress:true,
        //配置服务端口号， 可以自己设置端口号
        port: 1818
    },
    watchOptions:{
        //检测修改的时间，以毫秒为单位
        poll:1000, 
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout:500, 
        //不监听的目录
        ignored:/node_modules/, 
    }
}
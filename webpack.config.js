const path = require('path'); // 引入path
const uglifyJsPlugin = require('uglifyjs-webpack-plugin'); // 引入uglify插件 压缩代码  不需要安装
const htmlPlugin =  require('html-webpack-plugin'); //  打包HTML文件 插件
const extractTextPlugin = require("extract-text-webpack-plugin"); // CSS分离与图片路径处理

// 声明一个路径  处理静态文件路径
var filePath = {
    publicPath: "http://localhost:1818/"
}

module.exports = {
     // 入口文件配置
    entry:{
        entry: './src/entry.js'
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
                    fallback: "style-loader",
                    use: "css-loader"
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
            }
        ]
    },
     //插件，用于生产模版和各项功能
    plugins:[
        // 代码压缩
        // new uglifyJsPlugin(),

        // html 打包
        new htmlPlugin({
            minify:{
                removeAttributeQuotes:true  // minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
            },
            hash:true, // 为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            template:'./src/index.html' //是要打包的html模版路径和文件名称
        }),
        new extractTextPlugin("css/index.css") // CSS分离与图片路径处理
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
    }
}
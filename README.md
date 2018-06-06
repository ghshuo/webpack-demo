## webpack介绍
    webpack 是一个现代 JavaScript 应用程序的静态模块打包器(module bundler)。当 webpack 处理应用程序时，它会递归地构建一个依赖关系图(dependency graph)，其中包含应用程序需要的每个模块，然后将所有这些模块打包成一个或多个 bundle。
## 学习文档 : 
  * webpack官网: http://webpack.github.io/
  * webpack文档(英文): https://webpack.js.org/
  * webpack文档(中文): https://doc.webpack-china.org/

## 安装
### 1.全局安装webpack
```
npm install webpack -g
npm install webpack@3.xx -g 可以规定webpack的安装版本
```
### 2.初始化
![webpack初始化](http://p9mrpjx2c.bkt.clouddn.com/webpackInit.png)

### 3.项目中局部安装
```
npm install webpack --save-dev
```

## webpack.config.js配置
### 1.entry选项（入口配置）

```
 entry:{
        entry: './src/entry.js',
    }
```
### 2.entry选项（出口配置）

```
 output:{
        path: path.resolve(__dirname,'dist'), // 出口地址 绝对路径
        filename:'[name].js' // //输出的文件名称
}

```
### 3.module模块 
#### 解读css
安装
```
npm install style-loader --save-dev
npm install --save-dev css-loader
```
module模块中配置
```
module:{
        rules: [
            {
              test: /\.css$/,
              use: [ 'style-loader', 'css-loader' ]
            }
          ]
    },
```
#### 配置图片
```
* npm install --save-dev file-loader url-loader
* file-loader 解决引用路径的问题
* url-loader 如果图片较多，会发很多http请求，会降低页面性能。
```

```
{  // 配置图片
    test: /\.(png|jpg|gif)/,
    use:[{
        loader:'url-loader',  // url-loader
        options:{
            limit:400000, // 是把小于400000B的文件打成Base64的格式
            outputPath:'images/'  //  把图片打包到指定路径下
        }
    }]
}
```
#### 直接在文件中引用img图片

```	
npm install html-withimg-loader --save
```
```
{
    test: /\.(htm|html)$/i,
     use:[ 'html-withimg-loader'] 
}
```
### 4.plugins插件
#### 压缩代码
```
 * 引入： 不需要安装 const uglifyJsPlugin = require('uglifyjs-webpack-plugin');
```
```
  配置
  plugins:[
     new uglifyJsPlugin()   
  ]
```
#### html 打包
```
* npm install --save-dev html-webpack-plugin
```
```
const htmlPlugin =  require('html-webpack-plugin'); 

plugins:[
      new htmlPlugin({
          minify:{
              removeAttributeQuotes:true  // minify：是对html文件进行压缩，removeAttrubuteQuotes是却掉属性的双引号。
          },
          hash:true, // 为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
          template:'./src/index.html' //是要打包的html模版路径和文件名称
      })
  ]
```

### 5.热更新功能
```
npm install webpack-dev-server --save-dev
```

再设置
```
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

```
一般直接启动 npm run server 查看就能进行热更新

如果不能进行热更新添加 HotModuleReplacementPlugin插件

plugins 中配置
```js
new webpack.HotModuleReplacementPlugin()
```
### 6.CSS分离与图片路径处理
 把CSS单独提取出来，分离css

```	
npm n install --save-dev extract-text-webpack-plugin
```

```
const extractTextPlugin = require("extract-text-webpack-plugin");
plugins[
  new extractTextPlugin("/css/index.css")
]
再配置下模块
module:{
    rules:[
       {
          test: /\.css$/,
          use: extractTextPlugin.extract({
            fallback: "style-loader",
            use: "css-loader"
          })
        }
    ]
}

分离出来之后css路径不正确 需要下面修改下
var filePath = {
    publicPath: "http://localhost:1818/"  // 声明一个路径  处理静态文件路径
}
//出口文件的配置项
    output:{
        publicPath:website.publicPath
    }

```

## 安装css预编译语言
### 1.less 
```
npm install --save-dev less
npm install --save-dev less-loader
```
webpack.config.js
配置less
```js
{
    test: /\.less$/,
    use: [{
           loader: "style-loader" 
        }, {
            loader: "css-loader" 
        , {
            loader: "less-loader"
        }]
}

```
less 分离
```js
npm n install --save-dev extract-text-webpack-plugin
const extractTextPlugin = require("extract-text-webpack-plugin");
plugins[
  new extractTextPlugin("/css/index.css")
]

use:extractTextPlugin.extract({
    use:[{
        loader:'css-loader'
    },{
            loader:'less-loader'
        }],
    fallback:'style-loader'
})
```
### 2.sass

```js
npm install --save-dev node-sass
npm install --save-dev sass-loader
```
```js
{
    test: /\.scss$/,
    use: extractTextPlugin.extract({
        use: [{
            loader: "css-loader"
        }, {
            loader: "sass-loader"
        }],
        fallback: "style-loader"
    })
}
```
## 自动处理css3属性前戳

需要安装两个包postcss-loader 和autoprefixer（自动添加前缀的插件）
```	
npm n install --save-dev postcss-loader autoprefixer
```
在webpack.config.js同级目录下新建一个postcss.config.js文件
```js
module.exports = {
    plugins: [
        require('autoprefixer')
    ]
}
```
loader配置
```js
{
    test: /\.css$/,
    use: extractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
            { loader: 'css-loader', options: { importLoaders: 1 } },
            'postcss-loader'
        ]
    })
    
}
```
## 消除未使用的CSS


安装PurifyCSS-webpack
```
npm i -D purifycss-webpack purify-css
```
引入glob
因为我们需要同步检查html模板，所以我们需要引入node的glob对象使用。在webpack.config.js文件头部引入glob。
```css
constc  glob = require('glob');
```
引入purifycss-webapck
```css
constc  PurifyCSSPlugin = require("purifycss-webpack");
```
配置plugins
```js
new PurifyCSSPlugin({
    paths: glob.sync(path.join(__dirname, 'src/*.html')),
})
```

## babel
 把es6 转化成es5 语法
```
npm i -D babel-loader babel-core babel-preset-env babel-polyfill
```
module中配置
```
{
    test:/\.(jsx|js)$/,
    use:{
        loader:'babel-loader',
    },
    exclude:/node_modules/
}
```
配置babel预设文件
在根目录下创建一个.babelrc文件
```
{
  "presets": ["env"]
}
```

## 打包调试
source-map:在一个单独文件中产生一个完整且功能完全的文件。这个文件具有最好的source map,但是它会减慢打包速度；
cheap-module-source-map:在一个单独的文件中产生一个不带列映射的map，不带列映射提高了打包速度，但是也使得浏览器开发者工具只能对应到具体的行，不能对应到具体的列（符号）,会对调试造成不便。
eval-source-map:使用eval打包源文件模块，在同一个文件中生产干净的完整版的sourcemap，但是对打包后输出的JS文件的执行具有性能和安全的隐患。在开发阶段这是一个非常好的选项，在生产阶段则一定要不开启这个选项。
cheap-module-eval-source-map:这是在打包文件时最快的生产source map的方法，生产的 Source map 会和打包后的JavaScript文件同行显示，没有影射列，和eval-source-map选项具有相似的缺点。

```js
module.exports = {
  devtool: 'eval-source-map',
  }
}
```

## 配置生产和开发并行


修改package.json命令

其实就是添加一个dev设置，并通过环境变量来进行区分，下面是package.json里的值。

```js
 "scripts": {
    "server": "webpack-dev-server --open",
    "dev":"set type=dev&webapck",
    "build": "set type=build&webpack"
  }
```
修改webpack.config.js文件

```js
if(process.env.type == "build"){
    var filePath = {
        publicPath: "线上地址/"
    }
}else{
    var filePath = {
        publicPath: "本地地址/"
    }
}
```
打印传递过来的值
```
console.log( encodeURIComponent(process.env.type) );
```
## 引用第三方库


安装
```
npm install --save jquery
```
用plugin 引入  ProvidePlugin插件
```
constc  webpack = require('webpack');
```
webpack.config.js中plugins配置  
```
plugins:[
    new webpack.ProvidePlugin({
        $:"jquery"
    })
]
```
## watch 用法

随着项目大了，项目进行联调时,我们不需要每一次都去打包，使用watch解决了这个麻烦，只要代码进行保存之后会自动进行打包。 watch是webpack中自带插件
```js
watchOptions:{
    //检测修改的时间，以毫秒为单位
    poll:1000, 
    //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
    aggregateTimeout:500, 
    //不监听的目录
    ignored:/node_modules/, 
}
```
但是运行这个插件  必须要引入webpack
```js
const webpack = require('webpack'); 
```
运行webpack --watch 进行打包

## 添加注释版权所有
BannerPlugin插件
js上添加z注释是谁写的 ，创建时间，都可以进行设置
```js
 new webpack.BannerPlugin('hsgeng版权所有')
```
![版权注释](http://p9mrpjx2c.bkt.clouddn.com/webpack-BannerPlugin.png)

## 多个第三方类库抽离
```js
npm instawll vue --save
npm install --save jquery
```
入口文件配置
```js
entry:{
    entry:'./src/entry.js',
    jquery:'jquery',
    vue:'vue'
}
```
```js
new webpack.optimize.CommonsChunkPlugin({
    //name对应入口文件中的名字，我们起的是jQuery
    name:['jquery','vue'],
    //把文件打包到哪里，是一个路径
    filename:"assets/js/[name].js",
    //最小打包的文件模块数，这里直接写2就好
    minChunks:2
})
```

## 静态资源输出

项目中有些没有引用的静态资源（图片、开发文档），想在打包的时候保留这些静态资源，可以直接打包到指定的文件夹下面

安装
```js
npm install --save-dev copy-webpack-plugin
```
引入
```js
const copyWebpackPlugin= require("copy-webpack-plugin");
```
plugins 进行配置
```js
new copyWebpackPlugin([{
    from:__dirname+'/src/public', // 要打包的静态资源目录地址
    to:'./public' // 要打包到的文件夹路径，跟随output配置中的目录
}])
```
![静态资源打包输出](http://p9mrpjx2c.bkt.clouddn.com/webpack1.png)

## json配置文件使用

入口文件中引用json
```
var json =require('../config.json');
document.getElementById("json").innerHTML= json.name;

```
## 打包命令
webpack
## 运行
npm run server
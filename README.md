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
![这里写图片描述](http://p9mrpjx2c.bkt.clouddn.com/webpackInit.png)

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


## 打包命令
webpack 
## 运行
npm run server
<div align="center">
  <a href="https://github.com/webpack/webpack">
    <img width="200" height="200" src="https://webpack.js.org/assets/icon-square-big.svg">
  </a>
</div>

[![NPM version](https://img.shields.io/npm/v/@vinsea/extra-jsfile-webpack-plugin.svg?style=flat)](https://npmjs.org/package/@vinsea/extra-jsfile-webpack-plugin)

<h2 align="center">Extra-Jsfile-Webpack-Plugin</h2>

主要功能：

- 打包时候可以将额外的 `js` 文件加入到 [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin/v/3.2.0) 的资源队列中。 （会插入到 index.html）
- `webpack`在`library`模式下打包的入口文件中(`entry`)加入指定的 `js` 脚本

## 示例
详细参数请查看

### 默认情况
```js
new ExtraJsfileWebpackPlugin()
```
将会在`window`上添加一个全局对象 `__EXTRA_JSFILE_WEBPACK_PLUGIN__`，包含项目信息：
```
> console.log(window.__EXTRA_JSFILE_WEBPACK_PLUGIN__)

> {
>   name: `package.json`里的`name`,
>   version: `package.json`里的`version`,
>   buildDate: 打包时间,
>   author: `package.json`里的`author`,
>   dependencies: `package.json`里的`dependencies`
> }
```

### 添加自定义js脚本
```js
new ExtraJsfileWebpackPlugin({
  template: "window.__YOUR_KEY_NAME__='ExtraJsfileWebpackPlugin'"
})
```
控制台：
```
> console.log(window.__YOUR_KEY_NAME__)

> "ExtraJsfileWebpackPlugin"
```

### 往html中添加指定js文件
比如项目里有一个`extra-js-file.js`
```js
new ExtraJsfileWebpackPlugin({ 
  pathOnly: true, // true 如果不想生成默认的`__EXTRA_JSFILE_WEBPACK_PLUGIN__`对象
  paths: ['/path/to/extra-js-file.js']
})
```
这个js文件会被插入到最终生成的html中：
```html
<body>
    <div id="app"></div>
    <script src="/extra-js-file.js"></script>
    <script src="/js/app.fe6a0b5c.js"></script>
</body>
```

### webpack打包成library时
```js
new ExtraJsfileWebpackPlugin({ 
  isLibrary: true,
  libraryEntry: '/your/path/to/lib/entry' // 默认是 src/index.js
})
```

## 用法

> ℹ️ 依赖于 [html-webpack-plugin 3.* 以下版本](https://www.npmjs.com/package/html-webpack-plugin/v/3.2.0)，后续会兼容最新版本

### 安装

```bash
npm install @vinsea/extra-jsfile-webpack-plugin --save-dev
```

### 正常用webpack
`webpack.config.js`
```js
const ExtraJsfileWebpackPlugin = require('@vinsea/extra-jsfile-webpack-plugin');

module.exports = {
  plugins: [
    new ExtraJsfileWebpackPlugin(),
  ],
};
```

### vue cli2
`build/webpack.prod.conf.js`
```javascript
const ExtraJsfileWebpackPlugin = require('@vinsea/extra-jsfile-webpack-plugin');

const webpackConfig = merge(baseWebpackConfig, {
  // ...
})

webpackConfig.plugins.push(new ExtraJsfileWebpackPlugin({ 这里是参数 }));

module.exports = webpackConfig;
```

### vue cli3
`vue.config.js`
```javascript
const ExtraJsfileWebpackPlugin = require('@vinsea/extra-jsfile-webpack-plugin');

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new ExtraJsfileWebpackPlugin({ 这里是参数 }));
    }
  }
}
```

## 选项

|      选项名       |       类型      |            默认值         |            说明           |
| :--------------: | :------------: | :----------------------: | :------------------------ |
| `isLibrary`    |  `{Boolean}`   |   `false`                | 是否是库模式 [创建`libraries`时需要传该参数](https://v4.webpack.docschina.org/guides/author-libraries) |
| `libraryEntry` |  `{string}`    |   `src/index.js`         | 库模式打包入口js路径        |
| `filename`       |  `{String}`    |   `version`              | 通过下面的 template 参数生成的 js 文件的文件名 |
| `template`       |  `{String}`    |   `undefined`            | 自定义插入到 `index.html` 中的 js 文件的内容 |
| `name`           |  `{String}`    |`package.json`里的`name`   | 项目名 |
| `version`        |  `{String}`    |`package.json`里的`version`| 版本号 |
| `author`         |  `{String}`    |`package.json`里的`author` | 作者 |
| `hash`           |  `{Boolean}`   |   `true`                 | 是否给生成的 js 文件添加版本标示 |
| `pathOnly`       |  `{Boolean}`   |   `false`                | 是否只通过路径插入 js 文件，而不用 template |
| `paths`          |  `{Array}`     |   `[]`                   | 自定义插入到 `index.html` 中的 `js` 文件的路径 |

## TODO
- 加单元测试
- 兼容 `html-webpack-plugin` 4+
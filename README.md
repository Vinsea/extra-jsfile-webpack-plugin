## webpeck 插件

打包时候可以将额外的 js 文件通过 script 标签插入到 index.html 中

或者在导出的组件库中加入特定的 js

## 用法

### 安装

> 注：依赖于 html-webpack-plugin 2.\* 版本，后续会兼容最新版本

```bash
npm i @vinsea/extra-jsfile-webpack-plugin -D
```

### vue cli2 项目

```javascript
// build/webpack.prod.conf.js
const ExtraJsfileWebpackPlugin = require('@vinsea/extra-jsfile-webpack-plugin')

const webpackConfig = merge(baseWebpackConfig, {
  // ...
})

webpackConfig.plugins.push(new ExtraJsfileWebpackPlugin({ 这里是参数 }))

module.exports = webpackConfig
```

### vue cli3 项目

```javascript
// vue.config.js
const ExtraJsfileWebpackPlugin = require('@vinsea/extra-jsfile-webpack-plugin')

module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === 'production') {
      config.plugins.push(new ExtraJsfileWebpackPlugin({这里是参数}}));
    }
  }
}
```

### 实例化时的参数

- isComponent: 是否是组件，默认是 false；
- filename: 通过下面的 template 参数生成的 js 文件的文件名，默认是：`version`；
- template: 想插入到 index.html 中的 js 文件的内容，默认是空；
- name: 项目名，默认是`package.json`里的`name`；
- version: 版本号，默认是`package.json`里的`version`；
- author: 作者，默认是`package.json`里的`author`；
- hash: 是否给生成的 js 文件添加版本标示，默认是 `true`；
- pathOnly: 是否只通过路径插入 js 文件，而不用 template，默认是 `false`；
- paths:  想插入到 index.html 页面上的 js 文件的路径，默认是空数组。

## demo

> TODO

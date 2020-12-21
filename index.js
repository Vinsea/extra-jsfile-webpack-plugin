const fs = require('fs-extra');
const path = require('path');
const {log, info, done, error} = require('./lib/utils/logger');
const pkg = require(path.join(process.cwd(), 'package.json'));
const NormalModuleReplacementPlugin = require('webpack/lib/NormalModuleReplacementPlugin');

/**
 * @author Vinsea
 * @description 打包时在index.html里添加自定义的js文件，或者打组件时 在 bundle 中加入js脚本 .
 */
class ExtraJsFileWebpackPlugin {

    /**
     * 初始化
     * @param {object} options 配置参数
     */
    constructor(options) {
        const userOptions = options || {};
        const defaultOptions = {
            isLibrary: false,
            filename: 'versions',
            name: pkg.name,
            version: pkg.version,
            author: pkg.author,
            hash: true,
            pathOnly: false,
            paths: [],
            template: '',
            libraryEntry: 'src/index.js'
        }
        this.options = Object.assign(defaultOptions, userOptions);
        // webpack配置输出的完整路径
        this.webpackOutputPath = '';
        // webpack打包library模式时的入口文件路径
        this.libraryFinalEntry = '';
    }

    /**
     * apply is called by the webpack main compiler during the start phase
     * @param {WebpackCompiler} compiler 
     * @returns {undefined}
     */
    apply(compiler) {
        // ========================================== 库模式
        if (this.options.isLibrary) {
            const libraryDefaultEntry = path.join(process.cwd(), this.options.libraryEntry);
            if (!fs.pathExistsSync(libraryDefaultEntry)) {
                error(`入口文件不存在：${libraryDefaultEntry}\n请检查 libraryEntry 参数的值是否正确`)
                return;
            }
            const LAST_INDEX_PATH = libraryDefaultEntry.lastIndexOf('/');
            const OUTPUT_PATH = libraryDefaultEntry.substring(0, LAST_INDEX_PATH + 1);
            // 防止在webpack构建过程中被强制终止导致该文件没被删除，通过文件名直观告诉开发者需要手动删除
            const OUTPUT_FILENAME = 'this-file-should-be-deleted.js';
            // 最终入口文件路径
            this.libraryFinalEntry = path.join(OUTPUT_PATH, OUTPUT_FILENAME);
            // 修改 OUTPUT_FILENAME 文件内容
            this.replaceNormalModule(libraryDefaultEntry);
            // 把打包的entry文件替换成 libraryFinalEntry
            new NormalModuleReplacementPlugin(new RegExp(libraryDefaultEntry), this.libraryFinalEntry).apply(compiler);
            info(`已修改 ${OUTPUT_FILENAME} 为最终入口文件 - ${this.libraryFinalEntry}`)
            // 删除新的入口文件
            compiler.plugin('done', () => {
                fs.remove(this.libraryFinalEntry);
            })
            return;
        }

        // ========================================== web项目模式
        this.webpackOutputPath = compiler.options.output.path;
        compiler.plugin('compilation', (compilation) => {
            // html-webpack-plugin4.* 把钩子名改了，后续规划做兼容
            compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
                this.options.paths.forEach(pathItem => {
                    log(`插入文件：${pathItem}`);
                    htmlPluginData.assets.js.unshift(pathItem);
                });
                if (this.options.pathOnly) {
                    return;
                }
                this.addExtraFileToHtmlPlugin(htmlPluginData, callback, !compilation.hooks);
            });
        });

    }

    /**
     * 在 `entry` 文件的内容头部增加 this.options.template 的内容
     * @param {string} entry 入口路径
     * @returns {undefined}
     */
    replaceNormalModule(entry) {
        const entryContent = fs.readFileSync(entry, 'utf8');
        const template = this.options.template || this.getDefaultTemplateContent();
        const final = `${template}\n${entryContent}`;
        fs.writeFileSync(this.libraryFinalEntry, final, 'utf8');
    }

    /**
     * 1. 生成js文件，用于保存 this.options.template 的值
     * 2. 加入到 html-webpack-plugin 资源队列
     * @param {Object} htmlPluginData htmlPluginData
     * @param {Function} callback 为了触发promise的resolve
     * @param {Boolean} isBeforeWebpack4 是否是webpack4以前的版本
     * @returns {undefined}
     */
    addExtraFileToHtmlPlugin(htmlPluginData, callback, isBeforeWebpack4) {
        const { hash, filename, template } = this.options;
        // 获取文件名
        const fileName = hash ? `${filename}.${new Date().getTime()}.js` : `${filename}.js`;
        // 写入文件路径
        const OUTPUT_PATH = path.join(this.webpackOutputPath, fileName);
        // 没有传模板就用自带的
        const templateContent = template || this.getDefaultTemplateContent();
        // 写入文件
        fs.ensureDirSync(this.webpackOutputPath)
        fs.writeFileSync(OUTPUT_PATH, templateContent, 'utf8');
        // 添加到 html-webpack-plugin 资源队列
        htmlPluginData.assets.js.unshift('/' + fileName);
        done(`已添加到 html-webpack-plugin 资源队列 - ${OUTPUT_PATH}`);

        // [2020-12-10] webpack4之前，为了返回promise，就需要执行callback触发一下resolve
        //              webpack4以后，可以直接用compilation.hooks[EventName].promise()返回promise
        if (isBeforeWebpack4) {
            callback(null, htmlPluginData);
        }
    }

    /**
     * @returns {String} 模板内容
     */
    getDefaultTemplateContent() {
        log('生成默认js内容');
        const current = JSON.stringify({
            name: this.options.name,
            version: this.options.version,
            buildDate: new Date(),
            author: this.options.author,
            dependencies: pkg.dependencies,
        })
        return `/* Automatically generated by 'extra-jsfile-webpack-plugin' */
window.__EXTRA_JSFILE_WEBPACK_PLUGIN__ = ${current}
`;
    }

}
module.exports = ExtraJsFileWebpackPlugin;
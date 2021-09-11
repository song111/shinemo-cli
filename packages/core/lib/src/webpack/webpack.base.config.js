"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var simo_utils_1 = require("@chrissong/simo-utils");
var webpack_1 = require("webpack");
var html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
var eslint_webpack_plugin_1 = __importDefault(require("eslint-webpack-plugin"));
var lodash_webpack_plugin_1 = __importDefault(require("lodash-webpack-plugin"));
var lodash_1 = __importDefault(require("lodash"));
var webpackbar_1 = __importDefault(require("webpackbar"));
exports.default = (function (api) {
    api.chainWebpack(function (config) {
        var simoConfig = api.simoConfig, context = api.context, paths = api.paths, env = api.env;
        var useTypescript = simo_utils_1.fs.existsSync(paths.appTsConfigPath);
        var isDevelopment = env.NODE_ENV === 'development';
        var define = simoConfig.define, target = simoConfig.target, alias = simoConfig.alias, pages = simoConfig.pages, publicPath = simoConfig.publicPath, inlineLimit = simoConfig.inlineLimit, externals = simoConfig.externals, output = simoConfig.output, parallel = simoConfig.parallel, browsersList = simoConfig.browsersList, extraBabelOptions = simoConfig.extraBabelOptions, fastRefresh = simoConfig.fastRefresh;
        // 设置context
        config.context(context).target(target);
        // output配置
        config.output.merge(__assign({ publicPath: publicPath, path: api.resolve(lodash_1.default.get(output, 'path', 'dist')) }, lodash_1.default.omit(output, ['publicPath', 'path'])));
        // resolve 配置
        config.resolve
            .when(alias, function (config) {
            Object.keys(alias).forEach(function (key) {
                config.alias.set(key, api.resolve(alias[key]));
            });
        })
            .extensions.merge([
            '.mjs',
            '.js',
            '.jsx',
            '.ts',
            '.tsx',
            '.json',
            '.wasm',
            '.less',
            '.scss',
            '.sass',
            'css',
        ]);
        // loader 配置
        /**
         * thread-loader  babel-loader
         */
        var jsRule = config.module
            .rule('compile')
            .test(/\.(js|mjs|jsx|ts|tsx)$/)
            .exclude.add(api.resolve('node_modules'))
            .end();
        if (parallel)
            jsRule.use('thread-loader').loader(require.resolve('thread-loader'));
        jsRule
            .use('babel-loader')
            .loader('babel-loader')
            .options(__assign({ cacheDirectory: true, sourceType: 'unambiguous', presets: __spreadArrays([
                [
                    require.resolve('@chrissong/babel-preset-simo'),
                    {
                        targets: browsersList,
                        typescript: useTypescript,
                        refresh: fastRefresh,
                        isDev: isDevelopment,
                    },
                ]
            ], __spreadArrays(lodash_1.default.get(extraBabelOptions, 'presets', []))), plugins: __spreadArrays(lodash_1.default.get(extraBabelOptions, 'plugins', [])).filter(Boolean) }, lodash_1.default.omit(extraBabelOptions, ['presets', 'plugins'])));
        // 匹配规则配置
        config.module
            .rule('modules')
            .test(/\.m?jsx?$/)
            .resolve.set('fullySpecified', false);
        // 图片
        config.module
            .rule('images')
            .test(/\.(png|jpe?g|gif|webp|ico)(\?.*)?$/)
            .use('url-loader')
            .loader(require.resolve('url-loader'))
            .options({
            limit: inlineLimit || 10000,
            name: 'static/[name].[hash:8].[ext]',
            esModule: false,
            fallback: {
                loader: require.resolve('file-loader'),
                options: {
                    name: 'static/[name].[hash:8].[ext]',
                    esModule: false,
                },
            },
        });
        // 单独抽出svg 文件
        config.module
            .rule('svg')
            .test(/\.(svg)(\?.*)?$/)
            .use('file-loader')
            .loader(require.resolve('file-loader'))
            .options({
            name: 'static/[name].[hash:8].[ext]',
            esModule: false,
        });
        // 字体文件
        config.module
            .rule('fonts')
            .test(/\.(eot|woff|woff2|ttf)(\?.*)?$/)
            .use('file-loader')
            .loader(require.resolve('file-loader'))
            .options({
            name: 'static/[name].[hash:8].[ext]',
            esModule: false,
        });
        // 文档字符串
        config.module
            .rule('plaintext')
            .test(/\.(txt|text|md)$/)
            .use('raw-loader')
            .loader(require.resolve('raw-loader'));
        //  排除依赖
        config.when(externals, function (config) {
            config.externals(externals);
        });
        // 插件配置
        /**
         * eslint 插件配置
         * */
        config.plugin('eslint').use(eslint_webpack_plugin_1.default, [
            {
                context: context,
                extensions: ['js', 'mjs', 'jsx', 'ts', 'tsx'],
                eslintPath: require.resolve('eslint'),
                cache: true,
            },
        ]);
        /**
         * 自定义常量 .env优先
         */
        var newEnvs = __assign(__assign({}, define), env);
        var stringfyEnvs = {};
        Object.keys(newEnvs).forEach(function (key) { return (stringfyEnvs[key] = JSON.stringify(newEnvs[key])); });
        config.plugin('define').use(webpack_1.DefinePlugin, [stringfyEnvs]);
        /**
         * 编译进度
         */
        config.plugin('progress').use(webpackbar_1.default);
        /**
         * 忽略moment locale文件
         */
        config.plugin('ignore').use(webpack_1.IgnorePlugin, [
            {
                resourceRegExp: /^\.\/locale$/,
                contextRegExp: /moment$/,
            },
        ]);
        /**
         * lodash精简
         * */
        config.plugin('lodash').use(lodash_webpack_plugin_1.default);
        /**
         * 模版加载
         */
        config.when(pages, function (config) {
            var _loop_1 = function (key) {
                var _a = pages[key], entry = _a.entry, template = _a.template, htmlWebpackPluginOptions = _a.htmlWebpackPluginOptions;
                if (Array.isArray(entry)) {
                    entry.forEach(function (en) { return config.entry(key).add(api.resolve(en)); });
                }
                else {
                    config.entry(key).add(api.resolve(entry));
                }
                // 模版
                config.plugin("html-template-" + key).use(html_webpack_plugin_1.default, [
                    __assign({ filename: key + ".html", template: api.resolve(template), inject: Reflect.has(pages[key], 'htmlWebpackPluginOptions') ? true : false, chunks: [key] }, htmlWebpackPluginOptions),
                ]);
            };
            for (var key in pages) {
                _loop_1(key);
            }
        });
    });
});
//# sourceMappingURL=webpack.base.config.js.map
const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const ClosureCompilerPlugin = require('webpack-closure-compiler');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    
    const sharedConfig = () => ({
        stats: { modules: false },
        resolve: { extensions: ['.js', '.jsx'] },
        output: {
            filename: '[name].js',//isDevBuild ? '[name].js' : '[name][chunkhash].js',
            publicPath: '/dist/' 
        },
        module: {
            rules: [{ 
                test: /\.js(x?)$/, 
                include: /.\/app\/ClientApp/, 
                use: {
                    loader: 'babel-loader',
                    options: {
                        cacheDirectory: isDevBuild,
                        babelrc: false,
                        presets: [
                            ['env', {
                                targets: { "browsers": ["last 2 versions", "ie >= 7"] },
                                modules: false,
                                useBuiltIns: false,
                                debug: false,
                            }],
                            "stage-0", "react"
                        ],
                        plugins: [ "transform-runtime" ]
                            .concat(isDevBuild ? [] : ["transform-react-constant-elements", "transform-react-inline-elements"]) 
                    }
                }},
                { test: /\.(png|jpg|jpeg|gif|svg)$/, use: 'url-loader?limit=100000' }
            ]
        }
    });

    const serverBundleOutputDir = path.join(__dirname, './app/ClientApp/dist');
    const clientBundleOutputDir =  path.join(__dirname, 'app', 'wwwroot', 'dist');
    const serverBundleEntryPoint = './app/ClientApp/boot-server.js';
    const clientBundleEntryPoint = './app/ClientApp/boot-client.js';
    const clientPreloadEntryPoint = './app/ClientApp/preload.js';

    const clientBundleConfig = merge(sharedConfig(), {
        entry: { 
            'main-client':  clientBundleEntryPoint,
            // isDevBuild ? ['react-hot-loader/patch', 'webpack-hot-middleware/client', clientBundleEntryPoint] :
            //                             clientBundleEntryPoint,
            'preload': clientPreloadEntryPoint
        },
        module: {
            rules: [
                { test: /\.css$/, 
                    use: ExtractTextPlugin.extract({ 
                        use: [{
                            loader: 'css-loader',
                            options: {
                                module: false,
                                minimize: isDevBuild ? false : true,
                                localIdentName: '_[name]__[local]_[hash:base64:5]'
                            }
                        }, {
                            loader: 'postcss-loader',
                            options: {
                                plugins: () => [autoprefixer]
                            }
                        }]
                    })
                }
            ]
        },
        output: { path: clientBundleOutputDir },
        plugins: [
            new ExtractTextPlugin('[name].css'),
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./app/wwwroot/dist/vendor-manifest.json')
            })
        ].concat(isDevBuild ? [
            // new webpack.HotModuleReplacementPlugin(),
            // new webpack.NoEmitOnErrorsPlugin(),
            new webpack.SourceMapDevToolPlugin({
                filename: '[file].map', 
                moduleFilenameTemplate: path.relative(clientBundleOutputDir, '[resourcePath]') // Point sourcemap entries to the original file locations on disk
            })
        ] : [
            // new webpack.optimize.UglifyJsPlugin()
            new ClosureCompilerPlugin({
                compiler: {
                    compilation_level: 'SIMPLE'
                },
                concurrency: 2
            })
        ])
    });

    const serverBundleConfig = merge(sharedConfig(), {
        resolve: { mainFields: ['main'] },
        entry: { 'main-server': serverBundleEntryPoint },
        plugins: [
            new webpack.DllReferencePlugin({
                context: __dirname,
                manifest: require('./app/ClientApp/dist/vendor-manifest.json'),
                sourceType: 'commonjs2',
                name: './vendor'
            }),
        ],
        output: {
            libraryTarget: 'commonjs',
            path: serverBundleOutputDir,
        },
        target: 'node',
        devtool: 'inline-source-map'
    });

    return [clientBundleConfig, serverBundleConfig];
};
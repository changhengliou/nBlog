const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const merge = require('webpack-merge');
const autoprefixer = require('autoprefixer');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = (env) => {
    const isDevBuild = !(env && env.prod);
    const extractCSS = new ExtractTextPlugin('vendor.css');
    const serverBundleOutputDir = path.join(__dirname, 'app', 'ClientApp', 'dist');
    const clientBundleOutputDir =  path.join(__dirname, 'app', 'wwwroot', 'dist');

    const sharedConfig = {
        stats: {
            modules: false
        },
        resolve: {
            extensions: ['.js']
        },
        module: {
            rules: [{
                test: /\.(png|woff|woff2|eot|ttf|svg)(\?|$)/,
                use: 'url-loader?limit=100000'
            }]
        },
        entry: {
            vendor: [
                'bootstrap/dist/css/bootstrap.css',
                'history',
                'react',
                'react-dom',
                'react-router-dom',
                'react-redux',
                'redux',
                'redux-thunk',
                'react-router-redux',
            ],
        },
        output: {
            publicPath: 'dist/',
            filename: '[name].js',
            library: '[name]_[hash]',
        },
        plugins: [
            new webpack.DefinePlugin({
                'process.env.NODE_ENV': isDevBuild ? '"development"' : '"production"'
            })
        ]
    };

    const clientBundleConfig = merge(sharedConfig, {
        output: {
            path: clientBundleOutputDir
        },
        module: {
            rules: [{
                test: /\.css(\?|$)/,
                use: extractCSS.extract({
                    use: isDevBuild ? 'css-loader' : 'css-loader?minimize'
                })
            }]
        },
        plugins: [
            extractCSS,
            new webpack.DllPlugin({
                path: path.join(__dirname, 'app', 'wwwroot', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            })
        ].concat(isDevBuild ? [] : [
            new webpack.optimize.UglifyJsPlugin(),
            new CleanWebpackPlugin(clientBundleOutputDir),
        ])
    });

    const serverBundleConfig = merge(sharedConfig, {
        target: 'node',
        resolve: {
            mainFields: ['main']
        },
        output: {
            path: serverBundleOutputDir,
            libraryTarget: 'commonjs2',
        },
        module: {
            rules: [{
                test: /\.css(\?|$)/,
                use: [{
                    loader: 'css-loader',
                    options: {
                        minimize: isDevBuild ? false : true,
                    }
                }, {
                    loader: 'postcss-loader',
                    options: {
                        plugins: () => [autoprefixer]
                    }
                }]
            }]
        },
        entry: {
            vendor: ['react-dom/server']
        },
        plugins: [
            new webpack.DllPlugin({
                path: path.join(__dirname, 'app', 'ClientApp', 'dist', '[name]-manifest.json'),
                name: '[name]_[hash]'
            }),
            new CleanWebpackPlugin(serverBundleOutputDir)
        ]
    });

    return [clientBundleConfig, serverBundleConfig];
};
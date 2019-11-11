const path = require("path");
const webpack = require('webpack');


module.exports = (dev) => {
    const conf = {};

    if (dev) {
        conf.entry = {
            main: [
                'webpack/hot/dev-server',
                'webpack-hot-middleware/client',
                './src/js/app.js'
            ]
        };
    } else {
        conf.entry = './src/js/app.js'
    }

    conf.output = {
        filename: "script.min.js",
        path: path.resolve(__dirname, "./dist/js"),
        publicPath: '/js'
    };

    conf.watch = false;
    conf.mode = 'production';
    conf.devtool = "source-map";
    conf.module = {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    };

    if (dev) {
        conf.plugins = [
            new webpack.HotModuleReplacementPlugin()
        ]
    }

    return conf;
};
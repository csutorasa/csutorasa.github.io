const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'index': path.join(__dirname, 'src', './main.ts')
    },
    output: {
        path: path.join(__dirname, 'bundles'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    module: {
        loaders: [
            {
                test: /\.ts$/,
                loader: "ts-loader"
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /@angular/,
            path.join(__dirname, 'src')
        )
    ],
    watchOptions: {
        ignored: /node_modules/
    }
};
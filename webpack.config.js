const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: {
        'index': path.join(__dirname, 'src', 'main.ts')
    },
    output: {
        path: path.join(__dirname, 'dist'),
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
            },
            {
                test: /\.js$/,
                include: ['node_modules/reflect-metadata/Reflect.js', 'node_modules/zone.js/dist/zone.min.js']
            }
        ]
    },
    plugins: [
        new webpack.ContextReplacementPlugin(
            /\@angular(\\|\/)core(\\|\/)esm5/,
            path.join(__dirname, './src')
        ),
        new webpack.optimize.UglifyJsPlugin({
            mangle: {
                keep_fnames: true
            }
        })
    ],
    watchOptions: {
        ignored: /node_modules/
    }
};
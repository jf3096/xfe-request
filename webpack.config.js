const webpack = require('webpack');
const path = require('path');
const libraryName = `XFERequest`;

// noinspection JSUnresolvedFunction
module.exports = {
    entry: {
        [`${libraryName}`]: path.resolve(__dirname, `src/index.ts`),
        [`${libraryName}.min`]: path.resolve(__dirname, `src/index.ts`)
    },
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, '/dist'),
        filename: `[name].js`,
        library: libraryName,
        libraryTarget: 'umd',
        umdNamedDefine: true
    },
    module: {
        loaders: [
            {test: /\.ts$/, loader: 'awesome-typescript-loader', exclude: /node_modules/}
        ]
    },
    resolve: {
        root: path.resolve('./src'),
        extensions: ['', '.ts', '.js']
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            include: /\.min\.js$/,
            minimize: true
        }),
    ]
};

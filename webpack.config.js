var path = require('path');

module.exports = {

    entry: path.resolve(__dirname, 'public') + '/app/index.js',
    output: {
        path: path.resolve(__dirname, 'public') + '/build',
        filename: 'bundle.js'
        // publicPath: '/app/'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                include: path.resolve(__dirname, 'public'),
                loader: 'babel-loader',
                query: {
                    presets: ['react', 'es2015']
                }
            },
            {
                // test: /\.css$/,
                // loader: 'style-loader!css-loader'
            }
        ]
    }
};

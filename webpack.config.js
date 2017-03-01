var path = require('path');

module.exports = {

    entry: path.resolve(__dirname, 'public') + '/javascripts/index.js',
    output: {
        path: path.resolve(__dirname, 'public') + '/dist',
        filename: 'bundle.js',
        // 번들된 파일의 루트 경로 (/public/dist/bundle.js 가 아니고, /dist/bundle.js 이다.)
        publicPath: '/dist/'
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
                test: /\.css$/,
                loader: 'style-loader!css-loader'
            }
        ]
    }
};

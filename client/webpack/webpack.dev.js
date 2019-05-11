const webpack = require('webpack');

const commonPaths = require('./paths');

module.exports = {
	mode: 'development',
	output: {
		filename: '[name].js',
		path: commonPaths.outputPath,
		chunkFilename: '[name].js'
	},
	module: {
		rules: [
			{
				test: /\.(css|scss)$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							sourceMap: true,
							modules: true,
							camelCase: true,
							localIdentName: '[local]___[hash:base64:5]'
						}
					},
					'sass-loader'
				]
			}
		]
	},
	devServer: {
		contentBase: commonPaths.outputPath,
		compress: true,
		hot: true,
		port: 8081,
		proxy: {
			'/api': {
				target: 'http://localhost:3000',
				secure: false
				//changeOrigin: true
			},
			'/socket.io': {
				target: 'http://localhost:3000',
				ws: true
			}
		}
	},
	plugins: [new webpack.HotModuleReplacementPlugin()]
};

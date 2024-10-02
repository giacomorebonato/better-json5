/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

//@ts-check
'use strict';

//@ts-check
/** @typedef {import('webpack').Configuration} WebpackConfig **/

const path = require('path');
const webpack = require('webpack');

/** @type WebpackConfig */
const nodeExtensionConfig = {
	mode: 'none', // this leaves the source code as close as possible to the original (when packaging we set this to 'production')
	target: 'node',
	entry: {
		'extension': './src/client/node/clientMain.ts',
	},
	output: {
		filename: 'clientMain.js',
		path: path.join(__dirname, './dist/node'),
		libraryTarget: 'commonjs',
		devtoolModuleFilenameTemplate: '../../[resource-path]'
	},
	resolve: {
		conditionNames: ['import', 'require', 'node-addons', 'node'],
		mainFields: ['module', 'main'],
		extensions: ['.ts', '.js'] // support ts-files and js-files
	},
	module: {
		rules: [{
			test: /\.ts$/,
			exclude: /node_modules/,
			use: [{
				loader: 'ts-loader',
				options:  {
					compilerOptions: {
						'sourceMap': true,
					},
					onlyCompileBundledFiles: true,
				}
			}]
		}]
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1 // disable chunks by default since web extensions must be a single bundle
		}),
	],
	externals: {
		'vscode': 'commonjs vscode', // ignored because it doesn't exist
	},
	performance: {
		hints: false
	},
	devtool: 'nosources-source-map', // create a source map that points to the original source file
	infrastructureLogging: {
		level: "log", // enables logging required for problem matchers
	},
};

module.exports = [ nodeExtensionConfig ];
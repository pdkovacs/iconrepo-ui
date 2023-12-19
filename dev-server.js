"use strict";

const WebpackDevServer = require('webpack-dev-server');
const webpack = require('webpack');
const config = require('./webpack.config.js');

const restService = 'http://localhost:8091';

const devServerOptions = {
	static: {
		directory: 'dist/',
		publicPath: config.output.publicPath,
	},
	devMiddleware: {
		stats: {
			colors: true
		}
	},
  proxy: {
    '/': {
      target: restService,
      secure: false
    }
  },
	port: 8080
};

const compiler = webpack(config);
const server = new WebpackDevServer(devServerOptions, compiler);
server.start();

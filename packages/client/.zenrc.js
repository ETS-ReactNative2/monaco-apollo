const url = require('url');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const config = {
  builders: {
    web: {
      openBrowser: true,
      dllExcludes: ['bootstrap', 'monaco-editor-webpack-plugin'],
      defines: {
        __CLIENT__: true
      },
      // Wait for backend to start prior to letting webpack load frontend page
      waitOn: [`tcp:${process.env.SERVER_HOST || 'localhost:8080'}`],
      enabled: true
    }
  },
  options: {
    cache: '../../.cache',
    ssr: false,
    defines: {
      __DEV__: process.env.NODE_ENV !== 'production',
      __API_URL__: '"/graphql"',
      'process.env.STRIPE_PUBLIC_KEY': !!process.env.STRIPE_PUBLIC_KEY ? `"${process.env.STRIPE_PUBLIC_KEY}"` : undefined
    },
    webpackConfig: {
      devServer: {
        disableHostCheck: true
      },
      plugins: [
        new MonacoWebpackPlugin({
          // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
          languages: ['json']
        })
      ]
    }
  }
};

if (process.env.DISABLE_SSR && process.env.DISABLE_SSR !== 'false') {
  config.options.ssr = false;
}

config.options.devProxy = config.options.ssr;

const extraDefines = {
  __SSR__: config.options.ssr
};

config.options.defines = Object.assign(config.options.defines, extraDefines);

module.exports = config;

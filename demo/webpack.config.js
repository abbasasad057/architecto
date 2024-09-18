const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const webpack = require('webpack');

const PAGE_TITLE = 'React Planner';
const VENDORS_LIBRARIES = ['immutable', 'react', 'react-dom', 'react-redux', 'redux', 'three'];

module.exports = (env, self) => {
  let isProduction = self.hasOwnProperty('mode') ? ( self.mode === 'production' ) : true;
  let port = self.hasOwnProperty('port') ? self.port : 8080;

  if (isProduction) console.info('Webpack: Production mode'); else console.info('Webpack: Development mode');

  let config = {
    context: path.resolve(__dirname),
    entry: {
      app: './src/renderer.jsx',
      vendor: VENDORS_LIBRARIES
    },
    output: {
      path: path.join(__dirname, 'dist'),
      filename: '[chunkhash].[name].js',
    },
    performance: {
      hints: isProduction ? 'warning' : false
    },
    devtool: isProduction ? 'source-map' : 'eval',
    devServer: {
      open: true,
      port: port,  // or simply 9000 if not using a variable
      static: {
        directory: path.join(__dirname, './dist'), // Correct usage of 'static'
      }
    },
    resolve: {
      extensions: ['.js', '.jsx'],
      alias: {
        'react-planner': path.join(__dirname, '../src/index')
      },
      fallback: {
        "path": require.resolve("path-browserify")
      }
    },
    module: {
      rules: [{
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }

        }]
      }, {
        test: /\.(jpe?g|png|gif|mtl|obj)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            hash: 'sha512',
            digest: 'hex',
            name: '[path][name].[ext]',
            context: 'demo/src'
          }
        }]
      }, {
        test: /\.css$/,
        use: [
          { loader: 'style-loader/url' },
          { loader: 'file-loader' }
        ]
      }]
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: PAGE_TITLE,
        template: './src/index.html.ejs',
        filename: 'index.html',
        inject: 'body',
        production: isProduction
      })
    ],
    optimization: {
      minimize: isProduction,
      splitChunks: {
        cacheGroups: {
          default: false,  // Disable the default cache group behavior
          commons: {
            chunks: 'all',  // Target both dynamic and initial chunks
            minSize: 10000,  // Minimum size to create a new chunk
            reuseExistingChunk: true,  // Reuse existing chunks if possible
            name: false,  // Name the chunk 'commons'
          },
          vendor: {
            test: /[\\/]node_modules[\\/]/,  // Target node_modules
            // name: 'vendor',  // Name the chunk 'vendor'
            chunks: 'all',
          },
        },
      },
    }
  };

  if (isProduction) {
    config.plugins.push(new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }));
  }

  config.plugins.push(new webpack.DefinePlugin({
    isProduction: JSON.stringify(isProduction)
  }));

  return config;
};

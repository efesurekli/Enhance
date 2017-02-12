const path = require('path');
const webpack = require("webpack");
const BUILD_DIR = "./client/public";
const SRC_DIR = "./client/src";
const plugins = [
  new webpack.ProvidePlugin({
      "React": "react"
  })
];

if (process.env.NODE_ENV === "production") {
  plugins.push(
    new webpack.DefinePlugin({
      "process.env": {
         NODE_ENV: JSON.stringify("production")
       }
    })
  )
  plugins.push(new webpack.optimize.UglifyJsPlugin(
    {
        compress: {
            warnings: false
        }
    }
  ));
}
module.exports = {
    entry: SRC_DIR + '/index.js',
    output: {
        path: __dirname,
        filename: BUILD_DIR + "/bundle.js"
    },
    module: {
        loaders: [{
            test: /\.js(x|)?$/,
            loaders: ['babel-loader?presets[]=es2015,presets[]=react,presets[]=stage-2'],
            include: [
                path.resolve(__dirname, SRC_DIR),
            ],
            exclude: [
                path.resolve(__dirname, "node_modules"),
            ]
          }
        ],
        resolve: {
            extensions: ['', '.js', '.jsx']
        }
    },
    plugins: plugins,
    devtool: 'source-map'
};
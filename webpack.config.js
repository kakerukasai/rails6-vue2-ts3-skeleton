const { basename, dirname, extname, join, resolve, relative } = require('path'),
      { env } = require('process'),
      { sync } = require('glob'),
      VueLoaderPlugin = require('vue-loader/lib/plugin'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin'),
      ManifestPlugin = require('webpack-manifest-plugin')

const rootDir = process.cwd()

const contentBasePath = resolve(__dirname, 'public', 'packs')
const publicPath = '/packs/'
const sourceEntryPaths = ['styles', 'scripts/entries', 'images']
const sourcePath = 'frontend'
const extensions = ['.js', '.ts', '.vue', '.sass', '.scss', '.css', '.png', '.svg', '.gif', '.jpeg', '.jpg']

const extensionGlob = `**/*{${extensions.join(',')}}*`
const ignoreGlob = `**/_*{${extensions.join(',')}}*`

const entryPaths = sourceEntryPaths.map((path) => join(sourcePath, path))
const entryPointPackPaths = entryPaths.map((path) => {
  return sync(join(path, extensionGlob), { ignore: join(path, ignoreGlob) })
})
const packPaths = [].concat(...entryPointPackPaths)
const sourceEntries = packPaths.reduce((map, path) => {
  const namespace = relative(sourcePath, dirname(path))
  map[join(namespace, basename(path, extname(path)))] = [resolve(path)]
  return map
},{})


module.exports = {
  entry: sourceEntries,
  output: {
    path: contentBasePath,
    publicPath: publicPath,
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.(ts|tsx)?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'ts-loader', options: {
              appendTsSuffixTo: [/\.vue$/],
            },
          },
        ],
      },
      {
        test: /\.(scss|css)$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'vue-style-loader',
          'css-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.sass$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'vue-style-loader',
          'css-loader',
          {
            loader: 'sass-loader',
            options: {
              sassOptions: {
                indentedSyntax: true,
              },
            },
          },
        ],
      },
      {
        test: /\.pug$/,
        loader: 'pug-plain-loader',
      },
      {
        test: /\.(jpg|jpeg|png|gif|svg|eot|ttf|woff|woff2|ico)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            publicPath,
            name: env.NODE_ENV === 'production' ? '[path][name]-[hash].[ext]' : '[path][name].[ext]',
          },
        }],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].css' }),
    new VueLoaderPlugin(),
    new ManifestPlugin({
      fileName: 'manifest.json',
      publicPath,
      writeToFileEmit: true,
    }),
  ],
  resolve: {
    extensions,
    alias: {
      'images': rootDir + '/frontend/images',
      'scripts': rootDir + '/frontend/scripts',
      'styles': rootDir + '/frontend/styles',
    },
  },
  devServer: {
    publicPath,
    contentBase: contentBasePath,
    host: '0.0.0.0',
    port: 3035,
    disableHostCheck: true,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
  },
}

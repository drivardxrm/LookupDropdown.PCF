const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const SpeedMeasurePlugin = require('speed-measure-webpack-plugin')
const smp = new SpeedMeasurePlugin()

module.exports = smp.wrap({
  //devtool: 'source-map',
  plugins: [
    new CleanWebpackPlugin()
  ]
})

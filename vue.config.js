const path = require("path");

module.exports = {
    devServer: {
        host: 'localhost'
    },
    outputDir: path.resolve(__dirname, "../../cordova/cgpa-calculaor/www/"),
    assetsDir: "static",
    publicPath:'./'
}

const path = require('path')
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  configureWebpack: config => {
    if (process.env.NODE_ENV === "development") {
      config.devtool = "source-map";
    } else if (process.env.NODE_ENV === "production") {
      config.devtool = "eval-source-map";
    }
  },
  // chainWebpack: config => {
  //   config.resolve.alias.set("@", resolve("src"));
  //   config.module.rules.delete("svg");
  //   config.module
  //     .rule("svg-smart")
  //     .test(/\.svg$/)
  //     .include.add(resolve("src/icons/svg"))
  //     .end()
  //     .use("svg-sprite-loader")
  //     .loader("svg-sprite-loader")
  //     .options({
  //       symbolId: "[name]"
  //     });
  // },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [path.resolve(__dirname, "src/assets/index.less")]
    }
  },
  css: {
    loaderOptions: {
      // 向 CSS 相关的 loader 传递选项
      less: {
        javascriptEnabled: true
      }
    }
  },
  lintOnSave: false,
  devServer: {
    open: process.platform === 'darwin',
    host: '0.0.0.0',
    port: 8080,
    https: false,
    hotOnly: false,
    // 参阅 https://github.com/vuejs/vue-cli/blob/dev/docs/cli-service.md#configuring-proxy
    // proxy: {
    //     '/': {
    //         target: '192.168.1.132:3000/',
    //         ws: false
    //     }
    // }, 
    proxy: { //代理地址 可配置多个
      '/api': {
        target: 'http://127.0.0.1:8081',
        ws: false,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/aurora-web/api'
        }
      }
    },
    before: app => { }
  }
}

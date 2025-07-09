module.exports = {
  transpileDependencies: true,
  publicPath: '/',
  outputDir: 'dist', // 输出文件目录
  assetsDir: 'assets', // 静态资源目录
  devServer: {
    host: '127.0.0.1',
    port: 3000, // 启动端口
    open: true,
    proxy: {
      '/ai': {
        target: 'http://127.0.0.1:8080', // 改成你后端端口
        changeOrigin: true,
        pathRewrite: {
          '^/ai': '/ai' // 可选，保持路径不变
        }
      }
    }
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'ZJ';
      return args;
    });
  }
};


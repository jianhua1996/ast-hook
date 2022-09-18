const MitmProxy = require('http-mitm-proxy');
const processFileType = require('./processFileType');
const hookJs = require('./core/index');

const proxy = new MitmProxy();

process.env.UV_THREADPOOL_SIZE = '128'; // 处理etimeout报错

proxy.onError(function (ctx, err) {
  console.error('proxy error:', err);
});

proxy.onRequest((ctx, callback) => {
  const { url } = ctx.clientToProxyRequest; // 留个位置，判断该请求是否被处理过

  let chunks = [];
  ctx.onResponseData((ctx, chunk, callback) => {
    chunks.push(chunk);
    return callback(); // don't write chunks to client response
  });

  ctx.onResponseEnd((ctx, callback) => {
    const { headers } = ctx.serverToProxyResponse;
    const contentType = headers['content-type'];

    if (!contentType) return callback();

    const fileType = processFileType.find(t => contentType.includes(t));
    if (fileType) {
      // 只处理js和html文件
      const newChunks = hookJs(chunks, fileType);
      // 设置
      chunks = []; // 清空chunk;
    }
    return callback();
  });

  return callback();
});

proxy.listen({ port: 10086 });

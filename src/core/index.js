const jscodeshift = require('jscodeshift');
const cheerio = require('cheerio');

function ast(jscode) {
  // 解析js代码
  if (!jscode) return;
  console.log(jscode);
  //
}

function getJsCode(html) {
  // 解析html中的js代码
  const $ = cheerio.load(html);
  const scripts = $('script:not([src])');

  scripts.each(function (i, el) {
    ast($(el).text());
  });
}

module.exports = function (chunks, fileType) {
  if (!chunks.length) return;

  const content = Buffer.concat(chunks).toString();

  if (fileType === 'javascript') {
    return ast(content);
  } else if (fileType === 'html') {
    return getJsCode(content);
  }
};

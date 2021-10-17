/**
 * ajax 每次发送请求时都会先调用 ajaxPrefilter 此函数可以拿到 ajax 提供的配置对象
 */
$.ajaxPrefilter(function (config) {
  // 拼接请求的根路径
  config.url = "http://api-breakingnews-web.itheima.net" + config.url;
  // 设置统一的请求头
  if (config.url.indexOf("/my/") !== -1)
    config.headers = {
      Authorization: localStorage.getItem("token") || "",
    };
  // 统一挂载 complete 回调函数
  config.complete = function (res) {
    // 在回调函数中, 使用 responseJSON.message 拿到服务器响应的数据
    if (
      res.responseJSON.status === 1 &&
      res.responseJSON.message === "身份认证失败！"
    ) {
      localStorage.removeItem("token");
      location.href = "/login.html";
    }
  };
});

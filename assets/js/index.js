$(function () {
  /**
   * 监听退出按钮的 click 事件
   * 1. 询问用户是否要退出登录
   * 2. 用户确认退出 清空 token 跳转到登录页面 关闭弹出层
   */
  $(".logout").on("click", function () {
    layer.confirm(
      "确认退出登录吗?",
      { icon: 3, title: "提示" },
      function (index) {
        localStorage.removeItem("token");
        location.href = "/login.html";
        layer.close(index);
      }
    );
  });

  initUserInfo();
});

/**
 * 获取用户基本信息
 */
function initUserInfo() {
  $.ajax({
    type: "get",
    url: "/my/userinfo",
    success: function (res) {
      if (res.status !== 0) layer.msg("获取用户信息失败！");
      renderUserInfo(res.data);
    },
  });
}
/**
 * 渲染用户信息
 * @param {object} data 需要渲染的数据
 */
function renderUserInfo(data) {
  const name = data.nickname || data.username;
  const textAvatar = name.charAt(0).toUpperCase();
  // 渲染头部区域的用户信息
  if (data.user_pic) {
    // 有图片的头像, 渲染图片头像
    $("#header-avatar").html(`<img src="${data.user_pic}" class="layui-nav-img">
      个人中心`);
  } else {
    // 没有图片的头像，渲染 “文本头像”
    $("#header-avatar").html(`<div class="text-avatar">${textAvatar}</div>
      个人中心`);
  }

  // 渲染侧边栏的用户信息
  if (data.user_pic) {
    // 渲染图片头像
    $(".user-info-box").html(`<img src="${data.user_pic}" class="layui-nav-img">
      <span class="welcome">&nbsp;欢迎&nbsp; ${name}</span>`);
  } else {
    // 渲染文本头像
    $(".user-info-box").html(`<div class="text-avatar">${textAvatar}</div>
      <span class="welcome">&nbsp;欢迎&nbsp; ${name}</span>`);
  }

  // 在页面元素动态生成好之后，调用 layui 提供的 element.render() 函数, 重新渲染指定区域的效果
  layui.element.render("nav", "header-nav");
}

// 定义切换高亮的函数
function highlight(kw) {
  console.log("index 页面中的 highlight 函数被调用了！");
  $("dd").removeClass("layui-this");
  $(`dd:contains("${kw}")`).addClass("layui-this");
}

$(function () {
  /**
   * 获取用户基本信息
   */
  function initUserInfo() {
    $.ajax({
      type: "get",
      url: "/my/userinfo",
      success: function (res) {
        layui.form.val("user-form", res.data);
      },
    });
  }

  initUserInfo();

  /**
   * 自定义校验规则: 昵称的校验规则
   */
  layui.form.verify({
    nickname: [/^\S{1,10}$/, "昵称必须是1-10位的非空字符"],
  });

  /**
   * 监听表单的 submit 事件
   */
  $('[lay-filter="user-form"]').on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        // 让页面重新调用 initUserInfo()
        if (res.status === 0) window.parent.initUserInfo();
        layer.msg(res.message);
      },
    });
  });

  /**
   * 监听重置按钮的 click 事件
   * 1. 阻止默认行为
   */
  $('[type="reset"]').on("click", function (e) {
    e.preventDefault();
    initUserInfo();
  });
});

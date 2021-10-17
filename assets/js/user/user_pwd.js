$(function () {
  layui.form.verify({
    /**
     * 验证密码长度
     */
    pwd: [/^\S{6,15}$/, "密码必须是6-15位的非空字符"],

    /**
     * 验证新旧密码是否一致
     * @param {string} value 第一次输入的新密码
     * @returns 提示信息
     */
    samePwd: function (value) {
      if (value === $('[name="oldPwd"]').val()) return "新旧密码不能一致！";
    },

    /**
     * 验证两次新密码是否一致
     * @param {string} value 再次输入的新密码
     * @returns 提示信息
     */
    rePwd: function (value) {
      if (value !== $('[name="newPwd"]').val()) return "确认新密码不一致！";
    },
  });

  /**
   * 监听表单的 submit 事件
   */
  $("#formUpdatePwd").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/updatepwd",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status === 0) {
          localStorage.removeItem("token");
          layer.alert(
            res.message + "请重新登录！",
            { icon: 1 },
            function (index) {
              window.parent.location.href = "/login.html";
              layer.close(index);
            }
          );
        } else layer.msg(res.message, { icon: 2 });
      },
    });
  });
});

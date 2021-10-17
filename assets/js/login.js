$(() => {
  /**
   * 点击“去注册”链接, 展示“注册”, 隐藏“登录”
   */
  $('#link-reg').on('click', () => {
    $('.reg-box').show()
    $('.login-box').hide()
  })

  /**
   * 点击“去登录”链接, 展示“登录”, 隐藏“注册”
   */
  $('#link-login').on('click', () => {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  /**
   * 自定义校验规则
   * 使用 layui.form.verify() 函数
   * 以键值对的形式定义, 自定义校验规则的名字 : 自定义的校验规则 [正则, 错误提示]
   */
  layui.form.verify({
    uname: [/^[a-zA-Z0-9]{1,10}$/, '用户名必须是1-10位的字母和数字'],
    pwd: [/^\S{6,15}$/, '密码必须是6-15位的非空字符'],
    /**
     * 判断两次密码是否一致
     * @param {string} value 确认密码框的值
     * @returns 提示信息
     */
    repwd: value => {
      if (value !== $('.reg-box [name="password"]').val()) return '两次密码不一致！'
    }
  })

  /**
   * 监听注册表单的 submit 事件
   * 1. 阻止表单默认提交行为
   * 2. 发起注册 POST 请求
   * 3. 判断是否注册成功
   * 4.1. 注册成功则提示用户注册成功, 并隐藏“注册”，展示“登录”
   * 4.2. 注册失败则提示用户失败原因
   */
  $('.reg-box form').on('submit', e => {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/api/reguser',
      data: $(this).serialize(),
      success: res => {
        if (res.status === 0) {
          layer.msg(res.message + '请登录！')
          $('#link-login').click()
        } else {
          layer.msg(res.message)
        }
      }
    })
  })

  /**
   * 监听登录表单的 submit 事件
   * 1. 阻止表单默认提交行为
   * 2. 发起登录 POST 请求
   * 3. 判断是否登录成功
   * 4.1. 登录成功则存储 token 值到本地, 并跳转至后台主页
   * 4.2. 登录失败则移除 token
   */
  $('.login-box form').on('submit', e => {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/api/login',
      data: $(this).serialize(),
      success: res => {
        if (res.status === 0) {
          layer.msg(res.message)
          localStorage.setItem('token', res.token)
          location.href = '/bigevent-web/index.html'
        } else {
          layer.msg(res.message)
          localStorage.removeItem('token')
        }
      }
    })
  })
})

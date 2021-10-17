$(function () {
  initCateList()

  /**
   * 初始化文章分类
   * 发送请求, 把获取到的数据，循环渲染到页面的表格中
   */
  function initCateList() {
    $.ajax({
      url: '/my/bigevent-web/article/cates',
      success: function (response) {
        const rows = []
        response.data.forEach((item, index) => {
          rows.push(`
          <tr>
            <td>${index + 1}</td>
            <td>${item.name}</td>
            <td>${item.alias}</td>
            <td>
              <button type="button" class="layui-btn layui-btn-xs btn-edit" data-id="${
                item.Id
              }">修改</button>
              <button type="button" class="layui-btn layui-btn-danger layui-btn-xs btn-delete" data-id="${
                item.Id
              }">删除</button>
            </td>
          </tr>          
          `)
          $('tbody').html(rows)
        })
      }
    })
  }

  let addIndex = null
  /**
   * 监听添加分类按钮的 click 事件
   * 1. 展示弹出层
   */
  $('#btnShowAdd').on('click', function () {
    addIndex = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '添加文章分类',
      content: $('#template-add').html()
    })
  })

  /**
   * 自定义表单的校验规则
   * 分类名称的校验规则
   * 分类别名的校验规则
   */
  layui.form.verify({
    name: [/^\S{1,10}$/, '分类名称必须是1-10位的非空字符'],
    alias: [/^[a-zA-Z0-9]{1,15}$/, '分类别名必须是1-15位的字母和数字']
  })

  /**
   * 监听添加表单的 submit 事件
   * 1. 阻止默认行为
   * 2. 发送添加数据请求
   * 2.1. 成功则提示用户添加成功, 刷新分类列表, 关闭弹框
   */
  $('body').on('submit', '#form-add', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/my/bigevent-web/article/addcates',
      data: $(this).serialize(),
      success: function (response) {
        if (response.status === 0) {
          initCateList()
          layer.close(addIndex)
        }
        layer.msg(response.message)
      }
    })
  })

  let editIndex = null
  /**
   * 通过代理的方式监听修改按钮的 click 事件
   * attr() 获取到的属性的值是字符串
   */
  $('tbody').on('click', '.btn-edit', function () {
    let id = $(this).attr('data-id')
    // "修改文章分类" 弹出层
    editIndex = layer.open({
      type: 1,
      area: ['500px', '250px'],
      title: '修改文章分类',
      content: $('#template-edit').html()
    })

    /**
     * 回显数据请求
     * 1. 根据 id 获取文章分类数据
     * 2. 把获取到的数据，回显到表单中
     */
    $.ajax({
      url: '/my/bigevent-web/article/cates/' + id,
      success: function (response) {
        if (response.status === 0) layui.form.val('form-edit', response.data)
      }
    })
  })

  /**
   * 监听修改表单的 submit 事件
   * 1. 阻止默认提交行为
   * 2. 发起修改数据请求
   * 2.1. 成功则刷新列表数据, 关闭弹出层, 提示用户
   */
  $('body').on('submit', '#form-edit', function (e) {
    e.preventDefault()
    $.ajax({
      type: 'post',
      url: '/my/bigevent-web/article/updatecate',
      data: $(this).serialize(),
      success: function (response) {
        if (response.status === 0) {
          initCateList()
          layer.close(editIndex)
        }
        layer.msg(response.message)
      }
    })
  })

  /**
   * 通过代理的方式监听删除按钮的 click 事件
   */
  $('tbody').on('click', '.btn-delete', function () {
    let id = $(this).attr('data-id')
    // "是否删除" 弹出层
    layer.confirm('是否删除?', { icon: 3, title: '提示' }, function (index) {
      $.ajax({
        url: '/my/bigevent-web/article/deletecate/' + id,
        success: function (response) {
          if (response.status === 0) initCateList()
          layer.close(index)
          layer.msg(response.message)
        }
      })
    })
  })
})

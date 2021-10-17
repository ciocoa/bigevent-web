$(() => {
  /**
   * 配置裁剪区域
   */
  const options = {
    aspectRatio: 1, // 纵横比
    preview: '.img-preview' // 指定预览区域
  }
  $('#image').cropper(options)

  /**
   * 监听选择图片的 click 事件
   * 1. 模拟文件上传的 click 行为 (隐藏了文件上传 input 框)
   */
  $('#btnChooseImg').on('click', () => {
    $('#file').click()
  })

  let file = null
  /**
   * 监听文件选择框的 change 事件
   * 1. 获取用户选择的文件列表（伪数组）
   * 2. 判断用户是否选择了文件（伪数组的长度）
   * 2.1. 否，则把 file 重置为 null 并 return
   * 2.2. 是，则把图片渲染到页面的 img 标签中
   *
   * 注: URL.createObjectURL() 函数接收一个文件，返回这个文件的 URL 地址
   *     cropper("destroy") 销毁旧的裁剪区域
   *     attr("src", imgURL) 重新设置图片路径
   *     cropper(options) 初始化裁剪区域
   */
  $('#file').on('change', e => {
    const files = e.target.files
    if (files.length === 0) return (file = null)
    file = files[0]
    const imgURL = URL.createObjectURL(files[0])
    $('#image').cropper('destroy').attr('src', imgURL).cropper(options)
  })

  /**
   * 监听上传按钮的 click 事件
   * 1. 把选择的图片转为 base64 格式
   * 2. 监听文件读取完成的 load 事件
   * 3. 获取裁剪之后的图片并转为 base64 格式
   * 4. 发起上传头像请求
   * 4.1. 请求成功则提示用户并更新父页面（index）中用户的头像
   */
  $('#btnUploadImg').on('click', () => {
    if (!file) return layer.msg('请先选择要上传的头像！')
    let fr = new FileReader()
    fr.readAsDataURL(file)
    fr.addEventListener('load', () => {
      let data = $('#image')
        .cropper('getCroppedCanvas', {
          width: 100,
          height: 100
        })
        .toDataURL('image/png')
      $.ajax({
        type: 'post',
        url: '/my/update/avatar',
        data: {
          avatar: data
        },
        success: res => {
          let icon = { icon: 2 }
          if (res.status === 0) {
            icon = { icon: 1 }
            window.parent.initUserInfo()
          }
          layer.msg(res.message, icon)
        }
      })
    })
  })
})

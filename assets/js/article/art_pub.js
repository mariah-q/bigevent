$(function () {
    var layer = layui.layer
    var form = layui.form

    initCate()

    // 初始化富文本编辑器
    initEditor()

    //定义加载文章分类的方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败')
                }
                //调用模板引擎渲染分类下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //记得调用 form.render() 方法重新渲染界面
                form.render()
            }
        })
    }


    // ======裁剪区域
    // 1. 初始化图片裁剪器
    var $image = $('#image')

    // 2. 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }

    // 3. 初始化裁剪区域
    $image.cropper(options)


    // 为选择图片按钮绑定点击事件
    $('#btnChooseImage').on('click', function () {
        $('#coverfile').click()
    })

    //监听coverfile的change事件，获取用户选择的文件列表
    $('#coverfile').on('change', function (e) {
        //更换裁剪的图片
        var file = e.target.files[0]    //拿到用户选择的文件
        var newImgURL = URL.createObjectURL(file)   //根据选择的文件，创建一个对应的 URL 地址：
        $image      //先销毁旧的裁剪区域，再重新设置图片路径，之后再创建新的裁剪区域
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域
    })


    //定义文章的发布状态status
    var art_state = '已发布'
    //为存为草稿按钮绑定点击事件
    $('#btnSave').on('click', function () {
        art_state = '草稿'
    })



    //为表单绑定submit提交事件
    $('#form-pub').on('submit', function (e) {
        e.preventDefault()
        var fd = new FormData($(this)[0])

        fd.append('state', art_state)

        // ========将裁剪后的图片，输出为文件
        $image
            .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {       // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                fd.append('cover_img', blob)
                publishArticle(fd)
            })
    })

    //定义一个发表文章的方法
    function publishArticle(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            // 注意：如果向服务器提交得是 FormData 格式的数据，必须有以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败')
                }
                layer.msg('发布文章成功')
                // 发布成功后，跳转至文章列表页面
                location.href = '/article/art_list.html'
            }
        })
    }
})
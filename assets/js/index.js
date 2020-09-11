$(function () {
    //调用获取用户基本信息
    getUserInfo()

    var layer = layui.layer
    //点击按钮实现退出功能
    $('#btnLogout').on('click', function () {
        //提示用户是否确认退出
        layer.confirm('确定退出登录？', { icon: 3, title: '提示' }, function (index) {

            //退出成功  1.清空本地存储中token，2.重新跳转至登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'
            //关闭conform弹出框
            layer.close(index);
        })
    })
})






// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        //headers 请求头配置对象

        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败')
            }
            //调用 renderAvatar 渲染头像
            renderAvatar(res.data);
        },
        //无论调用成功或者失败，最终都会调用complete回调函数
        /*    complete: function (res) {
               //在 complete 回调函数中，拿到服务器响应的结果 可以使用 res.responseJSON 属性
               if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
                   //1.强制清空token 2.强制跳转至登录页面
                   localStorage.removeItem('token')
                   location.href = '/login.html'
               }
           } */
    })
}
//渲染用户头像函数
function renderAvatar(user) {
    //1.获取用户名
    var name = user.nickname || user.username
    //设置欢迎文本
    $('#welcome').html('欢迎&nbsp;&nbsp;' + name)
    //2.渲染头像
    if (user.user_pic !== null) {
        //2.1渲染图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.text-avatar').hide()
    }
    //2.2渲染文本头像
    $('.layui-nav-img').hide()
    var first = name[0].toUpperCase()
    $('.text-avatar').html(first).show()
}
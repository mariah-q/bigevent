//每次调用$ajax/$post/$get会先调用ajaxPrefilter这个函数
//在函数中可以拿到ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url

    //统一为有权限的接口，设置headers请求头
    if (options.url.indexOf('/my/' !== -1)) {
        options.headers = {
            Authorization: localStorage.getItem('token') || '',
        }
    }

    //全局统一挂在 complete 回调函数
    options.complete = function (res) {
        //在 complete 回调函数中，拿到服务器响应的结果 可以使用 res.responseJSON 属性
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            //1.强制清空token 2.强制跳转至登录页面
            localStorage.removeItem('token')
            location.href = '/login.html'
        }
    }
})
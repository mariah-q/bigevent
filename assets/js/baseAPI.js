//每次调用$ajax/$post/$get会先调用ajaxPrefilter这个函数
//在函数中可以拿到ajax提供的配置对象
$.ajaxPrefilter(function (options) {
    options.url = 'http://ajax.frontend.itheima.net' + options.url
    console.log(options.url);

})
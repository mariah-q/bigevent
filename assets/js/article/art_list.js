$(function () {
    var layer = layui.layer
    var form = layui.form
    var laypage = layui.laypage;

    //定义美化时间过滤器
    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)

        var y = dt.getFullYear()
        var m = dt.getMonth() + 1
        m = m <= 9 ? '0' + m : m
        var d = dt.getDate()
        d = d <= 9 ? '0' + d : d

        var h = dt.getHours()
        h = h <= 9 ? '0' + h : h
        var mi = dt.getMinutes()
        mi = mi <= 9 ? '0' + mi : mi
        var ss = dt.getSeconds()
        ss = ss <= 9 ? '0' + ss : ss

        return y + '-' + m + '-' + d + ' ' + h + ':' + mi + ':' + ss
    }

    //定义查询的参数对象，在将来请求参数的时候，将参数对象提交到服务器
    var q = {
        pagenum: 1, 	//页码值
        pagesize: 2,    //每页显示多少条数据
        cate_id: '',	//文章分类的 Id
        state: ''	    //文章的状态，可选值有：已发布、草稿
    }

    initTable()
    //获取文章列表数据方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取文章列表失败')
                }
                //使用模板引擎渲染页面数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
                //调用渲染分页方法
                renderPage(res.total)
            }
        })
    }

    initCate()
    //初始化文章分类方法
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类数据失败')
                }
                //调用模板引擎渲染分类的可选项
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                //通知layui重新渲染表单
                form.render()
            }
        })
    }

    //为筛选表单绑定 submit 事件
    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        //获取表单中选中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        //为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        //根据最新筛选条件，重新渲染表格数据
        initTable()
    })

    //定义渲染分页的方法
    function renderPage(total) {
        //通过laypage.render() 方法渲染分页结构
        laypage.render({
            elem: 'pageBox',    // 分页容器id
            count: total,       //  总数据条数
            limit: q.pagesize,  //  每页显示几条数据
            curr: q.pagenum,     //  设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],


            //分页发生改变的时候，调用jump回调
            //jump 回调函数调用有两种
            //1.点击切换页码
            //2.只要 调用了 laypage.render() 方法 就会触发
            jump: function (obj, first) {
                //将最新页码值，赋值到q这个查询参数对象中
                q.pagenum = obj.curr
                //将最新页条数，赋值到q这个查询参数对象中
                q.pagesize = obj.limit

                // initTable() 直接调用会出现死循环

                //当第二个参数为true,表示采用第二种方法调用jump回调函数，当第二个参数为undefined,则表示采用点击分页方式调用jump回调函数
                if (!first) {
                    initTable()
                }
            }
        })

    }

    //通过代理形式给删除按钮添加点击事件
    $('tbody').on('click', '.btn-delete', function () {
        //获取删除按钮个数
        var len = $('.btn-delete').length
        //获取删除文章id
        var id = $(this).attr('data-id')

        //询问用户是否删除数据
        layer.confirm('确定删除吗?', { icon: 3, title: '提示' }, function (index) {
            //do something
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败')
                    }
                    layer.msg('删除文章成功')
                    //当数据删除后，判断当前页码还有无数据，如果没有需要先将 页码-1，在调用initTable方法
                    if (len === 1) {
                        //证明页面没数据了
                        //页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })

            layer.close(index);
        });
    })
})
import { request } from '../../request/index'
Page({
    data: {
        goods:[],
        // 取消按钮的显示/隐藏
        isFocus: true,
        inputValue: ''
    },
    TimeId: -1,

    // 监听输入框输入
    handleInput(e) {
        clearTimeout(this.TimeId)
        // 1. 获取输入框的值
        let {value} = e.detail
        value = value.trim()
       
         // 2. 检测合法性
         if (!value) {
             this.setData({
                 goods: [],
                 isFocus: true
             })
             return;
         }
         this.setData({
             isFocus: false,
             inputValue: value
         })
         // 3. 发送请求

         // 防抖
         this.TimeId = setTimeout(() => {
            this.query(value)
         },300)



    },
    // 取消按钮
    hadnleCancel(e) {
        this.setData({
            goods:[],
            inputValue: '',
            isFocus: true
        })
    },

    // 发送请求
    async query(query) {
       console.log(query);
        const res = await request(
            {
                url: '/goods/qsearch',
                data: {query}
            }
        )
        console.log(res.data.message);
        this.setData({
            goods: res.data.message
        })
       

    }
    ,
    debounce:  function(cb, delay = 3000) {
        let timer = null;
        return function() {
            if (timer) clearTimeout(timer)
            timer = setTimeout(() => {
                cb.apply(this, arguments)
                timer = null
            },delay)
        }
    }
})
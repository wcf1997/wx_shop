// pages/category/index.js
import {request} from '../../request/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 左侧的菜单数据
        leftMenuList: [],
        // 右侧的分类数据
        rightContent: [],
        currentIndex: 0,
        // 滚动条滚动到顶部的距离
        scrollTop: 0
    },
    // 接口返回的数据
    Cates: [],


  
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 0 web 中的本地存储和 小程序的本地存储的区别
        //   1. 写代码的方式不一样
        // web端 localStorage.setItem('key','value') localStorage.getItem('key')
        //   2. web 端存储需要转换成字符串形式或json形式
        // 1. 先判断一下本地存储中有没有旧数据 {time: Data.now()}
        // 2. 没有旧数据 直接发送请求
        // 3. 有旧的数据 同时 旧数据没有过期 就使用 本地存储中的旧数据即可

        // 1. 获取本地存储中的数据
        const Cates = wx.getStorageSync('cates')
        // 2. 判断
        if (!Cates) {
            // 没有旧数据
            this.getCategory()
        } else {
            // 有旧数据 定义一个过期时间
            if (Date.now() - Cates.time > 1000 * 300) {
                // 重新发请求
                this.getCategory()
                
            } else {
                 
                this.Cates = Cates.data
                let leftMenuList = this.Cates.map(item => item.cat_name)
                // 构造右侧商品分类数据
                let rightContent = this.Cates[0].children 
                this.setData({
                    leftMenuList,
                    rightContent
                })
            }

        }
        
    },
   async getCategory() {
     
    //    request({
    //         url: '/categories'
    //     }).then( res => {
    //         this.Cates = res.data.message
    //         // 构造左侧的大菜单数据

    //         // 把接口数据存储到本地存储中
    //         wx.setStorageSync('cates', 
    //         {timer: Date.now(),data: this.Cates})

    //         let leftMenuList = this.Cates.map(item => item.cat_name)
    //         // 构造右侧商品分类数据
    //         let rightContent = this.Cates[0].children 
    //         this.setData({
    //             leftMenuList,
    //             rightContent
    //         })
    //     })
    let res = await request({
        url: '/categories'
    })
    this.Cates = res.data.message
            // 构造左侧的大菜单数据

            // 把接口数据存储到本地存储中
            wx.setStorageSync('cates', 
            {timer: Date.now(),data: this.Cates})

            let leftMenuList = this.Cates.map(item => item.cat_name)
            // 构造右侧商品分类数据
            let rightContent = this.Cates[0].children 
            this.setData({
                leftMenuList,
                rightContent
            })
    },
    // 左侧菜单的点击事件
    handleItemTap(e) {
        const {index:currentIndex} = e.currentTarget.dataset
        let rightContent = this.Cates[currentIndex].children 
        this.setData({
            currentIndex,
            rightContent,
            scrollTop: 0
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})
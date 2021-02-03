// pages/goods_list/index.js
import {request} from '../../request/index'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        tabs: [
           {
            id: 0,
            value: '综合',
            isActive: true
           },
           {
            id: 1,
            value: '销量',
            isActive: false
           },
           {
            id: 2,
            value: '价格',
            isActive: false
           }

        ],
        goodsList: []
    },

    QueryParams: {
        query: '',
        cid: '',
        pagenum: 1,
        pagesize: 10,
    } ,
    totalPages: 1
    ,

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.QueryParams.cid = options.cid || ''
        this.QueryParams.query = options.query || ''
        this.getGoodsList()
    },
    async getGoodsList() {
       
        let res = await request({
            url:'/goods/search',
            data: this.QueryParams
        })
        
        // 获取总条数
        const total = res.data.message.total
        // 计算总页数
        this.totalPages = Math.ceil( total / this.QueryParams.pagesize)
        let goodsList = res.data.message.goods
       
        // 添加商品数据
        this.setData({
            goodsList: [...this.data.goodsList, ...goodsList]
        })
        
        // 关闭微信下拉刷新 如果没有调用下拉刷新的窗口 直接关闭也不会报错
        wx.stopPullDownRefresh()
       
    }
    ,
    tabsItemChange(e) {
        // 1.获取被点击的标题索引
        const {index} = e.detail
        // 2.修改源数组
        let {tabs} = this.data
        tabs.forEach((item,i) => i === index? item.isActive = true:item.isActive=false) 
        this.setData({
            tabs
        })
    },
    // 页面上滑 滚动条触底事件
    onReachBottom() {
        /**
         * 1. 判断还没有没有下一页数据
         *    1.1 获取总页数
         *         总页数 = Math.ceil( 总条数 / 页容量 pagesize)
         *    1.2 当前页 >= 总页数 则显示没有更多数据
         *
         */
        if (this.QueryParams.pagenum >= this.totalPages) {
            // 没有下一页数据
           wx.showToast({
             title: '没有下一页数据了',
           })
        } else {
            // 还有下一页数据
            this.QueryParams.pagenum ++;
            this.getGoodsList()
        }
        
    },
    // 页面下拉刷新
    onPullDownRefresh() {
        /**
         * 刷新时，要重置商品数组和请求数据
         */
        // 1. 重置页码
        this.QueryParams.pagenum = 1
        // 2. 重置数组
        this.setData({
            goodsList: []
        })
        // 3. 发起请求
        this.getGoodsList()
    }
})
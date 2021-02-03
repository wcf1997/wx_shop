/*
1页面被打开的时候onShow
0 onShow不同于onLoad无法在形参上接收options参数
1获取url_上的参数type
2根据type去发送请求获取订单数据
3渲染页面
I
2点击不同的标题重新发送请求来获取和渲染数据
*/
import {request} from '../../request/index'
import { formatTime } from '../../utils/util'
const fmtTime = require('../../utils/util')
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
                value: '待付款',
                isActive: false
            },
            {
                id: 2,
                value: '待收货',
                isActive: false
            },
            {
                id: 3,
                value: '退货/退款',
                isActive: false
            }
        ],
        orders: []
    },
    cartList: [],
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function() {
        let orders = wx.getStorageSync('my_goods')
        orders = orders.map(item => {
            
            return {
                ...item,
                create_time_CN:  new Date(item.create_time*1000).toLocaleString()
                ,statusCN: item.status === 1? '支付成功':'待支付'
            }
        })
       this.cartList = orders
    },
    onShow: function () {
      
        // 1. 获取当前小程序的页面栈-数组 长度最大是10页面
        let pages = getCurrentPages()
          // 2. 数组中索引最大的页面为当前页面
        let currentPage = pages[pages.length -1]
        let type = currentPage.options.type
        const token = wx.getStorageSync('token')
        if(!token) {
            wx.navigateTo({
              url: '/pages/auth/index',
            })
            return
        }
        type = type || 1
        this.getCartList(type)
       
       this.changeTitleByIndex(type -1)
        this.getOrders(type)
    },
    async getOrders(type) {
        const res = await request ({
            url: '/my/orders/all',
            data:{type}
        })
       
        
    }
    ,
    changeTitleByIndex (index) {
        // 2.修改源数组
        let {tabs} = this.data
        tabs.forEach((item,i) => i === index ? item.isActive = true:item.isActive=false) 
        this.setData({
            tabs
        })
    }
    ,
    tabsItemChange(e) {
        // 1.获取被点击的标题索引
        const {index} = e.detail
        // 2.修改源数组
        this.changeTitleByIndex(index)
        this.getOrders(index + 1)
        this.getCartList(index + 1)
    },
    // 获取订单信息
    getCartList(type) {
    
        let orders = this.cartList
     
        // 显示商品
        if (type === 3) {
            orders = orders.filter(item => item.pay_status === 3)
        }  
        this.setData({
            orders
        })
    }
})
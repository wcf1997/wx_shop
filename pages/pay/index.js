/*
1页面加载的时候
1从缓存中获取购物车数据渲染到页面中
这些数据checked=true
2微信支付
1哪些人哪些帐号可以实现微信支付
1企业帐号
2企业帐号的小程序后台中必须给开发者添加上白名单
1一个appid 可以同时绑定多个开发者
2这些开发者就可以公用这个appid和它的开发权限
3支付按钮
1先判断缓存中有没有token
2没有跳转到授权页面进行获取token
3有token
4创建订单获取订单编号
5. 已经完成了微信支付
6. 手动删除已付款的购物车数据 
7. 删除数据后填充回缓存
8. 跳转页面

*/

import {
    getSetting,
    chooseAddress,
    openSetting,
    showModel,
    showToast,
    requestPayment
} from '../../utils/asyncWx'
import {
    request
} from '../../request/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        address: {},
        cartList: [],
        allChecked: false,
        totalPrice: 0,
        totalNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

    },
    onShow() {
        // 1. 获取缓存中的收货地址
        const address = wx.getStorageSync('address')
        const cartList = wx.getStorageSync('cart') || []
        // 计算全选
        // 空数组调用 every 会默认返回true


        // 2. 给 data 设置值
        if (address) {
            address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
        }
        this.setData({
            address,

        })
        // 过滤购物车数组
        let checkedCart = cartList.filter(item => item.checked)

        this.setCart(checkedCart)
    },
    // 点击收货地址事件
    async handleChooseAddress() {
        /**
         * 2获取用户对小程序所授予获取地址的权限状态scope
            1假设用户点击获取收货地址的提示框确定authSetting scope.address
            scope值true直接调用获取收货地址
            2假设用户从来没有调用过收货地址的api
            scope undefined 直接调用获取收货地址3假设用户点击获取收货地址的提示框取消scope值 false
            1诱导用户自己打开授权设置页面当用户重新给与获取地址权限的时候2获取收货地址

         */
        try {
            // 1. 获取权限状态
            let res1 = await getSetting()
            const scopeAddress = res1.authSetting["scope.address"]

            if (scopeAddress === false) {
                // 打开授权页面
                await openSetting()
            }

            // 调用小程序内置 API 获取用户收货地    
            let res2 = await chooseAddress()
            // 获取到地址，存储到本地存储
            wx.setStorageSync('address', res2)
            console.log(res2);
        } catch (error) {
            console.log(error);
        }

    },

    // 设置购物车 总价格 购买的数量
    setCart(cartList) {

        // 计算总价格  计算总物品
        let totalPrice = 0,
            totalNum = 0;
        totalPrice = cartList.reduce((pre, item) => {
            if (item.checked) {
                totalNum += item.num
                return pre + (item.goods_price * item.num)
            } else {
                return pre + 0
            }
        }, 0)

        this.setData({

            cartList,
            totalNum,
            totalPrice
        })

    },


    // 支付按钮
    async handleOrderPay() {
        // 1. 判断缓存有没有token
        const token = wx.getStorageSync('token')
        // 2. 判断
        if (!token) {
            wx.navigateTo({
                url: '/pages/auth/index',
            })
            return
        }
        // 3. 创建订单
        // 3.1 准备请求头参数
        // const header = {
        //     Authorization: token
        // }
        // 3.2 准备请求体参数
        const order_price = this.data.totalPrice
        const consignee_addr = this.data.address.all
        const {
            cartList
        } = this.data
        let goods = []
        cartList.forEach(item => goods.push({
            godos_id: item.goods_id,
            goods_number: item.goods_num,
            goods_price: item.goods_price
        }))
        const orderParams = {
            order_price,
            consignee_addr,
            goods
        }
        // 4. 发送请求
        const res = await request({
            url: '/my/orders/create',
            method: 'POST',
            data: orderParams,
            
        })
        res.data.message = {
              "pay": {
                "timeStamp": "1564730510",
                "nonceStr": "SReWbt3nEmpJo3tr",
                "package": "prepay_id=wx02152148991420a3b39a90811023326800",
                "signType": "MD5",
                "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
              },
              "order_number": "HMDD20190802000000000422"
            },
        res.data.meta =  {
            "msg": "预付订单生成成功",
            "status": 200
          }
          
        let {order_number} = res.data.message
        // 5. 发起预支付
        const  res2 = await request({
            url: '/my/orders/req_unifiedorder',
            method: 'POST',
            data: {order_number}
        })
        console.log(res2);
        
        // res2.data.message = {
        //     "pay": {
        //         "timeStamp": "1564730510",
        //         "nonceStr": "SReWbt3nEmpJo3tr",
        //         "package": "prepay_id=wx02152148991420a3b39a90811023326800",
        //         "signType": "MD5",
        //         "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
        //       }
        // }
  
        // 5. 发起支付
        const {pay} = res.data.message
        // const res3 = await requestPayment(pay)
       let res3 = await showModel({content: '确定要支付吗?'})
       // 6. 完成支付，删除购物车已支付的商品，重新存储
       let my_goods = wx.getStorageSync('my_goods') || []
       let goods_item  = {}
       
      
      
       if (res3.confirm === true) {
      
           // 记录支付完成的商品
        
        goods_item.pay_status = 1
       
        wx.navigateTo({
          url: '/pages/cart/index',
        })

       }  else  {
           // 记录待支付的商品
        
        goods_item.pay_status = 2
        wx.navigateTo({
          url: '/pages/order/index?type=2',
        })

       }

       goods_item['order_num'] = order_number
       goods_item.create_time = pay.timeStamp
       goods_item.goods = [...cartList]
       goods_item.totalPrice = this.data.totalPrice
       goods_item.totalNum = this.data.totalNum
      my_goods.unsh(goods_item)
   //    记录待支付和完成支付的订单
      wx.setStorageSync('my_goods', my_goods)

        // 删除购物车中已经支付成功的商品
        let newCart = wx.getStorageSync('cart')
        newCart = newCart.filter(item => !item.checked)
        wx.setStorageSync('cart', newCart)
 
       
    }
})
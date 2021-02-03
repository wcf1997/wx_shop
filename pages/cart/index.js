// pages/cart/index.js
import {
    getSetting,
    chooseAddress,
    openSetting,
    showModel,
    showToast
} from '../../utils/asyncWx'
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
            address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo   
        }
        this.setData({
            address,
        
        })
        this.setCart(cartList)
    }
    ,
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
    // 商品的选中事件
    handleItemChange(e) {
        // 1. 获取被点击的商品id
        let {id: goods_id} = e.currentTarget.dataset
        // 2. 获取购物车数组
        let {cartList} = this.data
        // 3. 找到被修改的商品对象
        let index = cartList.findIndex((item, index) => {
            return item.goods_id === goods_id
        })
        // 4. 选择状态取反
        cartList[index].checked = !cartList[index].checked
        this.setData({
            cartList
        })
        this.setCart(cartList)
    },
    // 设置购物车状态 重新计算 底部工具栏 全选 总价格 购买的数量
    setCart(cartList) {
        let allChecked = true
        // 计算总价格  计算总物品
        let totalPrice = 0, totalNum = 0;
       if (cartList.length > 0) {
        totalPrice = cartList.reduce((pre, item) => {
            if (item.checked) {
                totalNum += item.num
                return pre +( item.goods_price * item.num)
            }else {
                // 设置全选按钮的选中状态
                allChecked = false
                return pre + 0
                
            }
        },0)
       
       } else {
           allChecked = false
       }
       this.setData({
        allChecked,
        cartList,
        totalNum,
        totalPrice
       })
       wx.setStorageSync('cart', cartList)

    },
    // 全选按钮
    handleAllChange() {
        let {cartList, allChecked} = this.data
        allChecked = !allChecked
       cartList.forEach(item => item.checked = allChecked)
        this.setCart(cartList)
    },
    // 操作数量
    async handleNumEdit(e) {
        // 获取传递过来的参数
        let {opt, id:goods_id} = e.currentTarget.dataset
        let { cartList } = this.data
        let index = cartList.findIndex(item => item.goods_id === goods_id)
        // 当商品数量为1时再减少时，判断是否删除商品
        if (opt === -1 && cartList[index].num === 1) {
           
           let res = await showModel({content: '您是否要删除该商品'})
           if (res.confirm) {
               cartList.splice(index, 1)
               this.setCart(cartList)
           }
        } else {
            cartList[index].num += opt
            this.setCart(cartList)
        }
       
       
    },
    // 结算按钮
   async handlePay() {
        // 1. 判断收货地址
        const {address, totalNum} = this.data
        if (!address.userName) {
            await showToast({title: '您还没有选择收货地址'})
            return

        }
        // 2. 判断购买物品数量
        if (totalNum === 0) {
            await showToast({title: '您还没有选购商品'})
            return
        }
        // 3. 跳转结算界面
        wx.navigateTo({
          url: '/pages/pay/index',
        })
        
    }
})
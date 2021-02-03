// pages/goods_detail/index.js
import {
    request
} from '../../request/index'
import {showToast} from '../../utils/asyncWx'
Page({

    /**
     * 页面的初始数据
     */
    data: {
        goodsObj: {},
        // 商品是否被收藏过
        isCollect: false
    },
    GoodsInfo: {},
    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        let pages = getCurrentPages()
        let currentPage = pages[pages.length - 1]
        let options = currentPage.options
        let {
            goods_id
        } = options
        this.getGoodsInfo(goods_id)


    },

    async getGoodsInfo(goods_id) {
        let res = await request({
            url: '/goods/detail',
            data: {
                goods_id
            }
        })
        let data = res.data.message
        this.GoodsInfo = data
        // 1.获取缓存中商品搜藏的数组
        let collect = wx.getStorageSync('collect') || []
        // 2. 判断当前商品是否被收藏
        let isCollect = collect.some(item => item.goods_id)
        this.setData({
            goodsObj: {
                goods_name: data.goods_name,
                goods_price: data.goods_price,
                goods_introduce: data.goods_introduce.replace(/\.webp/g, '.jpg'),
                pics: data.pics
            },
            isCollect
        })
    },
    // 点击图片轮播图进行预览图片
    handlPreviewImg(e) {
        // 获取当前被点击图片的索引值
        let {
            index
        } = e.currentTarget.dataset
        // 拿到需要预览的图片路径数组
        let urls = this.GoodsInfo.pics.map(item => item.pics_mid)
        //    利用 wx.previewImage API 实现
        wx.previewImage({
            urls,
            current: urls[index]
        })
    },
    // 添加到购物车
    handleCartAdd(e) {
        // 1. 获取缓存中的购物车数组
        let cart = wx.getStorageSync('cart') || []
        // 2. 判断 商品对象是否存在于购物车
        let index = cart.findIndex(item => item.goods_id === this.GoodsInfo.goods_id)
        if (index === -1) {
            // 3.商品数据不存在
            this.GoodsInfo.num = 1
            this.GoodsInfo.checked = true
            cart.push(this.GoodsInfo)
        } else {
            // 4. 商品已存在 
            cart[index].num++
        }
        // 5. 把购物车重新添加到缓存中
        wx.setStorageSync('cart', cart)
        // 6. 弹窗提示
        wx.showToast({
            title: '添加成功',
            mask: true
        })
    },
    //    收藏商品事件
   async handleCollect() {
        // 1. 获取缓存中的收藏列表
        let collect = wx.getStorageSync('collect') || []
        // 2. 判断该商品是否被收藏过
        let index = collect.findIndex(item => item.goods_id)
        // 3. index !== -1 表示已存在
        if (index !== -1) {
            collect.splice(index, 1)
            await showToast({title: '取消收藏成功'})
        } else {
            collect.push(this.GoodsInfo)
            await showToast({title: '收藏成功'})
        }
        wx.setStorageSync('collect', collect)
        this.setData({
            isCollect: !this.data.isCollect
        })

    }
})
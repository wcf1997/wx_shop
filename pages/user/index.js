// pages/user/index.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        collectNum: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onShow: function () {
        let userInfo = wx.getStorageSync('userInfo') || {}
        let collect = wx.getStorageSync('collect') || []

        this.setData({
            userInfo,
            collectNum: collect.length
        })
        
    },

    
})
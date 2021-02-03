
Page({
    data: {
        tabs: [
            {
                id: 0,
                value: '商品收藏',
                isActive: true
            },
            {
                id: 1,
                value: '品牌收藏',
                isActive: false
            },
            {
                id: 2,
                value: '店铺收藏',
                isActive: false
            },
            {
                id: 3,
                value: '浏览足迹',
                isActive: false
            }
        ],
        collect: []
    },
    onShow: function() {
        const collect = wx.getStorageSync('collect') || []
        this.setData({
            collect
        })
    },
    changeTitleByIndex (index) {
        // 2.修改源数组
        let {tabs} = this.data
        tabs.forEach((item,i) => i === index ? item.isActive = true:item.isActive=false) 
        this.setData({
            tabs
        })
    },
    tabsItemChange(e) {
        // 1.获取被点击的标题索引
        const {index} = e.detail
        // 2.修改源数组
        this.changeTitleByIndex(index)
        this.getOrders(index + 1)
   
    },
})
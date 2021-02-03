// index.js
// 引入发送请求的方法
import { request } from "../../request/index.js";
Page({
  data: {
    swiperList:[],
    cateList: [],
    // 楼层分类数据
    floorList: []
    
  },

  onLoad: function() {
    // 请求数据
  this.getSwiperList()
  this.getCateList()
  this.getFloorData()
   
  },
  // 获取轮播图数据
  getSwiperList() {
    request({ url: '/home/swiperdata',
  }).then (res => {
    let swiper = res.data.message;
    this.setData({
      "swiperList": swiper
    })
  })
  }
  ,
   // 获取分类导航数据
  getCateList() {
    request({
   url: '/home/catitems',
  }).then (res => {
    let cateList = res.data.message;
    this.setData({
      "cateList": cateList
    })
  })
  },
  // 获取楼层分类数据
  getFloorData() {
    request(
      {url: '/home/floordata'}
    ).then( res => {
      let data = res.data.message
      data.forEach((item1) => {
        item1.product_list.forEach(item2 => {
          item2.navigator_url = item2.navigator_url.replace('?','/index?')
        })
      })
      this.setData({
        "floorList": data
      })
    })
  }
})

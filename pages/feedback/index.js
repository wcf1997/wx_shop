/**
 * 点击 “+” 触发tab事件
 * 1. 调用小程序内置的 选择图片 api
 * 2. 把获取到的图片的路径数组
 * 3. 把图片路径数组 存储到 data 中
 *
 * 
 */

 import {showToast} from '../../utils/asyncWx'
Page({
    data: {
        tabs: [
            {
                id: 0,
                value: '体验问题',
                isActive: true
            },
            {
                id: 1,
                value: '商家、商品投诉',
                isActive: false
            },
        
        ],
        // 被选中的图片路径数组
        imgArr: [],
        // 文本域内容
        inputValue: ''
    }
    ,
    // 图片的外链数组
    upLoadImg: []
    ,
    // 获取本地图片路径
    hadnleChooseImg(e) {
        // 1. 调用小程序内置的选择图片的api
        wx.chooseImage({
        // 同时选中的图片最大数量
          count: 9,
        // 图片的格式 原图， 压缩
        sizeType: ['original','compressed'],
        // 图片的来源
        sourceType: ['album','camera'],
        success : (res) => {
     
        this.setData({
            imgArr: [...this.data.imgArr, ...res.tempFilePaths]
        })

        }

        })  
    },
    // 移除图片
    removeImg(e) {
        //  获取要删除的图片索引
        let {index} = e.currentTarget.dataset
        let {imgArr} = this.data
        imgArr.splice(index,1)
        this.setData({
            imgArr
        })
        
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
//  输入框输入事件
    handleInput(e) {
        let {value} = e.detail
        this.setData({
            inputValue: value
        })
    },
    // 提交按钮事件
    async fromSubmit(e) {
        /**
         * 3点击“提交”
            1获取文本域的内容类似输入框的获取
            1 data中定义变量表示输入框内容
            2文本域绑定输入事件事件触发的时候把输入框的值存入到变量中
            2对这些内容合法性验证
            3验证通过用户选择的图片上传到专门的图片的服务器返回图片外网的链接
            4文本域和外网的图片的路径一起提交到服务器前端的模拟不会发送请求到后台
            5清空当前页面
            6返回上一页

         */
        // 1. 获取文本域的内容
        const {inputValue, imgArr} = this.data
        // 2. 检验合法性
        if (!inputValue.trim()) {
            // 不合法
            await showToast({title:'输入不合法',mask: true,icon: 'none'})
            return
        }
        wx.showLoading({
          title: '上传评论中...请稍后',
        })

        // 判断有没有需要上传的图片数组
        if (this.data.imgArr.length > 0) {
             // 3. 上传图片
        // 上传图片的 API 不支持 多个图片同时上传
            imgArr.forEach((item, index) => {
                wx.uploadFile({
                    // 被上传的图片的路径
                      filePath: item,
                    // 上传图片的名称   
                      name: 'imgUpLoad'+index,
                      // 图片上传的地址 用新浪图传模拟
                      url: 'https://imgchr.com/',
                      // 顺带的文本信息
                      formData: {},
                      success:(res) => {
                        //   图片上传成功后获取返回的图片外链并添加到数组
                        // this.upLoadImg.push(res)
                        
                        // 等所有图片上传完毕后跳转页面
                        if (index === imgArr.length - 1) {
                            wx.hideLoading({
                              success: (res) => {},
                            })
                            wx.navigateBack({
                              delta: 1,
                            })
                        }
                      }
                    })
               })
        }else {
            wx.hideLoading({
                success: (res) => {},
              })
              wx.navigateBack({
                delta: 1,
              })
        }
       
       
    }
})
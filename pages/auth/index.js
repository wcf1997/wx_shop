// pages/auth/index.js
import {login} from '../../utils/asyncWx'
import {request} from '../../request/index'
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    async handlegetUserInfo(e) {
        // 1. 获取用户信息
        const { encryptedData, rawData, iv, signature} = e.detail
        // 2. 获取微信小程序登陆成功后的code值
        const {code} = await login()
        const loginParams = {encryptedData, rawData, iv, signature, code}
        
        // 3. 发送token请求
        const res = await request({
            url: '/users/wxlogin',
            data: loginParams,
            methods: 'POST'
        })
        
        res.token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo"
        const {token} = res

        // 4. 存储token
        wx.setStorageSync('token', token)
        wx.navigateBack({
          delta: 1,
        })
   
        
    }
})
// 同时发送异步代码的次数 解决多次请求时加载提示图标显示异常问题与数据不同步问题
let ajaxTimes = 0
export const request = (params) => {
  // 判断 url 中是否带有/my/
  let header = {...params.header}
  if (params.url.includes('/my/')){
    // 拼接 header 带上 token
    header["Authorization"] = wx.getStorageSync('token')
  }
    ajaxTimes ++
     // 加载中提示进度条
     wx.showLoading({
        title: '加载中...',
        mask: true
      })

    // 定义基础路径https://api-hmugo-web.itheima.net/api/public/v1
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    
    return new Promise((resolve, reject) => {
        wx.request({
          ...params,
          url:baseUrl + params.url,
          success: (res) => {
              
              resolve(res)
          },
          error: (err) => {
              reject(err)
          },complete: () => {
              ajaxTimes --
              if (ajaxTimes === 0) {
                // 关闭加载数据的图标
                wx.hideLoading()
              }
          }
        })
    })
}
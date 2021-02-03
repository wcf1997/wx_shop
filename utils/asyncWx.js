export const getSetting = () => {
    return new Promise((resolve, reject) => {
        wx.getSetting({
          withSubscriptions: true,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
              reject(err)
          }
        })
    })
}

export const chooseAddress = () => {
    return new Promise((resolve, reject) => {
        
        wx.chooseAddress({
          success: (result) => {
              resolve(result)
          }
        })
    })
}

export const openSetting = () => {
    return new Promise((resolve, reject) => {
        wx.openSetting({
          withSubscriptions: true,
          success: (res) => {
              resolve(res)
          },
          fail: (err) => {
            reject(err)
        }
        })
    })
}

export const showModel = ({content}) => {
    return new Promise((resolve, reject) => {
        wx.showModal({
            title: '提示',
            content: content,
            success: (res) => {
               resolve(res)
            },fail: (err) => {
                reject(err)
            }
           })
    })
}

export const showToast = ({title}) => {
    return new Promise((resolve, reject) => {
        wx.showToast({
          title,
          icon: 'none',
          success: (res) => {
              resolve(res)
          },fail: (err) => {
              reject(err)
          }
        })
    })
}

export const login = () => {
    return new Promise((resolve, reject) => {
        wx.login({
            timeout: 3000,
            success: (res) => {
                resolve(res)
            }
          })
    })
}

export const requestPayment = (pay) => {
    return new Promise((resolve, reject) => {
        wx.requestPayment({
            ...pay,
            success: (res) => {
                resolve(res)
            },
            fail: (err) => {
                reject(err)
            }
           })
    })
}
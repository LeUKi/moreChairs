/**
 * date:2021.05.09
 * author:kent
 * state:finished
 * content:update code
 */
// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
// 页面数据
let PageData = {
  resCode: 0, //状态码
  result: {}, //查询结果对象
  obj: {} //返回参数对象
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  switch (event.flag) {
    // 查询用户信息 若无记录 则isNewGuys为true
    case 0:
      PageData.result = await db.collection('users').where({
        openId: wxContext.OPENID
      }).get()
      // return PageData.result.data[0].openId
      if (PageData.result.data.length === 0) {
        PageData.obj.isNewGuys = true
        PageData.reCode = 200
        return {
          "resCode": PageData.reCode,
          "Msg": "此用户为新用户",
          "data": PageData.obj
        }

      } else {
        PageData.obj = PageData.result.data[0]
        PageData.obj.isNewGuys = false
        PageData.reCode = 200
        return {
          "resCode": PageData.reCode,
          "Msg": "查询成功",
          "data": PageData.obj
        }
      }
      //用于触底加载功能 初步完成跳过event.skip条记录 查询返回后面的记录
      case 1:
        PageData.result = await db.collection('history').where({
          openId: wxContext.OPENID,
        }).orderBy('sTime', 'desc').skip(event.skip).limit(event.num).get()
        PageData.reCode = 200
        return {
          "resCode": PageData.reCode,
            "Msg": "查询成功",
            "data": PageData.result.data
        }
        //修改用户名 
        case 2:
          PageData.result = await db.collection('users').where({
            openId: wxContext.OPENID
          }).update({
            data: {
              userName: event.userName
            }
          })
          if (PageData.result.errMsg === "collection.update:ok") {
            PageData.reCode = 200
            return {
              "resCode": PageData.reCode,
              "Msg": "更新成功",
              "data": {}
            }
          } else {
            PageData.reCode = 201
            return {
              "resCode": PageData.reCode,
              "Msg": "更新失败",
              "data": {}
            }
          }

          // 添加用户  输入用户名 其余默认
          case 3:
            PageData.result = await db.collection('users').add({
              data: {
                isAdmin: false,
                isOver: true,
                openId: wxContext.OPENID,
                recordNum: 0,
                roomAdminList: [],
                sumTime: 0,
                userName: event.userName
              },
            })
            if (PageData.result.errMsg === "collection.add:ok") {
              PageData.reCode = 200
              return {
                "resCode": PageData.reCode,
                "Msg": "新建成功",
                "data": {}
              }
            } else {
              PageData.reCode = 201
              return {
                "resCode": PageData.reCode,
                "Msg": "新建失败",
                "data": {}
              }
            }
            case 4:
              PageData.reCode = 200
              return {
                "resCode": PageData.reCode,
                  "Msg": "查询成功",
                  "data": {
                    openId: wxContext.OPENID
                  }
              }
              case 5:
                PageData.result = await db.collection('users').where({
                  openId: wxContext.OPENID
                }).field({
                  isOver: true
                }).get()
                if (PageData.result.data.length === 0) {
                  PageData.resCode = 200
                  return {
                    "resCode": PageData.reCode,
                    "Msg": "查询成功",
                    "data": {
                      isNewGuys: true
                    }
                  }
                } else if (PageData.result.data.length === 1) {
                  PageData.reCode = 200
                  return {
                    "resCode": PageData.reCode,
                    "Msg": "查询成功",
                    "data": {
                      isNewGuys: false,
                      isOver: PageData.result.data[0].isOver
                    }
                  }
                } else {
                  PageData.reCode = 201
                  return {
                    "resCode": PageData.reCode,
                    "Msg": "查询错误",
                    "data": {}
                  }
                }
                case 6:
                  PageData.result = await db.collection('users').where({
                    openId: wxContext.OPENID
                  }).field({
                    recordNum: true,
                    sumTime: true,
                    userName: true
                  }).get()
                  if (PageData.result.data.length === 0) {
                    PageData.resCode = 200
                    return {
                      "resCode": PageData.reCode,
                      "Msg": "查询成功",
                      "data": {
                        isNewGuys: true
                      }
                    }
                  } else if (PageData.result.data.length === 1) {
                    PageData.reCode = 200
                    return {
                      "resCode": PageData.reCode,
                      "Msg": "查询成功",
                      "data": {
                        isNewGuys: false,
                        recordNum: PageData.result.data[0].recordNum,
                        sumTime: PageData.result.data[0].sumTime,
                        userName: PageData.result.data[0].recordNum
                      }
                    }
                  } else {
                    PageData.reCode = 201
                    return {
                      "resCode": PageData.reCode,
                      "Msg": "查询错误",
                      "data": {}
                    }
                  }



  }


}
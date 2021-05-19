/**
 * date:2021.05.11
 * author:kent
 * state:finished
 * content:add history:userName
 */

// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
// 初始化数据库
const db = cloud.database()
const _ = db.command

const moment = require("moment-timezone"); // 需在 package.json 中指定并安装依赖

// 初始化响应码resCode 结果result
// 查找用户记录的结果 查询自习室的结果  添加学习记录的结果 更新用户记录的结果 更新自习室的结果
// let result, oresult,hresult,uresult,rresult
let PageData={
  resCode:0,
  result:{},
  oresult:{},
  hresult:{},
  uresult:{},
  rresult:{}
}
// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  PageData.result = await db.collection('users').where({
    openId: wxContext.OPENID 
  }).get()
  // 上次签到是否结束
  if (PageData.result.data[0].isOver === false) {
      PageData.resCode=201
    return {
      "resCode":PageData.resCode,
      "Msg":"上次学习未签退",
      "data":{user:PageData.result.data[0]}
     }

  } else {
    PageData.oresult = await db.collection('rooms').where({
      roomId: event.roomId
    }).get()
    // 自习室是否存在
    if (PageData.oresult.data.length === 0) {
      PageData.resCode = 404
    return {
      "resCode":PageData.resCode,
      "Msg":"自习室不存在",
      "data":{}
     }
    } else {
      // 该位置已有人坐下
      if (PageData.oresult.data[0].chairs.infos[event.chairIndex].openId !== "" && PageData.oresult.data[0].chairs.infos[event.chairIndex].state === true) {
        PageData.resCode = 300
        return {
          "resCode":PageData.resCode,
          "Msg":"位置已被使用",
          "data":{}
         }
      }
      // 自习室没有开门
      else if(PageData.oresult.data[0].isOpen===false){
        PageData.resCode=500
        return {
          "resCode":PageData.resCode,
          "Msg":"自习室未开启",
          "data":{}
         }
      }
      // 理想状态
      else{
        // 更新自习室座位相关信息
      PageData.oresult.data[0].chairs.infos[event.chairIndex].openId=wxContext.OPENID 
      PageData.oresult.data[0].chairs.infos[event.chairIndex].state=true
      PageData.rresult=await db.collection('rooms').where({
        roomId:event.roomId
      }).update({
      data:{
      "chairs.sitDown":_.inc(1),
      "chairs.infos":PageData.oresult.data[0].chairs.infos,
      "count.pepSum":_.inc(1)
      }
      })
      // 更新用户的状态
      PageData.uresult=await db.collection('users').where({
        openId:wxContext.OPENID 
      }).update({
        data:{
          isOver:false
        }
      })
      // 新增历史记录
      PageData.hresult=await db.collection('history').add({
        data:{
        chairIndex:event.chairIndex,
        howlong:0,
        isOver:false,
        openId:wxContext.OPENID ,
        userName:PageData.result.data[0].userName,
        roomId:event.roomId,
        roomName:event.roomName,
        sTime:new Date(),
        eTime:new Date(),
        ssTime:moment().tz("Asia/Shanghai").format(),
        todo:[]  
        } 
      })
      // 签到成功
      if(PageData.rresult.errMsg==="collection.update:ok"&&PageData.uresult.errMsg==="collection.update:ok"&&PageData.hresult.errMsg==="collection.add:ok"){
        PageData.resCode=200
        return {
          "resCode":PageData.resCode,
          "Msg":"签到成功",
          "data":{}
         }
      }
      // 接口错误
      else{
        PageData.reCod=405
        return {
          "resCode":PageData.resCode,
          "Msg":"后台接口错误",
          "data":{}
         }
      }
      }
    }
  }


}
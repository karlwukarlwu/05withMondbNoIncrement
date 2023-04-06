// const express = require("express")
//要注意区分前后端的port
// 这种写法是万一前面有定义port就用前面的 没有就用8000
// "dev": "set PORT=5000 && nodemon src/server.js", 在起始端设置port
// 另一种实现express的办法 用http模块 这样好像整齐

// 通常的写法
// const express = require('express')
// const path = require('path')
// const app = express()
// const PORT = 3000
const http = require('http')
//这个导入好像是为了更整齐
const app = require('./app')
// 这里导入引入的mongoose
const mongoose = require('mongoose')
const {loadPlanetsData} = require('./models/planets.model')

const PORT = process.env.PORT||8000

// 开始上mongoDB
// 中间的的<password>换成自己的密码
const MONOGO_URL = 'mongodb+srv://karlwuca:57zx2016@nasa.kvp3lob.mongodb.net/?retryWrites=true&w=majority'

// 看了半天感觉这一步封装的意义不大
const server = http.createServer(app)

// 这个是看连接上没有 这个是一个观察者模式 连接上以后会log once 是一次性的
mongoose.connection.once('connected',()=>{
    console.log("Mongoose is connected")
})
// 如果出错了这里也会输出
mongoose.connection.on('error',(err)=>{
    console.log(err)
})

//为了解决await不能在直接在外部使用的问题
// 人为造一个async function
async function startServer(){
    // 连接数据库
    // 直接这样写就行了
    await mongoose.connect(MONOGO_URL)

    //top module 这个只在ECMA6的写法才生效
    // 我们的导包方式是 commonjs的写法
    await loadPlanetsData()

    server.listen(PORT,()=>{
        console.log(`${PORT}...`)
    })

}
startServer()


// console.log("...")
// console.log(PORT)
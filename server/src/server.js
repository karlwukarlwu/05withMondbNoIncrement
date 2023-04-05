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
const {loadPlanetsData} = require('./models/planets.model')

const PORT = process.env.PORT||8000
// 看了半天感觉这一步封装的意义不大
const server = http.createServer(app)

//为了解决await不能在直接在外部使用的问题
// 人为造一个async function
async function startServer(){
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
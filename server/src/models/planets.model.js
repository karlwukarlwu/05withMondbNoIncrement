 const {parse} = require('csv-parse')
const fs = require('fs')
const path = require('path')

const habitablePlanets = []


function isHabPlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED' &&
        planet['koi_insol'] > 0.36 &&
        planet['koi_insol'] < 1.11 &&
        planet['koi_prad'] < 1.6
}


// 读取文件的时候是异步的
// 把promise当计时器使用
// 当读到resolve的时候代表任务完成
function loadPlanetsData() {
    return new Promise((resolve, reject) => {
        // fs.createReadStream("../../data/starsData.csv")
        fs.createReadStream(path.join(__dirname,'..','..','data','starsData.csv'))//用path模块的另一种写法
            .pipe(parse({//这个是把读到的csv 数据整合然后再parse输出
                comment: '#',//以#开头的忽略
                columns: true,//每一行是一个对象
            }))
            .on('data', (data) => {
                if (isHabPlanet(data)) {
                    habitablePlanets.push(data)
                }
            }).on('error', (err) => {
            console.log(err)
            reject(err)
        }).on('end', () => {
            console.log(`${habitablePlanets.length} habitable planets found!`)
            // 当读到这里的时候代表着任务完成
            resolve()
        })
        // resolve()
        //     不能放在这里 放在这里等于是在读取文件的时候就已经完成了 异步就要等readStream读完了才能执行
        //     In the second function, resolve() is called outside the on('end') event listener,
        //     which means that the Promise will be resolved immediately after the fs.createReadStream() method
        //     is called, before the file has been fully processed.
        //     This is incorrect because you are resolving the
        //     Promise before the file has been fully processed,
        //     which could lead to unexpected behavior.
    })
}

// 进一步封装 不让数据暴露出去
//  只暴露函数
function getAllPlanets() {
    return habitablePlanets
}


// 问题在于这里 stream的读取是异步的 module 会先执行完
// 如何解决？
// 用promise
module.exports = {
    loadPlanetsData,
    // 当这个变成异步以后 其他调用的地方也要用异步的方式来调用
    // Since loadPlanetsData function is asynchronous and returns a promise,
    // any function that uses it needs to be asynchronous as well
    // and either use async/await or .then()/.catch() to handle the promise.
    getAllPlanets
}
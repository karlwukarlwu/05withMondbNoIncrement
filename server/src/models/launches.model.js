const launchesDatabase = require('./launches.mongo');
// const launches = new Map();
// 当我们想要外键怎么办？
// 直接model里面加约束 因为 nosql 不好加约束
const planets = require('./planets.mongo');

// 通过这个变量来记录最新的任务 以后只需要不断地加1就可以了
// 这个是对应的post方法
let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission: 'Kepler Exploration X',
    rocket: 'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target: 'Kepler-442 b',
    customers: ['ZTM', 'NASA'],
    //加上这个变量 意味着我们可以取消这个
    upcoming: true,
    // 加上这个变量 意味着我们可以知道这个任务是否成功
    success: true,
}
// flightNumber作为key launch作为value
// launches.set(launch.flightNumber, launch);

// 他这里调用saveLaunch 为的是有一个起始的飞机任务
saveLaunch(launch)

// 上mongo
async function saveLaunch(launch) {
    // 这个是为了找到对应的planet
    // 需要target  和名字对应
    const planet = await planets.findOne({
        keplerName: launch.target,
    })
    // 加上这一行以后可以确保我们的任务是有目标的
    // 如果目标错误就会报错
    if(!planet) {
        throw new Error('No matching planet found');
    }

    await launchesDatabase.updateOne({
        // 找到就更新 launch 找不到就插入launch
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true,
    })
//     filter: An object that specifies the query criteria for selecting the document(s)
//     to update. In this case, the filter is { flightNumber: launch.flightNumber },
//     which means the function will look for a document in the launches collection
//     that has a flightNumber property that matches the flightNumber property of
//     the launch object passed as an argument to the saveLaunch() function.
//
//     update: An object that contains the updated values to be applied to
//     the selected document(s). In this case, the launch object is passed
//     directly as the update argument, so all of its properties will be
//     updated in the matching document in the launches collection.
//
//     options: An object that contains optional settings for the update operation.
//     In this case, the upsert option is set to true, which means that
//     if no document is found that matches the filter, a new document
//     will be inserted with the launch object as its values.
}



// 这个函数是为了判断这个任务是否存在
function existsLaunchWithId(launchId) {
    // launches是一个map
    return launches.has(launchId);
}

// 当我们找到了不要的以后 我们不是删除他 而是把他修改了另一个两个都是false的变量
function abortLaunchById(launchId) {
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}


// 将所有转化model数据的工作放在model模块里面
// 只向外界暴露直接使用的方法
async function getAllLaunches() {
    // return Array.from(launches.values());
    // console.log(await launchesDatabase
    //     .find({}, {'_id': 0, '__v': 0}))
    return await launchesDatabase
        .find({}, {'_id': 0, '__v': 0})// 这个是为了不显示id和version
}

// 开始添加post方法
// 这个launch 和上面的const launch 没有任何关系
function addNewLaunch(launch) {
    // 逻辑是用户传一个少三个属性的launch
    // 我们这里默认给加上三个属性
    latestFlightNumber++;
    launches.set(
        latestFlightNumber,
        Object.assign(launch, {
            // 这个launch 和上面的const launch 没有任何关系 这个只和形参launch有关系
            // 这个assign 意思是给传入的参数 launch 添加了四个properties
            upcoming: true,
            success: true,
            flightNumber: latestFlightNumber,
            customer: ['ZTM', 'NASA'],
        })
    );

}

//将launches暴露出去
module.exports = {
    getAllLaunches,
    addNewLaunch,
    existsLaunchWithId,
    abortLaunchById
}
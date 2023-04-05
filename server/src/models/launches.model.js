const launches = new Map();

// 通过这个变量来记录最新的任务 以后只需要不断地加1就可以了
// 这个是对应的post方法
let latestFlightNumber = 100;

const launch = {
    flightNumber: 100,
    mission:'Kepler Exploration X',
    rocket:'Explorer IS1',
    launchDate: new Date('December 27, 2030'),
    target:'Kepler-442 b',
    customer:['ZTM', 'NASA'],
    //加上这个变量 意味着我们可以取消这个
    upcoming:true,
    // 加上这个变量 意味着我们可以知道这个任务是否成功
    success:true,
}
// flightNumber作为key launch作为value
launches.set(launch.flightNumber, launch);

// 这个函数是为了判断这个任务是否存在
function existsLaunchWithId(launchId) {
    // launches是一个map
    return launches.has(launchId);
}
// 当我们找到了不要的以后 我们不是删除他 而是把他修改了另一个两个都是false的变量
function abortLaunchById(launchId){
    const aborted = launches.get(launchId);
    aborted.upcoming = false;
    aborted.success = false;
    return aborted;
}


// 将所有转化model数据的工作放在model模块里面
// 只向外界暴露直接使用的方法
function getAllLaunches() {
    return Array.from(launches.values());
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
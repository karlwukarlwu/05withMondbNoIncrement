const {getAllPlanets} = require('../../models/planets.model')

function httpGetAllPlanets(req,res){
    // return 是为了停止这个function
    return res.status(200).json(getAllPlanets())
}

module.exports = {
    httpGetAllPlanets
}
function response(sts,msg,aftrows,data=null){
    return{
        Status:sts,
        Message:msg,
        Affected__rows:aftrows,
        data:data,
        timestap:new Date().getTime()
    }
}

module.exports = {response};
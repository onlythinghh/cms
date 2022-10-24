const response = {
    success: true,
    errMsg: '',
    code: 1,
    data: {},
    count: 0,
    version: {
        permission: "2019.05.08.15.32.14.716",
        dictionary: "2019.05.08.15.32.14.716"
    }
}
// export default response
class ResponseBody {
    constructor() {
        this.responseData = { ...response }
    }
    setSuccess(isSuccess) {
        this.responseData.success = !!isSuccess
    }
    setCode(code) {
        this.responseData.code = code || 0
    }
    setErrMsg(errMsg) {
        this.responseData.errMsg = errMsg || ''
    }
    getData(req) {
        return this.responseData.data
    }
    setData(data){
        this.responseData.data = data
    }
    setCount(count) {
        this.responseData.count = count
    }
    setVersion({ permission }) {
        this.responseData.version.permission = permission
    }
    response(req) {
        let data = this.getData(req)
        data = data || this.responseData.data
        this.responseData.data = data
        return this.responseData
    }
}

export default ResponseBody

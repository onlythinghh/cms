// import Mockjs from 'mockjs'
import requireContext from '../build/util/require-context'
// import settings from './settings'
const resolveMockResponse = () => {
    const mocks = []
    // 获取所有Mock 请求
    const context = requireContext(__dirname + '/response/', '.', true, /\.js$/)
    context.keys().forEach(mockRequestHandlerFilePath => {
        const mockRequestHandlerModule = context(mockRequestHandlerFilePath)
        const mockRequestHandler = mockRequestHandlerModule.default || mockRequestHandlerModule
        if (mockRequestHandler) {
            if (Array.isArray(mockRequestHandler)) {
                mocks.push(...mockRequestHandler)
            } else {
                mocks.push(mockRequestHandler)
            }
        }
    })
    return mocks
}

const mocks = resolveMockResponse()

const mockResponse = (url, type, response, multipart) => {

    return {
        url: `/mock${url}`,
        type: type || 'get',
        multipart,
        response: (req, res, next) => {
            let _res
            if(response instanceof Function){
                _res = response(req, res, next)
            }else {
                _res = response
            }

            if(_res){
                res.json(_res)
            }
            /* if (settings.isDownload(req.url)) {
                // 支持文件下载
                response instanceof Function ? response(req, res) : null
            } else {
                res.json(Mockjs.mock(response instanceof Function ? response(req, res) : response))
            } */
        }
    }
}

export default mocks.map(({ url, type, response, multipart = false }) => {
    return mockResponse(url, type, response, multipart)
})

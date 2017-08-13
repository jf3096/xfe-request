// {"code":-20101,"message":"请先登录","data":{"request_id":"8CFF3111-EFBD-6D9B-F54F-917AEE96E83A"}}
import ResponseModal from '../src/models/ResponseModal';
const mocks = {
    'https://apps-ws.xoyo.com/passport/get_info': new ResponseModal({
        request_id: '8CFF3111-EFBD-6D9B-F54F-917AEE96E83A'
    }, -20101)
};

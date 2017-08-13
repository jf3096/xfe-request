const enum CodeEnum {
    Success = 1
}

export default class ResponseModal {
    constructor(public data: any, public code: number = CodeEnum.Success, public message: string = '') {
    }
}

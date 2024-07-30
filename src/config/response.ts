export const responseFail = (errCode: number, message: string, payload?: any) => {
    const response = 
    {
        "success": false,
        "payload": payload == undefined ? {} : payload,
        "error": {
          "code": errCode,
          "message": message
        }
    }
    return response;
} 

export const responseSuccess = (payload: any) => {
    const response = 
    {
        "success": true,
        "payload": {
            payload
        }
    }
    return response;
}


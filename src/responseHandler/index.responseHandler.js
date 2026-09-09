class ResponseHandler {
    static success = (res, code, message, data) => {
        return res.status(code ?? 200).json({
            status: 'success',
            message,
            data: data ?? []
        });
    }

    static Error = (res, code, message, Error) => {
        code = message.includes("not found")? 404: code;
        
         return res.status(code ?? 200).json({
            status: 'error',
            message,
            error: Error ?? []
        });
    }
}

module.exports = ResponseHandler;
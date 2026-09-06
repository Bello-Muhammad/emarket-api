class ResponseHandler {
    static success = (res, code, message, data) => {
        return res.status(code ?? 200).json({
            status: 'success',
            message,
            data: data ?? []
        });
    }

    static Error = (res, code, message) => {
         return res.status(code ?? 200).json({
            status: 'error',
            message
        });
    }
}

export default ResponseHandler;
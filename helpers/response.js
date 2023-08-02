const ResponseFromatter = (res, code, data) => {
    switch (code) {
        case 200:
            res.status(200).json({
                code: 200,
                status: 'OK',
                data: data,
            })
            break
        case 201:
            res.status(201).json({
                code: 201,
                status: 'CREATED',
                data: data,
            })
            break
        case 422:
            res.status(422).json({
                code: 422,
                status: 'UNPROCESSABLE_CONTENT',
                error: data,
            })
            break
        case 401:
            res.status(401).json({
                code: 401,
                status: 'NOT_FOUND',
                error: data,
            })
            break
        default:
            break
    }
}

module.exports = { ResponseFromatter }

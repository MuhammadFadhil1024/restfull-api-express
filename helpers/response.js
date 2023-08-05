const ResponseFormatter = (res, code, data) => {
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

const CatchResponse = (res, e) => {
    if (
        e.name === 'SequelizeValidationError' ||
        e.name === 'SequelizeUniqueConstraintError'
    ) {
        const validasiErorr = {}
        e.errors.map((er) => {
            validasiErorr[er.path] = er.message
        })
        return res.status(400).json({
            code: 400,
            status: 'BAD_REQUEST',
            error: validasiErorr,
        })
    } else {
        return res.status(500).json({ error: e })
    }
}

// let response = {
//     code: 200,
//     status: 'SUCCESS',
//     data: null,
// }

// const succesResponse = (res, code, status, data) => {
//     return res.status(code).json({
//         response.code: code,
//         response.status: status,
//         data: data,
//     })
// }

module.exports = { ResponseFormatter, CatchResponse }

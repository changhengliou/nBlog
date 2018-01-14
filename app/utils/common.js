export const sendError = (res, err, status = 500, msg = 'Failed to execute your request.') => {
    console.log(err);
    res.status(500).JSON({ msg: msg });
}
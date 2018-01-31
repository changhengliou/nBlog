export const sendError = (res, err, status = 500, msg = 'Failed to execute your request.') => {
    console.log(err);
    res.status(500).JSON({ msg: msg });
}

export const unauthorizeResult = (res, err) => { 
    console.log(err);
    res.status(403).json({ msg: 'Access Denied' }); 
};

export const internalServerError = (res, err, msg = 'Server Error') => {
    console.log(err);
    res.status(500).json({ msg: msg });
};

export const goneResult = (res, err) => {
    console.log(err);
    res.status(410).json({ msg: 'Resource has been removed' });
}


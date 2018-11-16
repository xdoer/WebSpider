module.exports = {
    key: 'Authorization',
    maxAge: 3600000,
    overwrite: true,
    httpOnly: true,
    signed: true,
    rolling: false,
    renew: false,
};
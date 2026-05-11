const delay = (req, res, next) => {
    setTimeout(() => {
        if (req.headers.authorization) {
            const token = req.headers.authorization.split(' ')[1];
            console.log("check token from delay: ", token);
        }
        next();
    }, 3000);
}
module.exports = delay
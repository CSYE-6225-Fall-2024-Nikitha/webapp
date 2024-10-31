const handleJsonSyntaxError = (err, req, res, next) => {
    return res.status(400).send();
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).send(); 
    }
    next(); 
};

module.exports = handleJsonSyntaxError;
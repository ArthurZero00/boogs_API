export function logger(req, res, next){
    console.log(`Requested: ${req.method}, URL: ${req.url}`);
    next();
}
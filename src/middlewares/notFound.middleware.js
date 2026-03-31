export default function notFoundMiddleware(req, res, next){
    return res.status(404).json({message: 'Path not found'})
}
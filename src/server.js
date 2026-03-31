import 'dotenv/config'
import app from './app.js'

const port = process.env.port || 5000

app.listen(port, () => {
    console.log('Server is running at', port)
})
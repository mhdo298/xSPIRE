import express from 'express';

const server = express()
const port = 3000
const frontendPath: string = "../frontend/dist"
server.use(express.static(frontendPath));

server.get('*', (req, res) => {
    res.sendFile('index.html', {root: frontendPath})
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

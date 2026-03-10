import { createServer } from 'http'

const PORT  = 3000;

const server = createServer((req, res) => {
    res.end('Hello!')
});

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
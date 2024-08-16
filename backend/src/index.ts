import express from 'express';
import pg from 'pg';

const server = express()
const port = 3000
const frontendPath: string = "../frontend/dist"
server.use(express.static(frontendPath));
const pool = new pg.Pool(
    {
        user: 'postgres',
        password: '29082003',
        host: 'localhost',
        port: 5432,
        database: 'postgres',
    }
)
server.get('/api/schedules', async (req, res) => {
    let schedules = await pool.query('SELECT * FROM schedules', [])
    res.json(schedules.rows.map((row) => {
        return {
            id: row['schedule_id'],
            name: row['name'],
        }
    }))
})

server.post('/api/schedules', async (req, res) => {
    let uuid = crypto.randomUUID();
    let schedules = await pool.query(
        'INSERT INTO schedules (schedule_id, name) VALUES($1, $2)',
        [uuid, 'Untitled Document'])
    res.json({
        id: uuid,
        name: 'Untitled Document'
    })
})

server.get('/api/schedules/:id', async (req, res) => {
    let schedules = await pool.query('SELECT * FROM schedules WHERE schedule_id=$1', [req.params.id])
    res.json(schedules.rows.map((row) => {
        return {
            id: row['schedule_id'],
            name: row['name'],
        }
    })[0])
})


server.get('*', (req, res) => {
    res.sendFile('index.html', {root: frontendPath})
})

server.listen(port, () => {
    console.log(`Listening on port ${port}`)
})

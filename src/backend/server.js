const express = require('express')
const app = express()
const port = 3000

const PouchDB = require('pouchdb');
const schedules = new PouchDB('schedules');
app.use(express.json())
app.use(express.static("src/frontend"));

app.get('/schedules/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let schedule = await schedules.get(id)
        res.status(200).send(schedule)
    } catch (e) {
        res.status(404).send({error: 'Schedule Not Found'})
    }

})
app.delete('/schedules/:id', async (req, res) => {
    const id = req.params.id;
    try {
        let schedule = await schedules.get(id)
        await schedules.remove(schedule)
        res.status(200).send('')
    } catch (e) {
        console.error(e)
        res.status(404).send({error: 'Schedule Not Found'})
    }

})
app.get('/schedules', async (req, res) => {
    const allSchedules = await schedules.allDocs({
        include_docs: true
    })
    res.status(200).send(allSchedules.rows.map(s => {
        return {
            name: s.doc.name,
            id: s.doc._id
        }
    }))

})

app.post('/schedules/:id', async (req, res) => {
    const id = req.params.id;
    const body = req.body
    const course = body['course']
    try {
        let schedule = await schedules.get(id);
        (schedule['courses'] || (schedule['courses'] = [])).push(course)
        await schedules.put(schedule)
        res.status(200).send(schedule['courses'])
    } catch (e) {
        res.status(404).send({error: 'Schedule Not Found'})
    }
})
app.post('/schedules', async (req, res) => {
    const body = req.body
    const name = body['name']
    console.log(name)
    let uuid = crypto.randomUUID();
    await schedules.put({_id: uuid, name: name})
    res.status(200).send({id: uuid, name: name})
})
app.get('*', (req, res) => {
    res.sendFile('index.html', {root: 'src/frontend'})
})

app.listen(port, () => {
    console.log(`Listening on port ${port}`)
})
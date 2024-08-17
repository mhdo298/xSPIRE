const express = require('express')
const app = express()
const port = 3000
var fs = require('fs');
var obj = JSON.parse(fs.readFileSync('src/backend/data.json', 'utf8'));
const PouchDB = require('pouchdb');
const schedules = new PouchDB('schedules');
app.use(express.json())
app.use(express.static("src/frontend"));

app.get("/courses", function (req, res) {
    let term = req.query.search
    let response = Object.values(obj).filter((course) => JSON.stringify(course).includes(term))
    res.json(response)
})


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
    const body = req.body
    const course = body['course']
    console.log(course)
    if (course) {
        let schedule = await schedules.get(id);
        schedule['courses'] = (schedule['courses'] || []).filter(c => c !== course)
        await schedules.put(schedule)
        res.status(200).send(schedule['courses'])
    } else {
        try {
            let schedule = await schedules.get(id)
            await schedules.remove(schedule)
            res.status(200).send('')
        } catch (e) {
            console.error(e)
            res.status(404).send({error: 'Schedule Not Found'})
        }
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
        // console.log()
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
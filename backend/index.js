const pg = require('pg')
const client = new pg.Client('postgres://localhost/gamestore')
const cors = require('cors')
const express = require('express')
const app = express()

app.use(cors())

app.get('/api/gamestore', async (req, res, next) => {
    try {
        const SQL = `
        SELECT *
        FROM gamestore
        `
    const response = await client.query(SQL)
    console.log(response.rows)
    res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/videogames', async (req, res, next) => {
    try {
        const SQL = `
            SELECT *
            FROM videogames
        `

        const response = await client.query(SQL)

        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/api/boardgames', async (req, res, next) => {
    try {
        const SQL = `
            SELECT *
            FROM boardgames
        `

        const response = await client.query(SQL)

        res.send(response.rows)
    } catch (error) {
        next(error)
    }
})

app.get('/', (req, res) => {
    res.send('Hello world');
    
  });
  

app.get('/api/videogames/:id', async (req, res, next) => {
    const gameId = req.params.id

    try {
        const SQL = `
            SELECT *
            FROM videogames
            WHERE id = $1
        `

        const response = await client.query(SQL, [gameId])

        if (response.rows.length === 0) {
            return res.status(404).send('Video game not found')
        }

        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.get('/api/boardgames/:id', async (req, res, next) => {
    const gameId = req.params.id

    try {
        const SQL = `
            SELECT *
            FROM boardgames
            WHERE id = $1
        `

        const response = await client.query(SQL, [gameId])

        if (response.rows.length === 0) {
            return res.status(404).send('Board game not found')
        }

        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.post('/api/boardgames', async (req, res, next) => {
    const { name, numplayers } = req.body

    try {
        const SQL = `
            INSERT INTO boardgames (name, numplayers)
            VALUES ($1, $2)
            RETURNING *
        `

        const response = await client.query(SQL, [name, numplayers])

        res.status(201).send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.post('/api/videogames', async (req, res, next) => {
    const { name, numplayers } = req.body

    try {
        const SQL = `
            INSERT INTO videogames (name, numplayers)
            VALUES ($1, $2)
            RETURNING *
        `

        const response = await client.query(SQL, [name, numplayers])

        res.status(201).send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.put('/api/boardgames/:id', async (req, res, next) => {
    const { name, numplayers } = req.body
    const gameId = req.params.id

    try {
        const SQL = `
            UPDATE boardgames
            SET name = $1, numplayers = $2
            WHERE id = $3
            RETURNING *
        `

        const response = await client.query(SQL, [name, numplayers, gameId])

        if (response.rows.length === 0) {
            return res.status(404).send('Board game not found')
        }

        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.put('/api/videogames/:id', async (req, res, next) => {
    const { name, numplayers } = req.body
    const gameId = req.params.id

    try {
        const SQL = `
            UPDATE videogames
            SET name = $1, numplayers = $2
            WHERE id = $3
            RETURNING *
        `

        const response = await client.query(SQL, [name, numplayers, gameId])

        if (response.rows.length === 0) {
            return res.status(404).send('Video game not found')
        }

        res.send(response.rows[0])
    } catch (error) {
        next(error)
    }
})

app.delete('/api/boardgames/:id', async (req, res, next) => {
    const gameId = req.params.id

    try {
        const SQL = `
            DELETE FROM boardgames
            WHERE id = $1
            RETURNING *
        `

        const response = await client.query(SQL, [gameId])

        if (response.rows.length === 0) {
            return res.status(404).send('Board game not found')
        }

        res.send('Board game deleted successfully')
    } catch (error) {
        next(error)
    }
})

app.delete('/api/videogames/:id', async (req, res, next) => {
    const gameId = req.params.id

    try {
        const SQL = `
            DELETE FROM videogames
            WHERE id = $1
            RETURNING *
        `

        const response = await client.query(SQL, [gameId])

        if (response.rows.length === 0) {
            return res.status(404).send('Video game not found')
        }

        res.send('Video game deleted successfully')
    } catch (error) {
        next(error)
    }
})

const init = async () => {
    await client.connect()
    console.log("connected")
    const SQL = `
    DROP TABLE IF EXISTS videogames;
    DROP TABLE IF EXISTS boardgames;
    
    CREATE TABLE boardgames(
        id SERIAL PRIMARY KEY,
        name VARCHAR(75),
        numplayers INT 
    );
    
    CREATE TABLE videogames(
        id SERIAL PRIMARY KEY,
        name VARCHAR(75),
        numplayers INT
    );

    INSERT INTO boardgames (name, numplayers) VALUES ('Sorry', 4);
    INSERT INTO boardgames (name, numplayers) VALUES ('Catan', 6);
    INSERT INTO boardgames (name, numplayers) VALUES ('Monopoly', 6);
    INSERT INTO boardgames (name, numplayers) VALUES ('Scrabble', 4);
    INSERT INTO boardgames (name, numplayers) VALUES ('Sequence', 2);
    INSERT INTO boardgames (name, numplayers) VALUES ('Connect Four', 2);
    INSERT INTO boardgames (name, numplayers) VALUES ('Candy Land', 4);
    INSERT INTO boardgames (name, numplayers) VALUES ('Trouble', 4);
    INSERT INTO boardgames (name, numplayers) VALUES ('Scategories', 6);
    INSERT INTO boardgames (name, numplayers) VALUES ('Trivial Pursuit', 6);

    INSERT INTO videogames (name, numplayers) VALUES ('Baldurs Gate', 4);
    INSERT INTO videogames (name, numplayers) VALUES ('Lethal Company', 50);
    INSERT INTO videogames (name, numplayers) VALUES ('Battlefield', 32);
    INSERT INTO videogames (name, numplayers) VALUES ('Risk of Rain 2', 4);
    INSERT INTO videogames (name, numplayers) VALUES ('Fallout 3', 1);
    INSERT INTO videogames (name, numplayers) VALUES ('Super Mario World', 2);
    INSERT INTO videogames (name, numplayers) VALUES ('The Finals', 3);
    INSERT INTO videogames (name, numplayers) VALUES ('Tekken', 2);
    INSERT INTO videogames (name, numplayers) VALUES ('Skrim', 1);
    INSERT INTO videogames (name, numplayers) VALUES ('World of Warcraft', 20);
    `
    await client.query(SQL)

    const port = 3001
    app.listen(port, () => {
        console.log(`listening on ${port}`)
    })
}
init()
 

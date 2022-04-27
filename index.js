const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456"
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523"
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345"
  },
  {
    id: 4,
    name: "Mary Poppendick",
    number: "39-23-6423122"
  },
]

app.use(cors())
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :response-time ms - :body - :req[content-length]'));

app.get('/api/info', (req, res) => {
  const today  = new Date().toString();
  const numberOfPersons = Object.keys(persons).length
  res.send(`<p>Phonebook has info for ${numberOfPersons} people </br> ${today}</p>`)
})

app.get('/api/persons', (req, res) => {
  res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  const person = persons.find(person => person.id === id)

  if (person) {
    res.json(person)
  } else {
    res.status(404).end()
  }
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number) {
    return res.status(400).json({
      error: 'Name or number is missing'
    })
  }
  if (persons.find(person => person.name.toLowerCase() === body.name.toLowerCase())) {
    return res.status(400).json({
      error: 'Name is already in the phonebook'
    })
  }
  if (persons.find(person => person.number.toLowerCase() === body.number.toLowerCase())) {
    return res.status(400).json({
      error: 'Number is already in the phonebook'
    })
  }

  const generatedId = Math.floor(Math.random() * 1000)

  const person = {
    id: generatedId,
    name: body.name,
    number: body.number
  }
  
  persons = persons.concat(person)

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = Number(req.params.id)
  persons = persons.filter(person => person.id != id)

  res.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
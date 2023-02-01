const express = require('express')
const app = express()

app.use(express.json())

const morgan = require('morgan')

morgan.token('body', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
]

app.get('/api/persons', (request, response) => {
  response.send(persons)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(p => p.id === id)

  if (person) {    
		response.json(person)  
	} 
	else {    
		response.status(404).end()  
	}
})

const generateId = () => {
  return Math.floor(Math.random() * 9999)
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'field missing'
    })
  }

  if (persons.find( ({name}) => name === body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  } 

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }
   
  persons = persons.concat(person);
	response.json(person)  
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  persons = persons.filter(p => p.id !== id)

  response.status(204).end()  
})

app.get('/api/info', (request, response) => {
  response.send(
    `<div>Phonebook has info for ${persons.length} people</div>
     <div>${new Date()}</div>`
  )
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
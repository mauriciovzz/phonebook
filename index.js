const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()

const Person = require('./models/person.js')

const morgan = require('morgan')

morgan.token('body', function (request) {
  return JSON.stringify(request.body)
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person
    .findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.statusCode(404).end
      }
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person ({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(result => {
      response.json(result)
    })
    .catch(error => {next(error)})
})

app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person
    .findByIdAndUpdate(
      request.params.id,
      { name, number },
      { new: true, runValidators: true, context: 'query' }
    )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person
    .findByIdAndDelete(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/api/info', (request, response, next) => {
  Person
    .countDocuments({})
    .then(result => {
      response.send(
        `<div>Phonebook has info for ${result} people</div>
        <div>${new Date()}</div>`
      )
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
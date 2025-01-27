const express = require('express')
const app = express()
var morgan = require('morgan')
require('dotenv').config()
const Person = require('./modules/person')

morgan.token('body', (req) => {
  return JSON.stringify(req.body)
})

const cors = require('cors')

app.use(express.static('dist'))
app.use(cors())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.json())


app.get('/info', (request, response) => {
  Person.find({}).then(result => {
    const personsnum = result.length
    const timestamp =  new Date()
    response.send(
      '<h2>Phonebook has info for ' + personsnum +' people</h2>' +
      '<h2>' + timestamp +'</h2>'
    )
  })
})

app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(result => {
    response.json(result)
  })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  // const id = Number(request.params.id)
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.json(result).status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body
  console.log(body)
  const newperson = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, newperson, { new: true, runValidators: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

// function getRandomInt(min, max) {
//   return Math.floor(Math.random() * (max - min + 1)) + min
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body
  console.log(body)
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }else if(!body.number){
    return response.status(400).json({
      error: 'number missing'
    })
  // }else if(persons.find(element => element.name == body.name)){
  //   return response.status(400).json({
  //     error: 'name must be unique'
  //   })
  }
  console.log('pass')

  const newperson = new Person({
    name: body.name,
    number: body.number
  })

  newperson.save()
    .then(savedPerson => {
      console.log('person saved!')
      response.json(savedPerson)
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// handler of requests with unknown endpoint
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
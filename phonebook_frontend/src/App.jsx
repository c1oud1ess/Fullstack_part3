import axios from 'axios'
import './index.css'
import { useState, useEffect } from 'react'

const Filter = ({filter,setFilter}) => {

  const handleFilterChange = (event) => {
    console.log(event.target.value)
    setFilter(event.target.value)
  }

  return(
    <div>
      filter shown with: <input value={filter} onChange={handleFilterChange}/>
    </div>
  )
}

const PersonForm  = ({persons,setPersons,setMessage,setErrorMessage}) => {

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const addPerson = (event) => {
    event.preventDefault()
    if (persons.some(person => JSON.stringify(person.name) === JSON.stringify(newName))) {
      if(confirm(newName + " is already added to phonebook, replace the old number with a new one?")){
        const existPerson = persons.find(person => JSON.stringify(person.name) === JSON.stringify(newName))
        const changedPerson = { ...existPerson, number: String(newNumber) }
        axios
          .put(`/api/persons/${existPerson.id}`,changedPerson)
          .then(response => {
            console.log(response)
            setPersons(persons.map(person => person.id !== existPerson.id ? person : response.data))
            setMessage(
              "Changed " + newName + "'s number"
            )
            setTimeout(() => {
              setMessage(null)
            }, 5000)
            setNewName('')
            setNewNumber('')
          })
          .catch(error => {
            console.error(error)
            setErrorMessage(
              error.response.data.error
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }else{
      const personObject = {
        name: newName,
        number: newNumber,
        // id: String(persons.length + 1)
      }  
      axios
        .post('/api/persons', personObject)
        .then(response => {
          console.log(response)
          setPersons(persons.concat(response.data))
          setMessage(
            "Added " + newName
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          setNewName('')
          setNewNumber('')
        })
        .catch(error => {
          console.log(error.response.data.error)
          setErrorMessage(
            error.response.data.error
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  return(
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNameChange}/>
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNumberChange}/>
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({persons,filter,setPersons}) => {

  const Delete = (id,name) => {
    if(confirm("delete " + name + " ?")){
      const url = `/api/persons/${id}`
      axios.delete(url)
        .then(response => {
          console.log(`Post with id ${id} deleted successfully!`)
          const newPersons = persons.filter(person => person.id !== id)
          console.log(response)
          setPersons(newPersons)
        })
        .catch(error => {
          console.error('There was an error deleting the post!', error)
        })
    }
  }

  return(
    <ul>
      {persons.map(person => 
        {
          if(person.name.toLowerCase().includes(filter.toLowerCase())){
            return(
              <p key={person.id}>
                {person.name} {person.number} <button onClick={() => Delete(person.id,person.name)}>delete</button>
              </p>
            )
          }
        }
      )}
    </ul>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className='notification'>
      {message}
    </div>
  )
}

const ErrorNotification = ({ errormessage }) => {
  if (errormessage === null) {
    return null
  }

  return (
    <div className='errornotification'>
      {errormessage}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [message, setMessage] = useState(null)
  const [errormessage, setErrorMessage] = useState(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    console.log('effect')
    axios
      .get('/api/persons')
      .then(response => {
        console.log(response)
        setPersons(response.data)
      })
      .catch(error =>
        console.error(error)
      )
  }, [])

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorNotification errormessage={errormessage} />
      <Filter filter={filter} setFilter={setFilter}/>
      <h3>Add a new</h3>
      <PersonForm persons={persons} setPersons={setPersons} setMessage={setMessage} setErrorMessage={setErrorMessage}/>
      <h3>Numbers</h3>
      <Persons persons={persons} filter={filter} setPersons={setPersons}/>
    </div>
  )
}

export default App
const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://zhihanzhang778:${password}@fullstackcluster.r94lf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FullstackCluster`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  Person.find({}).then(result => {
    result.forEach(person => {
      console.log(person)
    })
    mongoose.connection.close()
  })
}else{
  const name = process.argv[3]
  const number = process.argv[4]

  const newperson = new Person({
    name: name,
    number: number,
  })

  newperson.save().then(result => {
    console.log(result)
    console.log(`added ${name} number ${number} to phonebook`)
    mongoose.connection.close()
  })
}


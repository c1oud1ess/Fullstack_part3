const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

console.log('connecting to ' + url)

// const password = process.argv[2]

// const url =
//   `mongodb+srv://zhihanzhang778:${password}@fullstackcluster.r94lf.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=FullstackCluster`

mongoose.connect(url)
  .then(result => {
    console.log(result)
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return v.length >= 8 && /^\d{2,3}-\d+$/.test(v)
      },
      message: props => `${props.v} is not a valid phone number!`
    },
    required: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
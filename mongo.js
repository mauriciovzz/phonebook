const mongoose = require('mongoose')

const parameters = process.argv.length

if (parameters !== 3 && parameters !== 5) {
  console.log('wrong number of parameters')
  process.exit(1)
}

const password = process.argv[2]
const url =
  `mongodb+srv://mau:${password}@cluster0.nfmhs4a.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (parameters === 5) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })
  
  person.save().then(result => {
    console.log(`added ${result.name} number ${result.number} to phonebook`)
    mongoose.connection.close()
  })
}

if (parameters === 3) {
  console.log('Phonebook:')
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(`${person.name} ${person.number}`)
    })
  mongoose.connection.close()
  })
}




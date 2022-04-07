const mongoose = require('mongoose')

const addresses = require('./addresses')
const eventsNames = require('./eventNames')

const { Event, eventCategories } = require('../models/event')
const Address = require('../models/address')
const Comment = require('../models/comment')

mongoose.connect('mongodb://localhost:27017/joinMe')
    .then(() => {
        console.log('mongo connection open')
    })
    .catch((err) => {
        console.log(`err: ${err}`)
    })

const randFromArr = arr => {
    return arr[Math.floor(Math.random() * arr.length)]
}

function randomDate(start, end) {
    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  
//console.log(randomDate(new Date, new Date(2022, 7, 1)));

//console.log(randFromArr(eventsNames))

const seedDB = async () => {
    await Event.deleteMany({})
    await Address.deleteMany({})
    await Comment.deleteMany({})
    for (i = 0; i < eventsNames.length; i++) {
        const randAddress = randFromArr(addresses)
        const address = new Address({ 
            street: randAddress.street,
            streetNumber: randAddress.streetNumber,
            city: randAddress.city,
            long: randAddress.long,
            lat: randAddress.lat
         })

        const startDate = randomDate(new Date(), new Date(2022, 7, 1))
        const endDate = startDate
        endDate.setDate(endDate.getDate() + 1)
        const event = new Event({
            name: eventsNames[i],
            startDate: startDate,
            endDate: endDate,
            description: 'Fusce tellus odio, dapibus id fermentum quis, suscipit id erat. Morbi leo mi, nonummy eget tristique non, rhoncus non leo. Nam quis nulla. Fusce nibh. Maecenas fermentum, sem in pharetra pellentesque, velit turpis volutpat ante, in pharetra metus odio a lectus. Maecenas libero. Maecenas aliquet accumsan leo. In enim a arcu imperdiet malesuada. Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat. Mauris dictum facilisis augue.',
            price: Math.floor(Math.random() * 500),
            creationDate: new Date(),
            address: address,
            categories: [randFromArr(eventCategories)],
            image: 'https://source.unsplash.com/random/?party,festival',
            organiser: '62470ee6c3bd43488d0602fc'
        })
        await address.save()
        await event.save()
    }
}

seedDB().then(() => {
    console.log('database seeded')
    mongoose.connection.close()
})
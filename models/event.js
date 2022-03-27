const mongoose = require('mongoose')
const { Schema } = mongoose


const eventCategories =
['divadlo',
'domov',
'film',
'fitness',
'hry',
'hudba',
'iniciativy',
'jídlo',
'komedie',
'literatura',
'náboženství',
'nakupování',
'nápoje',
'párty',
'řemesla',
'sítě',
'sport',
'tanec',
'umění',
'wellness',
'zahradničení',
'zdraví',
'rybaření',
]

const eventSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        default: 0,
        min: 0
    },
    creationDate: {
        type: Date,
        default: Date.now()
    },
    address: {
        type: Schema.Types.ObjectId,
        ref: 'Address'
    },
    categories: [
        {
            type: String,
            enum: eventCategories
        }
    ],
    image: {
        type: String
    }
})

const Event = mongoose.model('Event', eventSchema)
module.exports.Event = Event
module.exports.eventCategories = eventCategories
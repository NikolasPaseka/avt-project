const mongoose = require('mongoose')
const { Schema } = mongoose

const addressSchema = new Schema({
    street: String,
    streetNumber: String,
    city: String,
    long: Number,
    lat: Number
})

const Address = mongoose.model('Address', addressSchema)
module.exports = Address
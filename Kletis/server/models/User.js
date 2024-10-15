const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const Comment = require('./Comment')
const Tractor = require('./Tractor')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    type: {type: String, num: ['admin', 'mod', 'guest'], required: true},
}, {versionKey: false})

userSchema.pre('save', async function (next) {

    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)

    }
    next()
})

userSchema.pre('findOneAndDelete', async function (next) {
    const userId = this.getQuery()["_id"]
    console.log(userId)
    await Comment.deleteMany({ userId })
    await Tractor.deleteMany({ userId })
    next()
})

module.exports = mongoose.model('User', userSchema)
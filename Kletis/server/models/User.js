const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

const Comment = require('./Comment')

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    type: {type: String, enum: ['admin', 'mod', 'guest'], required: true},
}, {versionKey: false})

userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
    }
    next()
})

userSchema.pre('findOneAndDelete', async function (next) {
    const userId = this.getQuery()["_id"]; // Get the user ID from the query

    console.log('Deleting comments for user:', userId);

    // Delete all comments where the "author" field matches the userId
    await Comment.deleteMany({ author: userId });

    next();
})

module.exports = mongoose.model('User', userSchema)
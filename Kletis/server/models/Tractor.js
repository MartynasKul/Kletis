// subreddit equivalent
const mongoose = require('mongoose');
const Post = require('./Post');
const Comment = require('./Comment');
const User = require('./User');


const tractorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // negalima tokio pat traktoriaus subreddito (poklecio iks de de) nebus du belarus 892 pokleciai lmao
    description: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // reference i poklecio kureja

}, {versionKey: false})


//cascade delete jeigu subredditas bus panaikintas

tractorSchema.pre('findOneAndDelete', async function (next) {
    const tractorId = this.getQuery()["_id"]

    // surandam visus esamus postus po tractorid
    const posts = await Post.find({ tractor: tractorId });

    //istrinti visus komentarus po postais
    for(let post of posts) {
        await Comment.deleteMany({ post: post._id })
    }
    //istrinti visus postus to tractor kategorija
    await Post.deleteMany({tractor: tractorId})

    next()
})
module.exports = mongoose.model('Tractor', tractorSchema)
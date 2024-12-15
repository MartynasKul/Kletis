// subreddit equivalent
const mongoose = require('mongoose');
const Post = require('./Post');
const Comment = require('./Comment');
const User = require('./User');


const tractorSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // negalima tokio pat traktoriaus subreddito (poklecio iks de de) nebus du belarus 892 pokleciai lmao
    description: { type: String, required: true },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // reference i poklecio kureja

}, {versionKey: false})


//cascade delete jeigu subredditas bus panaikintas

tractorSchema.pre('findOneAndDelete', async function (next) {
    try {
        const tractorId = this.getQuery()["_id"];

        const Post = require('./Post');
        const Comment = require('./Comment');

        // Find all posts related to this tractor
        const posts = await Post.find({ tractor: tractorId });

        //console.log(`Posts found for tractor ${tractorId}:`, posts);

        // Delete all comments related to the posts
        for (let post of posts) {
            //console.log(`Deleting comments for post ID: ${post._id}`);
            await Comment.deleteMany({ post: post._id });
        }

        // Delete all posts under this tractor category
        await Post.deleteMany({ tractor: tractorId });


        next();
    } catch (error) {
        //console.error("Error in pre delete hook:", error);
        next(error);
    }
})
module.exports = mongoose.model('Tractor', tractorSchema)
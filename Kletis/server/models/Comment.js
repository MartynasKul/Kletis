const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: {type: String, required: true},
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    post: {type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true},
    author: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    upvotes: {type: Number, default: 0},
    downvotes: {type: Number, default: 0},
}, {versionKey: false})

// Method to upvote a comment
commentSchema.methods.upvote = async function() {
    this.upvotes += 1;
    await this.save(); // Save the updated comment
}

// Method to downvote a comment
commentSchema.methods.downvote = async function() {
    this.downvotes += 1;
    await this.save(); // Save the updated comment
}

// Hook to update the "updated_at" field whenever the comment is updated
commentSchema.pre('findOneAndUpdate', function(next) {
    this.set({ updated_at: new Date() });
    next();
});

// Optional post-save hook to log when a comment is created
commentSchema.post('save', function(doc, next) {
    console.log(`Comment created by user '${doc.author}' on post '${doc.post}'`);
    next();
});

module.exports = mongoose.model('Comment', commentSchema);
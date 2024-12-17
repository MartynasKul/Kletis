const mongoose = require("mongoose");
const Comment = require("./Comment");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // posto kurejas
    tractor: { type: mongoose.Schema.Types.ObjectId, ref: "Tractor", required: true }, // poklecio pavadinimas
  },
  { versionKey: false }
);

// Middleware: Update "updated_at" before updates
postSchema.pre("findOneAndUpdate", async function (next) {
  this.set({ updated_at: Date.now() });
  next();
});

// Post-save hook: Log post creation
postSchema.post("save", function (doc, next) {
  console.log(
    `Post '${doc.title}' created in tractor '${doc.tractor}' by user '${doc.author}'`
  );
  next();
});

// Method: Upvote a post
postSchema.methods.upvote = async function () {
  this.upvotes += 1;
  await this.save();
};

// Method: Downvote a post
postSchema.methods.downvote = async function () {
  this.downvotes += 1;
  await this.save();
};

// Middleware: Cascade delete comments when post is deleted
postSchema.pre("findOneAndDelete", async function (next) {
  const postId = this.getQuery()["_id"];
  await Comment.deleteMany({ post: postId });
  next();
});

module.exports = mongoose.model("Post", postSchema);

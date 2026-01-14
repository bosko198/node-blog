const mongoose = require('mongoose');
const slugify = require('slugify');
const sanitizeHtml = require('sanitize-html');

const PostSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    slug: { type: String, unique: true, index: true },
    excerpt: { type: String, trim: true, maxlength: 300 },
    content: { type: String, required: true },
    tags: [{ type: String, trim: true, lowercase: true }],
    published: { type: Boolean, default: true }
  },
  { timestamps: true }
);

PostSchema.pre('validate', function (next) {
  if (this.title && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

PostSchema.pre('save', function (next) {
  if (this.content) {
    this.content = sanitizeHtml(this.content, {
      allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img', 'h2', 'h3']),
      allowedAttributes: { a: ['href', 'name', 'target'], img: ['src', 'alt'] }
    });
  }
  next();
});

module.exports = mongoose.model('Post', PostSchema);
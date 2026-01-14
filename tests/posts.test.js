require('dotenv').config({ path: '.env.test' });
const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Post = require('../src/models/Post');

jest.setTimeout(30000); // 30 seconds

describe('Post routes', () => {
  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URI, { autoIndex: true });
  });

  afterAll(async () => {
    await mongoose.disconnect();
  });

  afterEach(async () => {
    await Post.deleteMany({});
  });

  test('Create a post', async () => {
    const res = await request(app)
      .post('/create')
      .send({ title: 'Test Post', content: 'Hello world', tags: 'test,blog' });
    expect(res.statusCode).toBe(302); // redirect
    const post = await Post.findOne({ title: 'Test Post' });
    expect(post).not.toBeNull();
    expect(post.tags).toContain('test');
  });

  test('List posts', async () => {
    await Post.create({ title: 'Another Post', content: 'Content here' });
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Another Post');
  });

  test('Get single post', async () => {
    const post = await Post.create({ title: 'Single Post', content: 'Details' });
    const res = await request(app).get(`/post/${post.slug}`);
    expect(res.statusCode).toBe(200);
    expect(res.text).toContain('Single Post');
  });

  test('Update post', async () => {
    const post = await Post.create({ title: 'Old Title', content: 'Old content' });
    const res = await request(app)
      .put(`/edit/${post.slug}`)
      .send({ title: 'New Title', content: 'Updated content' });
    expect(res.statusCode).toBe(302);
    const updated = await Post.findById(post._id);
    expect(updated.title).toBe('New Title');
  });

  test('Delete post', async () => {
    const post = await Post.create({ title: 'Delete Me', content: 'Bye' });
    const res = await request(app).delete(`/delete/${post.slug}`);
    expect(res.statusCode).toBe(302);
    const deleted = await Post.findById(post._id);
    expect(deleted).toBeNull();
  });
});
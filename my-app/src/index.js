// https://github.com/graphcool/prisma
// https://blog.graph.cool/introducing-prisma-1ff423fd629e

const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')

const resolvers = {
  Query: {
    feed(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: true } }, info)
    },
    drafts(parent, args, ctx, info) {
      return ctx.db.query.posts({ where: { isPublished: false } }, info)
    },
    post(parent, { id }, ctx, info) {
      return ctx.db.query.post({ where: { id } }, info)
    },
    users(parent, args, ctx, info) {
      return ctx.db.query.users({}, info)
    },
    user(parent, { id }, ctx, info) {
      return ctx.db.query.user({ where: { id } }, info)
    },
  },
  Mutation: {
    createDraft(parent, { title, text }, ctx, info) {
      return ctx.db.mutation.createPost(
        {
          data: {
            title,
            text,
          },
        },
        info,
      )
    },
    deletePost(parent, { id }, ctx, info) {
      return ctx.db.mutation.deletePost({ where: { id } }, info)
    },
    publish(parent, { id }, ctx, info) {
      return ctx.db.mutation.updatePost(
        {
          where: { id },
          data: { isPublished: true },
        },
        info,
      )
    },
    createUser(parent, { name }, ctx, info) {
      return ctx.db.mutation.createUser(
        {
          data: {
            name
          },
        },
        info,
      )
    },
  },
}

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers,
  context: req => ({
    ...req,
    db: new Prisma({
      typeDefs: 'src/generated/prisma.graphql',
      endpoint: 'https://eu1.prisma.sh/public-denimrib-891/my-app/dev', // the endpoint of the Prisma DB service
      secret: 'mysecret123', // specified in database/prisma.yml
      debug: true, // log all GraphQL queryies & mutations
    }),
  }),
})

server.start(() => console.log('Server is running on http://localhost:4000'))
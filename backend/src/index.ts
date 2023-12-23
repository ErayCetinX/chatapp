import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware, } from '@apollo/server/express4';
import jwt, { JwtPayload } from "jsonwebtoken";
import { PrismaClient, } from '@prisma/client';
import express from 'express';
import http from 'http';
import cors from 'cors';
import bodyParser from 'body-parser';

import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/lib/use/ws';

import resolvers from '../graphql/resolver/resolver';
import typeDefs from '../graphql/schema/schema';
import { Context } from '../context';
import { SECRET_KEY } from '../constant';
import { makeExecutableSchema } from '@graphql-tools/schema';

const app = express();

const httpServer = http.createServer(app);

// Ensure we wait for our server to start

declare global {
  namespace Express {
    interface Request {
      getLoggedInUserDetails:
      {
        uuid: string;
        username: string;
        email: string;
      }
      | any;
    }
  }
}

const schema = makeExecutableSchema({ typeDefs, resolvers });

const prisma = new PrismaClient();

(async function () {
  const server = new ApolloServer<Context>({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer }),
    {
      async serverWillStart() {
        return {
          async drainServer() {
            await serverCleanup.dispose();
          },
        };
      },
    },],
  });

  const wsServer = new WebSocketServer({
    // This is the `httpServer` we created in a previous step.
    server: httpServer,
    // Pass a different path here if app.use
    // serves expressMiddleware at a different path
    path: '/api/v1/graphql',
  });

  let USER_IS_ONLINE: boolean;


  // Hand in the schema we just created and have the
  // WebSocketServer start listening.
  const serverCleanup = useServer({
    schema,// As before, ctx is the graphql-ws Context where connectionParams live.
    onConnect({ connectionParams }) {
      USER_IS_ONLINE = true;
    },
    onDisconnect() {
      USER_IS_ONLINE = false;
    }
  }, wsServer);

  // Passing an ApolloServer instance to the `startStandaloneServer` function:
  //  1. creates an Express app
  //  2. installs your ApolloServer instance as middleware
  //  3. prepares your app to handle incoming requests
  await server.start();

  app.use(async (req, res, next) => {
    const token = req?.headers?.authorization;
    if (token && token !== "null") {
      try {
        const getLoggedInUserDetails: string | JwtPayload = await jwt.verify(
          token,
          SECRET_KEY
        );
        req.getLoggedInUserDetails = getLoggedInUserDetails;
        req.getLoggedInUserDetails.isOnline = USER_IS_ONLINE ? true : false
      } catch (e) {
        throw new Error("Oturum açınız!!!");
      }
    }
    next();
  });

  app.use(
    '/api/v1/graphql',
    cors<cors.CorsRequest>(),
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    bodyParser.json({ limit: '50mb' }),
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    expressMiddleware(server, {
      context: async ({ req }) => ({ prisma, getLoggedInUserDetails: req.getLoggedInUserDetails }),
    }),
  );

  await new Promise<void>((resolve) => httpServer.listen({ port: 4000, }, resolve));
  console.log(`🚀 Server ready at http://localhost:4000/api/v1/graphql`);

})().then(async () => {
  await prisma.$disconnect()
})
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  });

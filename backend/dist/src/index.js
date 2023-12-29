"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("@apollo/server");
const drainHttpServer_1 = require("@apollo/server/plugin/drainHttpServer");
const express4_1 = require("@apollo/server/express4");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const ws_1 = require("ws");
const ws_2 = require("graphql-ws/lib/use/ws");
const resolver_1 = __importDefault(require("../graphql/resolver/resolver"));
const schema_1 = __importDefault(require("../graphql/schema/schema"));
const constant_1 = require("../constant");
const schema_2 = require("@graphql-tools/schema");
const app = (0, express_1.default)();
const httpServer = http_1.default.createServer(app);
const schema = (0, schema_2.makeExecutableSchema)({ typeDefs: schema_1.default, resolvers: resolver_1.default });
const prisma = new client_1.PrismaClient();
(async function () {
    const server = new server_1.ApolloServer({
        schema,
        plugins: [(0, drainHttpServer_1.ApolloServerPluginDrainHttpServer)({ httpServer }),
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
    const wsServer = new ws_1.WebSocketServer({
        // This is the `httpServer` we created in a previous step.
        server: httpServer,
        // Pass a different path here if app.use
        // serves expressMiddleware at a different path
        path: '/api/v1/graphql',
    });
    let USER_IS_ONLINE;
    // Hand in the schema we just created and have the
    // WebSocketServer start listening.
    const serverCleanup = (0, ws_2.useServer)({
        schema,
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
                const getLoggedInUserDetails = await jsonwebtoken_1.default.verify(token, constant_1.SECRET_KEY);
                req.getLoggedInUserDetails = getLoggedInUserDetails;
                req.getLoggedInUserDetails.isOnline = USER_IS_ONLINE ? true : false;
            }
            catch (e) {
                throw new Error("Oturum açınız!!!");
            }
        }
        next();
    });
    app.use('/api/v1/graphql', (0, cors_1.default)(), 
    // 50mb is the limit that `startStandaloneServer` uses, but you may configure this to suit your needs
    body_parser_1.default.json({ limit: '50mb' }), 
    // expressMiddleware accepts the same arguments:
    // an Apollo Server instance and optional configuration options
    (0, express4_1.expressMiddleware)(server, {
        context: async ({ req }) => ({ prisma, getLoggedInUserDetails: req.getLoggedInUserDetails }),
    }));
    await new Promise((resolve) => httpServer.listen({ port: 4000, }, resolve));
    console.log(`🚀 Server ready at http://localhost:4000/api/v1/graphql`);
})().then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
//# sourceMappingURL=index.js.map
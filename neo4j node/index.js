// get started
// start neo4j destkop database
// graphiql to http://localhost:4000/

// should
// learn graphql querying
// resolvers

// necessities
// replicate returning 3 random movie titles
// integrate this code back into webapp
// return data back into javascript

const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
const { ApolloServer } = require("apollo-server");
const { graphql } = require('graphql');

const typeDefs = `
    type Movie {
        title: String
        released: Int
        tagline: String
        actors: [Person!]! @relationship(type: "ACTED_IN", direction: IN)
    }

    type Person {
        name: String
        born: Int
        movies: [Movie!]! @relationship(type: "ACTED_IN", direction: OUT)
    }
`;

const uri = 'bolt://44.203.227.56:7687'
const user = 'neo4j'
const password = 'homes-efficiencies-default'
const query = `
    query{
        moviesConnection(first: 3) {
            totalCount
            edges {
                node {
                    title
                }
            }
        }
    }
`;

const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

async function main() {
    const schema = await neoSchema.getSchema();

    const resolvers = {
        Query: {
          hello: () => 'Hello world!',
        },
    };

    const server = new ApolloServer({
        schema,
        context: ({ req }) => ({ req }),
        resolvers
    });


    const root = 'http://localhost:4000/'
    await server.listen(4000);

    console.log(`🚀 Server ready at ${root}`);


    graphql(schema, query, root).then((response) => {
        console.log(response);
    });
}

main()

// to run, run 'node index.js'
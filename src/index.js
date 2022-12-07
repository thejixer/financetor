import runServer from './server/run-server'
import buildSchema from './graphql/schema'
import resolvers from './graphql/resolver'
import path from 'path'
import { existsSync, mkdirSync } from 'fs'

const dbDirectory = path.join(process.cwd(), '/src/db')
const dbuserDirectory = path.join(process.cwd(), '/src/db/users')

if (!existsSync(dbDirectory)) mkdirSync(dbDirectory)
if (!existsSync(dbuserDirectory)) mkdirSync(dbuserDirectory)

const typeDefs = buildSchema()

runServer({ typeDefs, resolvers, port: 80 });
import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { apiKey, magicLink } from "better-auth/plugins";
import dotenv from "dotenv";

dotenv.config();

const client = new MongoClient(process.env.MONGODB);
const db = client.db();

export const auth = betterAuth({
    database: mongodbAdapter(db),
    basePath: '/auth',
    emailAndPassword: {
      enabled: true
    },
    trustedOrigins: [
      "http://localhost:1234"
    ],
    plugins: [
      magicLink({
        sendMagicLink: async ({email, getJwtToken, url}, request) => {
          console.info("Sending magiclink with the following info:", email, getJwtToken, url);
        }
      }),
      apiKey()
    ]
})

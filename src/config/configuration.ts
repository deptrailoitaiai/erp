import * as dotenv from 'dotenv';
dotenv.config(); 

export default () => ({
    databaseConfig: {
        host: process.env.HOST,
        port: process.env.PORT,
        username: process.env.USERNAME,
        password: process.env.PASSWORD,
        database: process.env.DATABASE,
    },

    mailConfig: {
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        adminEmail: process.env.ADMIN_EMAIL,
    }
});
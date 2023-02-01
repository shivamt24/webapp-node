// import * as pg from 'pg'

// const {
//     Pool
// } = pg;
import * as dotenv from 'dotenv';
import {
    Pool
} from 'postgres-pool';

dotenv.config();
// const pool = new Pool({
//     user: "thabes",
//     password: "thabes",
//     host: "localhost",
//     port: 5432,
//     database: "api"
// });

//console.log(process.env.PGUSER, process.env.PGPASSWORD, process.env.PGHOST, process.env.PGPORT, process.env.PGDATABASE);

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    database: process.env.PGDATABASE
});

const query = async (text, params) => {
    return await pool.query(text, params);
}

export default {
    query
};
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: "sample-next-app.mysql.database.azure.com", 
    user: "hemanth",
    password: "vivoy55L@123%",
    database: 'creds',
    ssl: {
        rejectUnauthorized: false, 
    }
});

export async function queryDatabase(query: string, values: unknown[] = []) {
    const [rows] = await pool.execute(query, values);
    const json = JSON.stringify(rows);
    return json;
}
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: process.env.AZURE_MYSQL_DB_URL, 
    user: process.env.AZURE_MYSQL_DB_USER,
    password: process.env.AZURE_MYSQL_DB_PASSWORD,
    database: 'creds', 
});

export async function queryDatabase(query: string, values: unknown[] = []) {
    const [rows] = await pool.execute(query, values);
    const json = JSON.stringify(rows);
    return json;
}
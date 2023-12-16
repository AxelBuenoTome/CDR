
const pool = require('./server');

function queryDatabase(q, values, res, callback) {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting connection from pool: ', err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }

        connection.query(q, values, (err, results, fields) => {
            connection.release();

            if (err) {
                console.error(err);
                return res.status(500).json({ error: 'Internal Server Error' });
            }

            callback(results);
        });
    });
}

module.exports = {
    queryDatabase,
};

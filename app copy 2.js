const express = require('express');
const { Pool } = require('pg');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: 'http://localhost:5173', // Replace with your React app's URL
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    },
  });
  
app.use(cors({ origin: 'http://localhost:5173' }));
  
const pool = new Pool({
    user: 'postgres',         // Replace with your PostgreSQL username
    host: '172.18.100.214',        // Use the IP address of your server
    database: 'OEE',       // Your database name
    password: 'root1234',      // Replace with your database password
    port: 5432,                // Default PostgreSQL port
});

io.on('connection', (socket) => {
  console.log('Client connected');

  // Function to fetch data and emit it to the client
  const fetchLiveData = async () => {
    try {
      let shiftTimings3;
      const currentHour = new Date().getHours(); // Get the current hour (0-23)

      if (currentHour >= 9 && currentHour < 17) {
        shiftTimings3 = {
          start: {
            time: '08:59:00'
          },
          end: {
            time: '17:01:00'
          }
        };
      } else if (currentHour >= 18 || currentHour < 2) {
        shiftTimings3 = {
          start: {
            time: '17:59:00'
          },
          end: {
            time: '02:01:00'
          }
        };
      }

      const result = await pool.query(
        `SELECT timestamp, machine_status, part_status 
         FROM new.machine_signal_pool 
         WHERE to_char(timestamp, 'YYYY-MM-DD') = $1 
         AND to_char(timestamp, 'HH24:MI') BETWEEN $2 AND $3`,
        [currentDate, shiftTimings3.start.time, shiftTimings3.end.time]
      );

      result.rows.forEach(row => {
        row.timestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      });

      const productionTime = calculateProductionTime(result.rows);
      const idleTime = calculateIdleTime(result.rows);
      const offTime = calculateOffTime(result.rows);
      const availability = calculateAvailability(result.rows);
      const performance = calculatePerformance(result.rows);
      const quality = calculateQuality(result.rows);
      const oee = calculateOee(availability, performance, quality);

      return {
        ProductionTime: productionTime,
        IdleTime: idleTime,
        OffTime: offTime,
        Availability: availability,
        Performance: performance,
        Quality: quality,
        OEE: oee,
        CurrentDate: currentDate,
        shiftStartTime: shiftTimings3.start.time,
        shiftEndTime: shiftTimings3.end.time,
        records: result.rows
      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  // Fetch and emit data every second
  const interval = setInterval(async () => {
    try {
      const data = await fetchLiveData();
      socket.emit('newData', data);
    } catch (error) {
      console.error('Error fetching and emitting data:', error);
    }
  }, 1000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});

server.listen(5000, () => {
  console.log('Server running on port 5000');
});

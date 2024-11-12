const express = require('express');
const pool = require('./db'); // Make sure this path is correct
const app = express();
const port = 3000;
const cors = require('cors');

const http = require('http');
const socketIo = require('socket.io');

const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
      origin: '*', // Replace with your React app's URL
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
    },
  });

  
app.use(express.json());
app.use(cors({ origin: '*' }));

const moment = require('moment-timezone');


const planned_production = 440;

function calculateActualProductionTime(records) {
    let totalMinutes = 0;
    // Iterate through records to find 'PRODUCTION' to 'IDLE' intervals
    for (let i = 0; i < records.length; i++) {
        if (records[i].machine_status === 'PRODUCTION') {
            const start = new Date(records[i].timestamp);

            // Find the next 'IDLE' status after the current 'PRODUCTION'
            let end;
            for (let j = i + 1; j < records.length; j++) {
                if (records[j].machine_status === 'IDLE') {
                    end = new Date(records[j].timestamp);
                    break;
                }
            }

            // If we found an 'IDLE' status after 'PRODUCTION', calculate the interval
            if (end) {
                const diffInMs = end - start;
                const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes

                // Add to total production time
                if (diffInMinutes > 0) {
                    totalMinutes += diffInMinutes;
                }
            }
        }
    }

    return totalMinutes;
}

  const calculateActualProducedQuantity = (records) =>{
      let quantity = 0;

      for(let i=0; i< records.length ; i++){
        if(records[i].machine_status === "PRODUCTION"){
            quantity++;
          }
      }
     return quantity;
  }

  const calculateIdealCycleTime = (records) =>{
    let idealCycleTime = 0;
    let count = 0; // To ensure we only consider the first 5 production cycles

    for (let i = 0; i < records.length; i++) {
        if (count >= 10) break; // Limit to first 5 'PRODUCTION' intervals

        if (records[i].machine_status === 'PRODUCTION') {
            const start = new Date(records[i].timestamp);

            // Find the next 'IDLE' status after the current 'PRODUCTION'
            let end;
            for (let j = i + 1; j < records.length; j++) {
                if (records[j].machine_status === 'IDLE') {
                    end = new Date(records[j].timestamp);
                    break;
                }
            }

            // Calculate cycle time if an 'IDLE' status is found
            if (end) {
                const diffInMs = end - start;
                const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes

                if (diffInMinutes > 0) {
                    idealCycleTime += diffInMinutes;
                    count += 1;
                }
            }
        }
    }

    // Calculate the average ideal cycle time for the first 5 cycles
    return count === 10 ? idealCycleTime / 10 : 0;
}

const calculateGoodPart = (records) =>{
    let goodpart=0;
    for(let i=0; i< records.length ; i++){
       if(records[i].part_status === 2){
          goodpart++;
       }
    }
    return goodpart;
}

// Example route to get all records from the oee table
app.get('/oee', async (req, res) => {
    try {
        const result = await pool.query(`SELECT id, timestamp, 
                               machine_status , part_status FROM new.machine_signal_pool  WHERE to_char(timestamp, 'YYYY-MM-DD') = $1 `,[currentDate] );
        
      result.rows.forEach(row => {
             row.timestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      });

        const actualProduction = calculateActualProductionTime(result.rows);

        const availability = ((actualProduction / planned_production) * 100).toFixed(2) ;

        const actualProducedQuantity = calculateActualProducedQuantity(result.rows);

        const idealCycleTime = calculateIdealCycleTime(result.rows);

        const performance = (((actualProducedQuantity * idealCycleTime)/ actualProduction) * 100).toFixed(2);

        const goodpart = calculateGoodPart(result.rows);

        const quality = ((goodpart / actualProducedQuantity) * 100).toFixed(2);

        const oee = ((availability / 100) * (performance / 100) * (quality / 100) * 100).toFixed(2);
        
        res.status(200).json({Availability: availability , Performance: performance, Quality: quality, OEE: oee ,  ActualProduction : actualProduction , ActualProducedQuantity : actualProducedQuantity , IdealCycleTime : idealCycleTime, Goodpart: goodpart, records: result.rows} );

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});

        const now = new Date();

        const nextDay = new Date(now);
        nextDay.setDate(now.getDate() + 1);

        let currentShift;
        let shiftTimings = {
            start: {
                date: '',
                time: ''
            },
            end: {
                date: '',
                time: ''
            }
        };

        let shiftTimings2 = {
            start: { 
                time: '',
            },
            end: {
                time: '',
            }
        }

        const day = String(now.getDate()).padStart(2, '0'); 
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const currentDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD

 app.get('/shiftTiming', (req, res) => {
            try {
              const now = new Date();
              const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
              const currentHour = now.getHours();
          
              // Define shift times
              const shift1 = { start: 9, end: 17 }; // 9 AM to 5 PM
              const shift2 = { start: 18, end: 2 }; // 6 PM to 2 AM (next day)
          
              let currentShift;
              let shiftTimings;
          
              if (currentHour >= shift1.start && currentHour < shift2.start) {
                currentShift = '1';
                shiftTimings = {
                  start: {
                    date: now.toLocaleDateString(),
                    time: '09:00:00'
                  },
                  end: {
                    date: now.toLocaleDateString(),
                    time: '17:00:00'
                  }
                }
              } else {
                currentShift = '2';
                shiftTimings = {
                  start: {
                    date: now.toLocaleDateString(),
                    time: '18:00:00'
                  },
                  end: {
                    date: nextDay.toLocaleDateString(),
                    time: '02:00:00'
                  }
                };
              }
      
          
              // Send response
              res.json({
                Shift: currentShift,
                StartDate: shiftTimings.start.date,
                StartTime: shiftTimings.start.time,
                EndDate: shiftTimings.end.date, 
                EndTime: shiftTimings.end.time
              });
            } catch (error) {
              console.error('Error fetching machine status:', error);
              res.status(500).json({ error: 'Internal server error' });
            }
          });

app.get('/machineState' , async(req, res)=>{

    try {
        const result = await pool.query(
            `SELECT machine_status 
             FROM new.machine_signal_pool
             WHERE to_char(timestamp, 'YYYY-MM-DD') = $1 
             ORDER BY timestamp DESC 
             LIMIT 1`,
            [currentDate]
        );

        if (result.rows.length > 0) {
            res.json({
                machine_state: result.rows[0].machine_status
            });
        } else {
            res.status(404).json({ message: 'No machine status found for today' });
        }

    } catch (error) {
        console.error('Error fetching machine status:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

const calculateProductionTime = (records)=>{
    let totalMinutes=0;
    for(let i =0 ; i< records.length ; i++){
        if (records[i].machine_status === 'PRODUCTION') {
            const start = new Date(records[i].timestamp);

            // Find the next 'IDLE' status after the current 'PRODUCTION'
            let end;
            for (let j = i + 1; j < records.length; j++) {
                if (records[j].machine_status === 'IDLE') {
                    end = new Date(records[j].timestamp);
                    break;
                }
            }

            // If we found an 'IDLE' status after 'PRODUCTION', calculate the interval
            if (end) {
                const diffInMs = end - start;
                const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes

                // Add to total production time
                if (diffInMinutes > 0) {
                    totalMinutes += diffInMinutes;
                }
            }
        }
    }

    return totalMinutes;
}

const calculateIdleTime = (records) =>{
    let totalMinutes=0;
    for(let i =0; i< records.length ; i++ ){
        if(records[i].machine_status === 'IDLE'){
            const start = new Date(records[i].timestamp);

            let end;
            for (let j = i + 1; j < records.length; j++) {
                if (records[j].machine_status === 'PRODUCTION' || records[j].machine_status === 'OFF') {
                    end = new Date(records[j].timestamp);
                    break;
                }
            }
            
            if (end) {
                const diffInMs = end - start;
                const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes

                // Add to total production time
                if (diffInMinutes > 0) {
                    totalMinutes += diffInMinutes;
                }
            }
        }
    }
      return totalMinutes;
}

const calculateIdleTimeAnalytics = (records) => {

  const recordsByDate = records.reduce((acc, record) => {
    const date = new Date(record.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  const offTimeByDate = {};
  let totalOffTime = 0;

  for (const [date, dateRecords] of Object.entries(recordsByDate)) {
    let dailyOffTime = 0;
   
    for (let i = 0; i < dateRecords.length; i++) {
      if (dateRecords[i].machine_status === 'IDLE') {
          const start = new Date(dateRecords[i].timestamp);
          let end;
          for (let j = i + 1; j < dateRecords.length; j++) {
              if (dateRecords[j].machine_status === 'PRODUCTION' || dateRecords[j].machine_status === 'OFF') {
                  end = new Date(dateRecords[j].timestamp);
                  break;
              }
          }
          if (end) {
              const diffInMs = end - start;
              const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes

              if(diffInMinutes > 0){
                dailyOffTime += diffInMinutes;
              }
            }
        }
    }
    offTimeByDate[date] = dailyOffTime;
    totalOffTime += dailyOffTime;
  }
  return totalOffTime;
};

const calculateOffTime = (records) =>{
  let totalMinutes = 0;

  // Set shift end times dynamically based on current date
  const shiftEndFirstShift = '17:00:00';
  const shiftEndSecondShift = '02:00:00';

  for (let i = 0; i < records.length; i++) {
      if (records[i].machine_status === 'OFF') {
          const start = new Date(records[i].timestamp);

          let end;
          // Check if it's the last row
          if (i === records.length - 1) {
              // If the "OFF" status is in the last row, calculate the time till the shift end
              const shiftEndTime = (start.getHours() < 17) ? shiftEndFirstShift : shiftEndSecondShift;
              const [hours, minutes, seconds] = shiftEndTime.split(':').map(Number);
              
              end = new Date(start);
              end.setHours(hours, minutes, seconds);
          } else {
              // Otherwise, find the next "IDLE" status
              for (let j = i + 1; j < records.length; j++) {
                  if (records[j].machine_status === 'IDLE') {
                      end = new Date(records[j].timestamp);
                      break;
                  }
              }
          }

          // Calculate the difference in time (in minutes)
          if (end) {
              const diffInMs = end - start;
              const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes

              // Add to total off time
              if (diffInMinutes > 0) {
                  totalMinutes += diffInMinutes;
              }
          }
      }
  }

  return totalMinutes;
}

const calculateOffTimeByDate = (records) => {
  // Group records by date
  const recordsByDate = records.reduce((acc, record) => {
    const date = new Date(record.timestamp).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(record);
    return acc;
  }, {});

  // Calculate off time for each date
  const offTimeByDate = {};
  let totalOffTime = 0;

  for (const [date, dateRecords] of Object.entries(recordsByDate)) {
    let dailyOffTime = 0;
    const shiftEndFirstShift = '17:00:00';
    const shiftEndSecondShift = '02:00:00';

    for (let i = 0; i < dateRecords.length; i++) {
      if (dateRecords[i].machine_status === 'OFF') {
        const start = new Date(dateRecords[i].timestamp);
        let end;

        // Check if it's the last row for this date
        if (i === dateRecords.length - 1) {
          // If the "OFF" status is in the last row, calculate the time till the shift end
          const shiftEndTime = (start.getHours() < 17) ? shiftEndFirstShift : shiftEndSecondShift;
          const [hours, minutes, seconds] = shiftEndTime.split(':').map(Number);
          
          end = new Date(start);
          end.setHours(hours, minutes, seconds);
          
          // If second shift end time is on next day, add 24 hours
          if (shiftEndTime === shiftEndSecondShift && end < start) {
            end.setDate(end.getDate() + 1);
          }
        } else {
          // Otherwise, find the next "IDLE" status
          for (let j = i + 1; j < dateRecords.length; j++) {
            if (dateRecords[j].machine_status === 'IDLE') {
              end = new Date(dateRecords[j].timestamp);
              break;
            }
          }
        }

        // Calculate the difference in time (in minutes)
        if (end) {
          const diffInMs = end - start;
          const diffInMinutes = diffInMs / (1000 * 60); // Convert milliseconds to minutes

          // Add to daily off time
          if (diffInMinutes > 0) {
            dailyOffTime += diffInMinutes;
          }
        }
      }
    }

    offTimeByDate[date] = dailyOffTime;
    totalOffTime += dailyOffTime;
  }

  return  totalOffTime ;
};


const calculateAvailability = (records) =>{
    const actualProduction = calculateProductionTime(records);

    const availability = ((actualProduction / planned_production ) * 100).toFixed(2);

    return availability;
}

const calculatePerformance = (records) =>{
    const actualProducedQuantity = calculateActualProducedQuantity(records);
    const idealCycleTime = calculateIdealCycleTime(records);
    const actualProduction = calculateProductionTime(records);

    const performance = (((actualProducedQuantity * idealCycleTime) / actualProduction) * 100).toFixed(2);

    return performance;
}

const calculateQuality = (records) =>{
     const goodpart = calculateGoodPart(records);
     const actualProducedQuantity = calculateActualProducedQuantity(records);
     const quality = ((goodpart / actualProducedQuantity) * 100 ).toFixed(2);

     return quality;
}

const calculateOee = (availability , performance , quality) =>{
    const oee = ((availability / 100) * (performance / 100) * (quality / 100) * 100).toFixed(2);
    return oee;
}


app.get('/shiftwise', async (req,res)=>{
    try{
        
        const {date , shift} = req.query;
        
        if(!date || !shift){
            return res.status(400).send('Date and shift are required');
        }
        
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).send('Invalid date format. Use YYYY-MM-DD');
        }
        
        if(shift === '1'){
            shiftTimings2 = {
                start:{
                    time: '08:59:00'
                },
                end: {
                    time: '17:01:00'
                }
            }
        } else if(shift === '2'){
            shiftTimings2 = {
                start:{
                    time: '17:59:00'
                },
                end: {
                    time: '02:01:00'
                }
            }
        }

        const result= await pool.query(`select timestamp, machine_status , part_status from new.machine_signal_pool WHERE to_char(timestamp, 'YYYY-MM-DD') = $1  AND to_char(timestamp, 'HH24:MI') BETWEEN $2 AND $3`, [date, shiftTimings2.start.time, shiftTimings2.end.time]);
    
        result.rows.forEach(row => {
          row.timestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
         });

        const productionTime = calculateProductionTime(result.rows);
        const idleTime = calculateIdleTime(result.rows);
        const offTime = calculateOffTime(result.rows);
        const availability = calculateAvailability(result.rows);
        const performance = calculatePerformance(result.rows);
        const quality = calculateQuality(result.rows);
        const oee = calculateOee(availability , performance , quality);
        const goodpart = calculateGoodPart(result.rows);
        const actualProducedQuantity = calculateActualProducedQuantity(result.rows);
        const badpart = actualProducedQuantity - goodpart;

        res.json({
            ProductionTime : productionTime,
            IdleTime : idleTime,
            OffTime : offTime,
            Availability : availability,
            Performance : performance,
            Quality: quality,
            OEE : oee,
            PartCount : actualProducedQuantity,
            GoodPart: goodpart,
            BadPart : badpart, 
            Result: result.rows,
        })
    }
    catch(error){
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});


app.get('/weekwise' , async (req,res)=>{
    try {
        const {date} = req.query;
         
        if(!date){
            return res.status(400).send('Date is required');
        }

        const inputDate = new Date(date);
        if (isNaN(inputDate)) {
            return res.status(400).send('Invalid date format. Please use YYYY-MM-DD.');
        }

        // Calculate the start date for the week (6 days before the input date)
        const startDate = new Date(inputDate);
        startDate.setDate(inputDate.getDate() - 6);
        
        const formattedStartDate = startDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEndDate = inputDate.toISOString().split('T')[0];

        const result= await pool.query(`select timestamp, machine_status , part_status from new.machine_signal_pool  WHERE to_char(timestamp, 'YYYY-MM-DD') BETWEEN $1 AND $2`,[formattedStartDate, formattedEndDate]);

        const productionTime = calculateProductionTime(result.rows);
        const idleTime = calculateIdleTime(result.rows);
        const offTime = calculateOffTime(result.rows);
        const availability = calculateAvailability(result.rows);
        const performance = calculatePerformance(result.rows);
        const quality = calculateQuality(result.rows);
        const oee = calculateOee(availability , performance , quality);

        res.json({
            ProductionTime : productionTime,
            IdleTime : idleTime,
            OffTime : offTime,
            Availability : availability,
            Performance : performance,
            Quality: quality,
            OEE : oee
        })


    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
})


app.get('/analytics' ,async (req, res)=>{
    try {
        const {startDate , endDate} = req.query;
        
        if(!startDate || !endDate){
            return res.status(400).send('Date is required');
        }

        const inputStartDate = new Date(startDate);
        if (isNaN(inputStartDate)) {
            return res.status(400).send('Invalid date format. Please use YYYY-MM-DD.');
        }

        const inputEndDate = new Date(endDate);
        if (isNaN(inputEndDate)) {
            return res.status(400).send('Invalid date format. Please use YYYY-MM-DD.');
        }

        const formattedStartDate = inputStartDate.toISOString().split('T')[0]; // Format as YYYY-MM-DD
        const formattedEndDate = inputEndDate.toISOString().split('T')[0];

        const result= await pool.query(`select timestamp, machine_status , part_status from new.machine_signal_pool  WHERE to_char(timestamp, 'YYYY-MM-DD') BETWEEN $1 AND $2`,[formattedStartDate, formattedEndDate]);
        
        result.rows.forEach(row => {
          row.timestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
         });

        const productionTime = calculateProductionTime(result.rows);
        const idleTime = calculateIdleTimeAnalytics(result.rows);
        const offTime = calculateOffTimeByDate(result.rows);
        const availability = calculateAvailability(result.rows);
        const performance = calculatePerformance(result.rows);
        const quality = calculateQuality(result.rows);
        const oee = calculateOee(availability , performance , quality);
        const goodpart = calculateGoodPart(result.rows);
        const actualProducedQuantity = calculateActualProducedQuantity(result.rows);
        const badpart = actualProducedQuantity - goodpart;
    

        res.json({
            ProductionTime : productionTime,
            IdleTime : idleTime,
            OffTime : offTime,
            Availability : availability,
            Performance : performance,
            Quality: quality,
            OEE : oee,
            PartCount : actualProducedQuantity,
            GoodPart: goodpart,
            BadPart : badpart,
            Result: result.rows,
        })

    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});


app.get('/livedata', async (req,res)=>{
    try{
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

       res.json({
            ProductionTime: productionTime,
            IdleTime: idleTime,
            OffTime: offTime,
            Availability: availability ,
            Performance: performance,
            Quality: quality,
            OEE: oee,
            CurrentDate: currentDate,
            shiftStartTime: shiftTimings3.start.time,
            shiftEndTime: shiftTimings3.end.time,
            records:result.rows,
       })
    }
    catch(error){
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');  
      }
});
  


io.on('connection', (socket) => {
  console.log('Client connected to machine data');

  // Function to fetch data and emit it to the client
  const fetchLiveData = async () => {
    try {

              const now = new Date();
              const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
              const currentHour2 = now.getHours();
          
              // Define shift times
              const shift1 = { start: 9, end: 17 }; // 9 AM to 5 PM
              const shift2 = { start: 18, end: 2 }; // 6 PM to 2 AM (next day)
          
              let currentShift;
              let shiftTimings;
          
              if (currentHour2 >= shift1.start && currentHour2 < shift2.start) {
                currentShift = '1';
                shiftTimings = {
                  start: {
                    date: now.toLocaleDateString(),
                    time: '09:00:00'
                  },
                  end: {
                    date: now.toLocaleDateString(),
                    time: '17:00:00'
                  }
                }
              } else {
                currentShift = '2';
                shiftTimings = {
                  start: {
                    date: now.toLocaleDateString(),
                    time: '18:00:00'
                  },
                  end: {
                    date: nextDay.toLocaleDateString(),
                    time: '02:00:00'
                  }
                };
              }

      let shiftTimings3;
      const currentHour = new Date().getHours(); // Get the current hour (0-23)

      if (currentHour >= 9 && currentHour < 18) {
        shiftTimings3 = {
          start: {
            time: '08:59:00'
          },
          end: {
            time: '17:01:00'
          }
        };
      } else {
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
      const goodpart = calculateGoodPart(result.rows);
      const actualProducedQuantity = calculateActualProducedQuantity(result.rows);
      const badpart = actualProducedQuantity - goodpart;


      return {
        ProductionTime: productionTime,
        IdleTime: idleTime,
        OffTime: offTime,
        Availability: availability,
        Performance: performance,
        Quality: quality,
        OEE: oee,
        PartCount : actualProducedQuantity,
        GoodPart: goodpart,
        BadPart : badpart,
        Shift: currentShift,
        StartDate: shiftTimings.start.date,
        StartTime: shiftTimings.start.time,
        EndDate: shiftTimings.end.date, 
        EndTime: shiftTimings.end.time

      };
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  };

  const interval = setInterval(async () => {
    try {
      const data = await fetchLiveData();
      socket.emit('newData', data);
    } catch (error) {
      console.error('Error fetching and emitting data:', error);
    }
  }, 3000);

  socket.on('disconnect', () => {
    clearInterval(interval);
    console.log('Client disconnected');
  });
});


  // io.on('connection', (socket) => {
  //   console.log('Client connected to shift data');
  
  //   // Function to fetch data and emit it to the client
  //   const fetchLiveData = async () => {
  //       try {
  //           const now = new Date();
  //           const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  //           const currentHour = now.getHours();
        
  //           // Define shift times
  //           const shift1 = { start: 9, end: 17 }; // 9 AM to 5 PM
  //           const shift2 = { start: 18, end: 2 }; // 6 PM to 2 AM (next day)
        
  //           let currentShift;
  //           let shiftTimings;
        
  //           if (currentHour >= shift1.start && currentHour < shift1.end) {
  //             currentShift = '1';
  //             shiftTimings = {
  //               start: {
  //                 date: now.toLocaleDateString(),
  //                 time: '09:00:00'
  //               },
  //               end: {
  //                 date: now.toLocaleDateString(),
  //                 time: '17:00:00'
  //               }
  //             };
  //           } else if ((currentHour >= shift2.start && currentHour <= 23) || (currentHour >= 0 && currentHour < shift2.end)) {
  //             currentShift = '2';
  //             shiftTimings = {
  //               start: {
  //                 date: now.toLocaleDateString(),
  //                 time: '18:00:00'
  //               },
  //               end: {
  //                 date: nextDay.toLocaleDateString(),
  //                 time: '02:00:00'
  //               }
  //             };
  //           }
        
  //           // Send response
  //           return{
  //             Shift: currentShift,
  //             StartDate: shiftTimings.start.date,
  //             StartTime: shiftTimings.start.time,
  //             EndDate: shiftTimings.end.date, 
  //             EndTime: shiftTimings.end.time
  //           };
  //         } catch (error) {
  //           console.error('Error fetching machine status:', error);
  //           res.status(500).json({ error: 'Internal server error' });
  //         }
  //   };
  
  //   // Fetch and emit data every second
  //   const interval = setInterval(async () => {
  //     try {
  //       const data = await fetchLiveData();
  //       socket.emit('shiftData', data);
  //     } catch (error) {
  //       console.error('Error fetching and emitting data:', error);
  //     }
  //   }, 1000);
  
  //   socket.on('disconnect', () => {
  //     clearInterval(interval);
  //     console.log('Client disconnected');
  //   });
  // });


  server.listen(5000, () => {
    console.log('Server running on port 5000');
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

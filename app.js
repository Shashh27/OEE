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
const { start } = require('repl');

let shift_duration;
let planned_non_production;
let planned_downtime;
let planned_production;
let available_idle_time;

app.get('/getGeneralConfig', async(req, res)=>{
  try {
      const result = await pool.query('select shift_duration, planned_non_production , planned_downtime from new.config_info');
      res.json(result.rows);
    
  } catch (error) {
      console.log(error);
  }
});


app.get('/getShiftConfig', async(req, res)=>{
  try {
      const result = await pool.query('select * from new.shift_info order by id ASC');
      res.json(result.rows);
  } catch (error) {
      console.log(error);
  }
});

app.put('/editGeneralConfig' ,async(req , res)=>{
     const {shiftDuration , plannedNonProduction , plannedDowntime} = req.body;
    try {
      const result = await pool.query(`update new.config_info set shift_duration=$1 , planned_non_production=$2 , planned_downtime=$3 where id=1`, [shiftDuration , plannedNonProduction, plannedDowntime]);
      if (result.rowCount > 0) {
        res.json({ success: true, message: 'Configuration updated successfully' });
      } else {
        res.status(404).json({ success: false, message: 'No configuration found with id=1' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
    }
  });

app.put('/editShiftConfig', async(req, res)=>{
  const {id ,startTime , endTime} = req.body;
  try {
     const result = await pool.query(`update new.shift_info set start_time=$1 , end_time=$2 where id=$3`, [startTime , endTime ,id]);
     if (result.rowCount > 0) {
      res.json({ success: true, message: 'Configuration updated successfully' });
    } else {
      res.status(404).json({ success: false, message: 'No configuration found with id' });
    }
  } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, error: 'Internal server error' });
  }
});


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

      for(let i=0; i< records.length - 1 ; i++){
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
        if (count >= 15) break; // Limit to first 5 'PRODUCTION' intervals

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
    return  idealCycleTime / count ;
}

const calculateGoodPart = (records) =>{
    let goodpart=0;
    for(let i=0; i< records.length-1 ; i++){
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
        const result2 = await pool.query(
            `SELECT machine_status 
             FROM new.machine_signal_pool
             WHERE to_char(timestamp, 'YYYY-MM-DD') = $1 
             ORDER BY timestamp DESC 
             LIMIT 1`,
            [currentDate]
        );

        if (result2.rows.length > 0) {
            res.json({
                machine_state: result2.rows[0].machine_status
            });
        } else {
            res.status(404).json({ message: 'Null' });
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
                if (records[j].machine_status === 'PRODUCTION' || records[j].machine_status === 'OFF' || records[j].machine_status === 'IDLE') {
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


const calculateAvailability = (records , available_idle_time , planned_production) =>{
    const idealCycleTime = calculateIdealCycleTime(records);
    const actualProduction = calculateProductionTime(records);

    if((available_idle_time - idealCycleTime) > 0){
       return 100.00;
    } 
    else{
      const availability = ((actualProduction / planned_production ) * 100).toFixed(2);
      return availability;
    }
}

const calculatePerformance = (records) =>{
    const actualProducedQuantity = calculateActualProducedQuantity(records);
    const idealCycleTime = calculateIdealCycleTime(records);
    const actualProduction = calculateProductionTime(records);

    const performance = (((actualProducedQuantity * idealCycleTime) / actualProduction) * 100).toFixed(2);

    return performance > 100 ? 100 : performance;
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


const calculateMachineSate = (records) =>{
    
   let result = []

   for (let i =0 ; i< records.length ; i++){
        const currentRow = records[i];
        const nextRow = records[i+1];

        const startTime = currentRow.timestamp.split(' ')[1]; // Extract only time
        const endTime = nextRow ? nextRow.timestamp.split(' ')[1] : startTime; // Extract only time
        const state = currentRow.machine_status;

        result.push({
          startTime,
          endTime,
          state,
        });
   }
   return result;
}
  


app.get('/shiftwise', async (req, res) => {
  try {
      const { id, date, shift } = req.query;

      // Check if required query parameters are provided
      if (!id || !date || !shift) {
          return res.status(400).send('ID, Date, and Shift are required');
      }

      // Validate date format (YYYY-MM-DD)
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(date)) {
          return res.status(400).send('Invalid date format. Use YYYY-MM-DD');
      }

      // Fetch shift info from the database
      const result3 = await pool.query('SELECT * FROM new.shift_info ORDER BY id ASC');
      const result5 = result3.rows;

      // Adjust time helper function
      function adjustTime(time, minutes) {
          const [hours, mins, secs] = time.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, mins, secs);
          date.setMinutes(date.getMinutes() + minutes); // Adjust minutes
          return date.toTimeString().split(' ')[0]; // Return formatted time
      }

      // Find shift record based on shift ID
      const shiftRecord = result5.find(record => record.id === parseInt(shift));

      if (shiftRecord) {
          shiftTimings2 = {
              start: {
                  time: adjustTime(shiftRecord.start_time, -1) // Subtract 1 minute
              },
              end: {
                  time: adjustTime(shiftRecord.end_time, 1) // Add 1 minute
              }
          };
      } else {
          console.error('Invalid shift value or no matching record found.');
          return res.status(400).send('Invalid shift value');
      }

      // console.log("Shift Timings:", shiftTimings2);

      // Handle case where the shift spans across midnight
      let result;
      if (shiftTimings2.start.time > shiftTimings2.end.time) {
        result = await pool.query(
          `
          SELECT timestamp, machine_status, part_status 
          FROM new.machine_signal_pool 
          WHERE machine_id = $1 
            AND (
                (to_char(timestamp, 'YYYY-MM-DD') = $2 AND to_char(timestamp, 'HH24:MI') >= $3)
                OR
                (to_char(timestamp, 'YYYY-MM-DD') = to_char(to_date($2, 'YYYY-MM-DD') + interval '1 day', 'YYYY-MM-DD') 
                 AND to_char(timestamp, 'HH24:MI') <= $4)
            )
          ORDER BY timestamp ASC
          `,
          [id, date, shiftTimings2.start.time, shiftTimings2.end.time]
      );
        } else {
            result = await pool.query(
                'SELECT timestamp, machine_status, part_status FROM new.machine_signal_pool WHERE machine_id = $1 AND to_char(timestamp, \'YYYY-MM-DD\') = $2 AND to_char(timestamp, \'HH24:MI\') BETWEEN $3 AND $4 ORDER BY timestamp ASC',
                [id, date, shiftTimings2.start.time, shiftTimings2.end.time] 
            );
        }

      // Debug log for raw result rows
      // console.log("Raw machine signal data:", result.rows);

      // Adjust timestamps to local timezone (Asia/Kolkata)
      result.rows.forEach(row => {
          row.timestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      });

      // Fetch shift duration and downtime configuration
      const result2 = await pool.query('SELECT shift_duration, planned_non_production, planned_downtime FROM new.config_info');
      const shift_duration = result2.rows[0].shift_duration;
      const planned_non_production = result2.rows[0].planned_non_production;
      const planned_downtime = result2.rows[0].planned_downtime;

      const planned_production = shift_duration - (planned_non_production + planned_downtime);
      const available_idle_time = planned_non_production + planned_downtime;

      // Calculate performance metrics (custom functions)
      const machineState = calculateMachineSate(result.rows);
      const productionTime = calculateProductionTime(result.rows);
      const idleTime = calculateIdleTime(result.rows);
      const offTime = calculateOffTime(result.rows);
      const availability = calculateAvailability(result.rows, available_idle_time, planned_production);
      const performance = calculatePerformance(result.rows);
      const quality = calculateQuality(result.rows);
      const oee = calculateOee(availability, performance, quality);
      const goodpart = calculateGoodPart(result.rows);
      const actualProducedQuantity = calculateActualProducedQuantity(result.rows);
      const badpart = actualProducedQuantity - goodpart;
      const idealCycleTime = calculateIdealCycleTime(result.rows);
      const performancedummy = ((actualProducedQuantity * idealCycleTime) / productionTime) * 100;

      res.json({
          MachineState: machineState,
          ProductionTime: Math.round(productionTime),
          IdleTime: Math.round(idleTime),
          OffTime: Math.round(offTime),
          Availability: availability,
          Performance: performance,
          Quality: quality,
          OEE: oee,
          PartCount: actualProducedQuantity,
          GoodPart: goodpart,
          BadPart: badpart,
          Result: result.rows,
          IdealCycleTime: idealCycleTime,
          performancedummy: performancedummy,
          startTime: shiftTimings2.start.time,
          endTime: shiftTimings2.end.time,
          currentDate: date // Use the passed date
      });
  } catch (error) {
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
        const {id ,startDate , endDate} = req.query;
        
        if(!id || !startDate || !endDate){
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

        const result= await pool.query(`select timestamp, machine_status , part_status from new.machine_signal_pool WHERE machine_id = $1 AND to_char(timestamp, 'YYYY-MM-DD') BETWEEN $2 AND $3 ORDER BY timestamp ASC`,[id , formattedStartDate, formattedEndDate]);
        
        result.rows.forEach(row => {
          row.timestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
         });

         const result2 = await pool.query('select shift_duration, planned_non_production , planned_downtime from new.config_info');
          shift_duration = result2.rows[0].shift_duration;
          planned_non_production = result2.rows[0].planned_non_production;
          planned_downtime = result2.rows[0].planned_downtime;

          planned_production = shift_duration - (planned_non_production+planned_downtime);
          available_idle_time = planned_non_production + planned_downtime;

        const productionTime = calculateProductionTime(result.rows);
        const idleTime = calculateIdleTimeAnalytics(result.rows);
        const offTime = calculateOffTimeByDate(result.rows);
        const availability = calculateAvailability(result.rows , available_idle_time , planned_production);
        const performance = calculatePerformance(result.rows);
        const quality = calculateQuality(result.rows);
        const oee = calculateOee(availability , performance , quality);
        const goodpart = calculateGoodPart(result.rows);
        const actualProducedQuantity = calculateActualProducedQuantity(result.rows);
        const badpart = actualProducedQuantity - goodpart;
    

        res.json({
            ProductionTime : Math.round(productionTime),
            IdleTime : Math.round(idleTime),
            OffTime : Math.round(offTime),
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


app.get('/report', async (req, res)=>{
      try {
         
        const {id , startDate , endDate} = req.query;
        
        if(!id || !startDate || !endDate){
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

        const result= await pool.query(`select timestamp, machine_status , part_status from new.machine_signal_pool WHERE machine_id = $1 AND to_char(timestamp, 'YYYY-MM-DD') BETWEEN $2 AND $3 ORDER BY timestamp ASC`,[id ,formattedStartDate, formattedEndDate]);
        
        const dataByDate = {};

        result.rows.forEach(row => {
            const formattedTimestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
            const dateOnly = formattedTimestamp.split(' ')[0]; // Extract the date portion

            row.timestamp = formattedTimestamp; // Update the timestamp

            if (!dataByDate[dateOnly]) {
                dataByDate[dateOnly] = [];
            }
            dataByDate[dateOnly].push(row);
        });

        const reportByDate = {};

        const result2 = await pool.query('select shift_duration, planned_non_production , planned_downtime from new.config_info');
          shift_duration = result2.rows[0].shift_duration;
          planned_non_production = result2.rows[0].planned_non_production;
          planned_downtime = result2.rows[0].planned_downtime;

          planned_production = shift_duration - (planned_non_production+planned_downtime);
          available_idle_time = planned_non_production + planned_downtime;

        for (const date in dataByDate) {
            if (dataByDate.hasOwnProperty(date)) {
                const records = dataByDate[date];
                reportByDate[date] = {
                  productionTimeByDate:  Math.round(calculateProductionTime(records)),
                  idleTimeByDate: Math.round(calculateIdleTimeAnalytics(records)),
                  offTimeByDate: Math.round(calculateOffTimeByDate(records)),
                  availabilityByDate: calculateAvailability(records , available_idle_time , planned_production),
                  performanceByDate: calculatePerformance(records),
                  qualityByDate: calculateQuality(records),
                  oeeByDate: calculateOee(
                      calculateAvailability(records , available_idle_time , planned_production),
                      calculatePerformance(records),
                      calculateQuality(records)
                  ),
                  goodpartByDate: calculateGoodPart(records),
                  actualProducedQuantityByDate: calculateActualProducedQuantity(records),
                  badpart: calculateActualProducedQuantity(records) - calculateGoodPart(records)
              };
            }

        }

        res.json(reportByDate);
           

      } catch (error) {
        console.error('Error fetching report:', error);
        res.status(500).send('An error occurred while fetching the report');
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

  const id = socket.handshake.query.id; // Access the id from the query parameters

  // console.log('Client connected to machine data');

  const fetchLiveData = async () => {
    try {
      let shiftTimings4;
      const currentHour4 = new Date().getHours(); // Get the current hour (0-23)

      const result4 = await pool.query('SELECT * FROM new.shift_info ORDER BY id ASC');

      // Utility function to adjust time by minutes
      function adjustTime(time, minutes) {
          const [hours, mins, secs] = time.split(':').map(Number);
          const date = new Date();
          date.setHours(hours, mins, secs);
          date.setMinutes(date.getMinutes() + minutes); // Adjust minutes
          return date.toTimeString().split(' ')[0]; // Return formatted time
      }
      const getHourFromTime = (timeString) => parseInt(timeString.split(':')[0], 10);

      if (currentHour4 >= getHourFromTime(result4.rows[0].start_time) && currentHour4 < getHourFromTime(result4.rows[1].start_time)) {
        shiftTimings4 = {
          start: {
            time: adjustTime(result4.rows[0].start_time , -1)
          },
          end: {
            time: adjustTime(result4.rows[0].end_time , +1)
          }
        }
      } else {
        shiftTimings4 = {
          start: {
            time: adjustTime(result4.rows[1].start_time , -1)
          },
          end: {
            time: adjustTime(result4.rows[1].end_time , +1)
          }
        }
      }
      let result2;
      if (shiftTimings4.start.time > shiftTimings4.end.time) {
        result2 = await pool.query(
          `
          SELECT  machine_status
          FROM new.machine_signal_pool 
          WHERE machine_id = $1 
            AND (
                (to_char(timestamp, 'YYYY-MM-DD') = $2 AND to_char(timestamp, 'HH24:MI') >= $3)
                OR
                (to_char(timestamp, 'YYYY-MM-DD') = to_char(to_date($2, 'YYYY-MM-DD') + interval '1 day', 'YYYY-MM-DD') 
                 AND to_char(timestamp, 'HH24:MI') <= $4)
            )
          ORDER BY timestamp DESC
          LIMIT 1
          `,
          [id, currentDate, shiftTimings4.start.time, shiftTimings4.end.time]
      );
        } else {
          result2 = await pool.query(
            `SELECT machine_status 
             FROM new.machine_signal_pool
             WHERE machine_id = $1 AND to_char(timestamp, 'YYYY-MM-DD') = $2
             AND to_char(timestamp, 'HH24:MI') BETWEEN $3 AND $4
             ORDER BY timestamp DESC
             LIMIT 1`,
            [id , currentDate , shiftTimings4.start.time , shiftTimings4.end.time]
        );
        }
    
            if (result2.rows.length > 0) {
                    machineState = result2.rows[0].machine_status;
            } else {
                machineState = 'Null';
            }

              const now = new Date();
              const nextDay = new Date(now.getTime() + 24 * 60 * 60 * 1000);
              const currentHour2 = now.getHours();
          
              let currentShift;
              let shiftTimings;

            
              if (currentHour2 >= getHourFromTime(result4.rows[0].start_time) && currentHour2 < getHourFromTime(result4.rows[1].start_time)) {
                currentShift = '1';
                shiftTimings = {
                  start: {
                    date: now.toLocaleDateString(),
                    time: result4.rows[0].start_time
                  },
                  end: {
                    date: now.toLocaleDateString(),
                    time: result4.rows[0].end_time
                  }
                }
              } else {
                currentShift = '2';
                shiftTimings = {
                  start: {
                    date: now.toLocaleDateString(),
                    time: result4.rows[1].start_time
                  },
                  end: {
                    date: nextDay.toLocaleDateString(),
                    time: result4.rows[1].end_time
                  }
                };
              }

    
      let result;
      if (shiftTimings4.start.time > shiftTimings4.end.time) {
        result = await pool.query(
          `
          SELECT timestamp, machine_status, part_status 
          FROM new.machine_signal_pool 
          WHERE machine_id = $1 
            AND (
                (to_char(timestamp, 'YYYY-MM-DD') = $2 AND to_char(timestamp, 'HH24:MI') >= $3)
                OR
                (to_char(timestamp, 'YYYY-MM-DD') = to_char(to_date($2, 'YYYY-MM-DD') + interval '1 day', 'YYYY-MM-DD') 
                 AND to_char(timestamp, 'HH24:MI') <= $4)
            )
          ORDER BY timestamp ASC
          `,
          [id, currentDate, shiftTimings4.start.time, shiftTimings4.end.time]
      );
        } else {
            result = await pool.query(
                `SELECT timestamp, machine_status, part_status FROM new.machine_signal_pool WHERE machine_id = $1 AND to_char(timestamp, \'YYYY-MM-DD\') = $2 AND to_char(timestamp, \'HH24:MI\') BETWEEN $3 AND $4 ORDER BY timestamp ASC`,
                [id, currentDate, shiftTimings4.start.time, shiftTimings4.end.time] 
            );
        } 

      result.rows.forEach(row => {
        row.timestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
      });

      // console.log(result.rows , shiftTimings4.start.time, shiftTimings4.end.time);

      const result3 = await pool.query('select shift_duration, planned_non_production , planned_downtime from new.config_info');
          shift_duration = result3.rows[0].shift_duration;
          planned_non_production = result3.rows[0].planned_non_production;
          planned_downtime = result3.rows[0].planned_downtime;

          planned_production = shift_duration - (planned_non_production+planned_downtime);
          available_idle_time = planned_non_production + planned_downtime;

      const productionTime = calculateProductionTime(result.rows);
      const idleTime = calculateIdleTime(result.rows);
      const offTime = calculateOffTime(result.rows);
      const availability = calculateAvailability(result.rows , available_idle_time , planned_production);
      const performance = calculatePerformance(result.rows);
      const quality = calculateQuality(result.rows);
      const oee = calculateOee(availability, performance, quality);
      const goodpart = calculateGoodPart(result.rows);
      const actualProducedQuantity = calculateActualProducedQuantity(result.rows);
      const badpart = actualProducedQuantity - goodpart;


      return {
        ProductionTime: Math.round(productionTime),
        IdleTime: Math.round(idleTime),
        OffTime: Math.round(offTime),
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
        EndTime: shiftTimings.end.time,
        MachineState: machineState

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
    // console.log('Client disconnected');
  });
});

  app.get('/machineDetails' , async(req , res)=>{
    try {
       
      const result = await pool.query('select id , machine_name from new.machine_config');

      res.json(result.rows);

    } catch (error) {
       console.log(error);
    }
  })

  app.get('/history' , async (req, res)=>{
       try {
        const {id} = req.query;
        const result = await pool.query(`select * from new.machine_signal_pool where machine_id= $1`, [id]);
        
        result.rows.forEach(row => {
          row.timestamp = moment(row.timestamp).tz('Asia/Kolkata').format('YYYY-MM-DD HH:mm:ss');
        });
        const result2 = await pool.query('select shift_duration, planned_non_production , planned_downtime from new.config_info');
          shift_duration = result2.rows[0].shift_duration;
          planned_non_production = result2.rows[0].planned_non_production;
          planned_downtime = result2.rows[0].planned_downtime;

          planned_production = shift_duration - (planned_non_production+planned_downtime);
          available_idle_time = planned_non_production + planned_downtime;
  
        const productionTime = calculateProductionTime(result.rows);
        const idleTime = calculateIdleTime(result.rows);
        const offTime = calculateOffTime(result.rows);
        const availability = calculateAvailability(result.rows , available_idle_time , planned_production);
        const performance = calculatePerformance(result.rows);
        const quality = calculateQuality(result.rows);
        const oee = calculateOee(availability, performance, quality);
        const goodpart = calculateGoodPart(result.rows);
        const actualProducedQuantity = calculateActualProducedQuantity(result.rows);
        const badpart = actualProducedQuantity - goodpart;
  
  
        res.json( {
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
          result: result.rows
        });
       } catch (error) {
           console.log(error);
       }
  });

  app.post('/insertGeneralConfig', async (req, res) => {
    try {
        const { shiftDuration, plannedNonProduction, plannedDowntime } = req.body;

        const checkResult = await pool.query(`SELECT COUNT(*) AS row_count FROM new.config_info`);

        if (parseInt(checkResult.rows[0].row_count) === 0) {
        const result = await pool.query(
            `INSERT INTO new.config_info (shift_duration, planned_non_production, planned_downtime) 
            VALUES ($1, $2, $3)`, 
            [shiftDuration, plannedNonProduction, plannedDowntime]
        );
        res.json({ message: 'Data inserted successfully', result });
        }
        else {
          res.status(400).json({ message: 'Data already exists. Only one row is allowed in this table.' });
      }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error inserting data', error });
    }
}); 

app.post('/insertShiftInfo' , async(req, res)=>{
   try {
     const {startTime , endTime} = req.body;
     const checkResult = await pool.query(`SELECT COUNT(*) AS row_count FROM new.shift_info`);

     if (parseInt(checkResult.rows[0].row_count) < 3) {
     const result = await pool.query(`insert into new.shift_info (start_time , end_time) values ($1 , $2)`, [startTime , endTime]);
     res.json({ message: 'Data inserted successfully', result });
     }
     else {
      res.status(400).json({ message: 'Data already exists. Only three row is allowed in this table.' });
  }
   } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error inserting data', error });
   }
});

  server.listen(5000, () => {
    console.log('Server running on port 5000');
  });

// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

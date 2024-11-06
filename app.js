const express = require('express');
const pool = require('./db'); // Make sure this path is correct
const app = express();
const port = 3000;

app.use(express.json());

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

        const day = String(now.getDate()).padStart(2, '0'); 
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = now.getFullYear();
        const currentDate = `${year}-${month}-${day}`; // Format as YYYY-MM-DD

app.get('/shiftTiming', (req, res)=>{

    try {
        const currentHour = now.getHours();

        // Define shift times
        const shift1 = { start: 9, end: 17 }; // 9 AM to 5 PM
        const shift2 = { start: 18, end: 2 }; // 6 PM to 2 AM (next day)
    
        if (currentHour >= shift1.start && currentHour < shift2.start) {
            currentShift = 'Shift 1';
        } else if ((currentHour >= shift2.start && currentHour < shift1.start)) {
            currentShift = 'Shift 2';
        } 
    
        if(currentShift === "Shift 1"){
           shiftTimings= {
               start: {
                 date: now.toLocaleDateString(),
                 time: '09:00:00'
               },
               end:{
                date: now.toLocaleDateString(),
                time: '17:00:00'
               }
          }
        }
        else if(currentShift === "Shift 2"){
            shiftTimings = {
                start:{
                    date: now.toLocaleDateString(),
                    time: '18:00:00'
                },
                end:{
                    date: nextDay.toLocaleDateString(),
                    time: '02:00:00'
                }
            }
        }    
        // Send response
        res.json({
            Shift : currentShift,
            Start : [shiftTimings.start.date ,shiftTimings.start.time],
            End : [shiftTimings.end.date ,shiftTimings.end.time]
        });
    } 
    
    catch (error) {
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

const calculateOffTime = (records) =>{
    let totalMinutes = 0;

    // Get the current date
    const currentDate = new Date();

    // Set shift end times dynamically based on current date
    const shiftEndFirstShift = new Date(currentDate.setHours(17, 0, 0, 0)); // 5:00 PM today
    const shiftEndSecondShift = new Date(currentDate.setDate(currentDate.getDate() + 1)); // Move to the next day
    shiftEndSecondShift.setHours(2, 0, 0, 0); // 2:00 AM tomorrow

    for (let i = 0; i < records.length; i++) {
        if (records[i].machine_status === 'OFF') {
            const start = new Date(records[i].timestamp);

            let end;
            // Check if it's the last row
            if (i === records.length - 1) {
                // If the "OFF" status is in the last row, calculate the time till the shift end
                const shiftEnd = (start.getHours() < 17) ? shiftEndFirstShift : shiftEndSecondShift;
                end = shiftEnd;
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


app.get('/machineTiming', async (req,res)=>{
    try{
        const result= await pool.query(`select timestamp, machine_status , part_status from new.machine_signal_pool WHERE to_char(timestamp, 'YYYY-MM-DD') = $1  AND to_char(timestamp, 'HH24:MI') BETWEEN $2 AND $3`, [currentDate, shiftTimings.start.time, shiftTimings.end.time]);
    
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
    }
    catch(error){
        console.error('Error fetching data:', error);
        res.status(500).send('Server error');
    }
});



// Start the server
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

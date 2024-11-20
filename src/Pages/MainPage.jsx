import { Card, Button , Modal , Form , Input , TimePicker , message } from 'antd';
import '../App.css'
import logo from '../assets/cmti_logo.jpg'
import mono from '../assets/mono.jpg'
import mcv from '../assets/mcv.webp'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';


const machines = [
  { id: '1', image: mono, title: 'MONO 200', subtitle: 'SMDDC' },
  { id: '2',image: mcv, title: 'MCV 450', subtitle: 'SMDDC' },
];

function MainPage() {

    const navigate = useNavigate();

    const [isModalVisible , setIsModalVisible] = useState(false);
    const [shift1Start , setShift1Start] = useState(null);
    const [shift1End , setShift1End] = useState(null);
    const [shift2Start , setShift2Start] = useState(null);
    const [shift2End , setShift2End] = useState(null);
    const [shift3Start , setShift3Start] = useState(null);
    const [shift3End , setShift3End] = useState(null);

    const [shiftDuration, setShiftDuration] = useState('');
    const [plannedNonProduction, setPlannedNonProduction] = useState('');
    const [plannedDowntime, setPlannedDowntime] = useState('');
    

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await axios.get('http://192.168.137.161:3000/getGeneralConfig');
          console.log(response.data);
  
          // Assuming the response is in the form of an array and you're using the first item
          if (response.data.length > 0) {
            setShiftDuration(response.data[0].shift_duration);
            setPlannedNonProduction(response.data[0].planned_non_production);
            setPlannedDowntime(response.data[0].planned_downtime);
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData();
    }, []);

    useEffect(() => {
      const fetchData2 = async () => {
        try {
          const response = await axios.get('http://192.168.137.161:3000/getShiftConfig');
          console.log(response.data);
  
          if (response.data.length > 0) {
            const shiftData = response.data;

            if (shiftData[0]) {
              setShift1Start(dayjs(shiftData[0].start_time, 'HH:mm:ss'));
              setShift1End(dayjs(shiftData[0].end_time, 'HH:mm:ss'));
            }

            if (shiftData[1]) {
              setShift2Start(dayjs(shiftData[1].start_time, 'HH:mm:ss'));
              setShift2End(dayjs(shiftData[1].end_time, 'HH:mm:ss'));
            }

           if (shiftData[2]) {
              setShift3Start(dayjs(shiftData[2].start_time, 'HH:mm:ss'));
              setShift3End(dayjs(shiftData[2].end_time, 'HH:mm:ss'));
           }
          }
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };
  
      fetchData2();
    }, []);



    const handleCardClick = (machineId)=>{
        navigate(`/${machineId}/home`);
    }

    const handleButtonClick = ()=>{
      setIsModalVisible(true);
    }

    const handleModalClose = ()=>{
      setIsModalVisible(false);
    }

    const handleTimeChange = (timeType, value, shiftNumber) => {
      const formattedTime = value ? value : null;
    
      if (shiftNumber === 1) {
        if (timeType === 'startTime') {
          setShift1Start(formattedTime);
        } else if (timeType === 'endTime') {
          setShift1End(formattedTime);
        }
      } 
      else if (shiftNumber === 2) {
        if (timeType === 'startTime') {
          setShift2Start(formattedTime);
        } else if (timeType === 'endTime') {
          setShift2End(formattedTime);
        }
      }
      else if (shiftNumber === 3) {
        if (timeType === 'startTime') {
          setShift3Start(formattedTime);
        } else if (timeType === 'endTime') {
          setShift3End(formattedTime);
        }
      }
      
    };

    const handleSubmitClick = async()=>{
          try {

            if (!shiftDuration || !plannedNonProduction || !plannedDowntime) {
              message.error('Please fill in all time fields');
              return;
            }

              const response = await axios.post(
              'http://192.168.137.83:3000/insertGeneralConfig',
              {
                  shiftDuration: shiftDuration,
                  plannedNonProduction: plannedNonProduction,
                  plannedDowntime: plannedDowntime,
              },
              {
                  headers: {
                      'Content-Type': 'application/json',
                  },
              }
          );
          console.log('Response:' , response.data);
          message.success('Data saved successfully');
          } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
          }
    }


    const handleSave1Click = async () => {
      console.log('shift1:' ,shift1Start , shift1End);

      try {
          const response = await axios.post(
              'http://192.168.137.83:3000/insertShiftInfo',
              {
                startTime: shift1Start,
                endTime: shift1End,
              },
              {
                headers: { 'Content-Type': 'application/json' }
              }
            );
          console.log('Response:' , response.data);
          message.success('Shift 1 times saved successfully');
      } catch (error) {
          console.error('Error:', error.response ? error.response.data : error.message);
      }
  };

  const handleSave2Click = async () => {
    console.log('shift2:',shift2Start , shift2End);
    try {
        const promises = await axios.post('http://192.168.137.83:3000/insertShiftInfo',
            {
              startTime: shift2Start,
              endTime: shift2End,
            },
            {
              headers: { 'Content-Type': 'application/json' }
            }
          );
        console.log('Response:' , promises.data);
        message.success('Shift 2 times saved successfully');
    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
};

const handleSave3Click = async () => {
  console.log('shift3:',shift3Start , shift3End);

  try {
      const promises = await axios.post('http://192.168.137.83:3000/insertShiftInfo',
          {
            startTime: shift3Start,
            endTime: shift3End,
          },
          {
            headers: { 'Content-Type': 'application/json' }
          }
        );
        console.log('Response:' , promises.data);
        message.success('Shift 3 times saved successfully');
  } catch (error) {
      console.error('Error:', error.response ? error.response.data : error.message);
  }
};

  return (
    <>
   <div className="flex justify-between items-start p-5 ">
     <h1 className="text-4xl font-bold text-black mt-3 ml-5">Machine OEE Monitoring</h1>
     <img className="mr-4" src={logo} alt="Machine OEE Logo" style={{width:'160px' , height:'50px'}} />
   </div>
   <hr/>
   <div style={{marginLeft:'1350px', marginTop:'10px'}}>
    <Button type='primary' onClick={handleButtonClick}>General Config</Button>
   </div>
   <div className="p-5 flex ml-10 mt-7">
                {machines.map((machine) => (
                    <Card
                        key={machine.id}
                        hoverable
                        style={{ width: 300 }}
                        cover={<img alt={machine.title} src={machine.image} />}
                        className="shadow-md mx-7" // Added horizontal margin here
                        onClick={() => handleCardClick(machine.id)}
                    >
                        <Card.Meta
                            title={machine.title}
                            description={machine.subtitle}
                        />
                    </Card>
                ))}
            </div>
            <Modal
               title="General Configuration"
               visible={isModalVisible}
               onCancel={handleModalClose}
               footer={[
               <Button key="cancel" onClick={handleModalClose}>
                 Cancel
               </Button>,
               <Button key="save" type="primary" onClick={handleSubmitClick}>
                  Submit
               </Button>,
            ]}
           >
        <Form layout="vertical">
          <Form.Item label="Total Shift Duration (in minutes)">
            <Input placeholder="Enter total shift duration" value={shiftDuration} onChange={(e) => setShiftDuration(e.target.value)} />
          </Form.Item>
          <Form.Item label="Planned Non-production Time (in minutes)">
            <Input placeholder="Enter planned non-production time" value={plannedNonProduction} onChange={(e) => setPlannedNonProduction(e.target.value)}  />
          </Form.Item>
          <Form.Item label="Planned Downtime (in minutes)">
            <Input placeholder="Enter planned downtime" value={plannedDowntime} onChange={(e) => setPlannedDowntime(e.target.value)} />
          </Form.Item>

          <div>
            <h4>Shift Timings</h4>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <h3 style={{ margin: 0 }}>Shift: 1</h3>
            <TimePicker
              placeholder="Start Time"
              format="HH:mm:ss"
              value={shift1Start ? dayjs(shift1Start) : null}
              onChange={(time) => handleTimeChange('startTime', time, 1)}
              className="w-32"
            />
             <TimePicker
               placeholder="End Time"
               format="HH:mm:ss"
               value={shift1End ? dayjs(shift1End) : null}
               onChange={(time) => handleTimeChange('endTime', time, 1)}
              className="w-32"
              />
             <Button type="primary" onClick={handleSave1Click}>
               Save
             </Button>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' , marginTop:'10px'}}>
          <h3>Shift: 2</h3>
            <TimePicker
              placeholder="Start Time"
              format="HH:mm:ss"
              value={shift2Start ? dayjs(shift2Start) : null}
              onChange={(time) => handleTimeChange('startTime', time,2)}
              className="w-32"
            />
            <TimePicker
              placeholder="End Time"
              format="HH:mm:ss"
              value={shift2End ? dayjs(shift2End) : null}
              onChange={(time) => handleTimeChange('endTime', time,2)}
              className="w-32"
            />
            <Button type='primary' onClick={handleSave2Click}>Save</Button>
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' , marginTop:'10px'}}>
            <h3>Shift: 3</h3>
            <TimePicker
              placeholder="Start Time"
              format="HH:mm:ss"
              value={shift3Start ? dayjs(shift3Start) : null}
              onChange={(time) => handleTimeChange('startTime', time,3)}
              className="w-32"
            />
            <TimePicker
              placeholder="End Time"
              format="HH:mm:ss"
              value={shift3End ? dayjs(shift3End) : null}
              onChange={(time) => handleTimeChange('endTime', time,3)}
              className="w-32"
            />
            <Button type='primary' onClick={handleSave3Click}>Save</Button>
            </div>
           
          </div>
        </Form>
      </Modal>
    </>
  )
}

export { MainPage , machines };

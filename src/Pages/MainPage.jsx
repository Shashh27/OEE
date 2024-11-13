import { Card, Avatar } from 'antd';
import '../App.css'
import logo from '../assets/cmti_logo.jpg'
import mono from '../assets/mono.jpg'
import mcv from '../assets/mcv.webp'
import { useNavigate } from 'react-router-dom';

const machines = [
  { id: 'machine1', image: mono, title: 'MONO 200', subtitle: 'SMDDC' },
  { id: 'machine2',image: mcv, title: 'MCV 450', subtitle: 'SMDDC' },
];

function MainPage() {

    const navigate = useNavigate();

    const handleCardClick = (machineId)=>{
        navigate(`/${machineId}/home`);
    }

  return (
    <>
   <div className="flex justify-between items-start p-5 ">
     <h1 className="text-4xl font-bold text-black mt-3 ml-5">Machine OEE Monitoring</h1>
     <img className="mr-4" src={logo} alt="Machine OEE Logo" style={{width:'160px' , height:'50px'}} />
   </div>
    <hr/>
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
    </>
  )
}

export { MainPage , machines };

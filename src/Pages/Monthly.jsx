import { Layout } from "antd";
import Dashboard from "./Dashboard";
const { Content } = Layout;



export default function Monthly(){
    return(
        <>
        <Dashboard/>
        <Layout>
            <Content>
                <div>                
                </div>
            </Content>
        </Layout>
        </>
   )
}
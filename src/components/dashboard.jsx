import MenuBar from "./menuBar";
import SideBar from "./sideBar";
const Dashboard = ({children, activeMenu}) => {
    
    return (
        <div>
            <MenuBar activeMenu={activeMenu}/>
           <div className="flex">  
                <div className="max-[1080px]:hidden">
                        <SideBar activeMenu={activeMenu}/>
                </div>
                <div className="grow mx-5">{children}</div>
            </div>
        </div>
    )
}

export default Dashboard;
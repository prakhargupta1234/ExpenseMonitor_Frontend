import Dashboard from "../components/dashboard";
import { useUser } from "../hooks/useUser";

const Home = () => {
    useUser();

    return (
        <div>
            <Dashboard activeMenu="Dashboard">
                this is home page
            </Dashboard>
        </div>
    );
};

export default Home;
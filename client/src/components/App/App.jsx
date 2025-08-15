import AppRoutes from "../../routes/AppRoutes";
import Navbar from "../Navbar/Navbar";
import Footer from "../Footer/Footer";



const App = () => {

  return (
    <div>
      <Navbar />
      <AppRoutes />
      <Footer />
    </div>
  );
};

export default App;

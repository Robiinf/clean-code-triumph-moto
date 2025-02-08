import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Sidenav from "./layouts/Sidenav";
import Company from "./pages/Company";
import Maintenance from "./pages/Maintenance";
import Motorcycle from "./pages/Motorcycle";
import NoPage from "./pages/NoPage";
import SparePart from "./pages/SparePart";
import TestSession from "./pages/TestSession";
import Order from "./pages/Order";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Sidenav />}>
          <Route index element={<Motorcycle />} />
          <Route path="company" element={<Company />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="spare-part" element={<SparePart />} />
          <Route path="orders" element={<Order />} />
          <Route path="test-session" element={<TestSession />} />
          <Route path="*" element={<NoPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const rootElement = document.getElementById("root") as HTMLDivElement;
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);

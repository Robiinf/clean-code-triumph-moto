import { Outlet } from "react-router-dom";

const Sidenav = () => {
  return (
    <div className="w-screen h-screen flex justify-start gap-4">
      <div className="p-4 bg-primary text-primary-foreground h-full">
        <h1 className="text-xl mb-6">Navigation</h1>
        <ul className="space-y-2">
          <li>
            <a href="/">Motos</a>
          </li>
          <li>
            <a href="/company">Entreprises</a>
          </li>
          <li>
            <a href="/maintenance">Maintenances</a>
          </li>
          <li>
            <a href="/square-part">Pièces</a>
          </li>
          <li>
            <a href="/test-session" className="text-nowrap">
              Sessions de test
            </a>
          </li>
        </ul>
      </div>
      <div className="h-full w-full overflow-scroll">
        <Outlet />
      </div>
    </div>
  );
};

export default Sidenav;

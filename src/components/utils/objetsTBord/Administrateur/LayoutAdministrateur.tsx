import React from "react";
import { FaTable, FaUserCheck, FaUsers } from "react-icons/fa";

export default function Layout() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <div className="w-auto">
      <div className="text-[0.8em] flex w-auto">
        <ul>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[200px]">
            <button onClick={() => scrollToSection("section1")} className="flex">
              <div className="p-[3px] pl-2">
                <FaTable />
              </div>
              <div className="pl-2">Tableau de bord</div>
            </button>
          </li>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[200px]">
            <button onClick={() => scrollToSection("section2")} className="flex">
              <div className="p-[3px] pl-2">
                <FaUserCheck />
              </div>
              <div className="pl-2">Gérer les utilisateurs</div>
            </button>
          </li>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[200px]">
            <button onClick={() => scrollToSection("section3")} className="flex">
              <div className="p-[3px] pl-2">
                <FaUsers />
              </div>
              <div className="pl-2">Gérer les groupes</div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

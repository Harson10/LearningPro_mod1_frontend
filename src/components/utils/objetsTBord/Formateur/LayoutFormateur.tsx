import React from "react";
import { FaBook, FaTable, FaUserCheck, FaUsers } from "react-icons/fa";

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
    <div className="w-[300px]">
      <div className="text-[0.8em] flex w-auto">
        <ul>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[205px]">
            <button onClick={() => {
              scrollToSection("section1");
            }} className="flex">
              <div className="p-[3px] pl-2">
                <FaTable />
              </div>
              <div className="pl-1">Tableau de bord</div>
            </button>
          </li>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[205px]">
            <button onClick={() => scrollToSection("section2")} className="flex">
              <div className="p-[3px] pl-2">
                <FaUserCheck />
              </div>
              <div className="pl-1">Gérer les participants</div>
            </button>
          </li>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[205px]">
            <button onClick={() => scrollToSection("section3")} className="flex">
              <div className="p-[3px] pl-2">
                <FaUsers />
              </div>
              <div className="pl-1">Gérer les groupes</div>
            </button>
          </li>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[205px]">
            <button onClick={() => scrollToSection("section4")} className="flex">
              <div className="p-[3px] pl-2">
                <FaBook />
              </div>
              <div className="pl-1">Gérer les formations</div>
            </button>
          </li>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[205px]">
            <button onClick={() => scrollToSection("section5")} className="flex">
              <div className="p-[3px] pl-2">
                <FaBook />
              </div>
              <div className="pl-1">Gérer les modules</div>
            </button>
          </li>
          <li className="hover:bg-sky-200 rounded-[50px] p-1 w-[205px]">
            <button onClick={() => scrollToSection("section6")} className="flex">
              <div className="p-[3px] pl-2">
                <FaUserCheck />
              </div>
              <div className="pl-1">Gérer les paiements</div>
            </button>
          </li>
        </ul>
      </div>
    </div>
  );
}

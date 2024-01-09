import { ReactNode } from "react";

export const BoxWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
    return <div className="bg-white rounded-sm p-4 flex-1 border border-gray-200 flex items-center w-auto h-auto">{ children }</div>;
}

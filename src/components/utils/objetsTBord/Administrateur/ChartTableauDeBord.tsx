import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, XAxis, YAxis } from "recharts";

const ChartTableauDeBord: React.FC = () => {

    const info: any = [
        {
            nom: "Janvier",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Fevrier",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Mars",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Avril",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Mai",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Juin",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Juillet",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Août",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Septembre",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Octobre",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Novembre",
            Expension: 4000,
            Intrusion: 2400,
        },
        {
            nom: "Décembre",
            Expension: 4000,
            Intrusion: 2400,
        },
    ]

    return (
        <div className="p-[20px]">
        <div className="flex gap-4 ">
            <div className="h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-1">
                <strong className="text-gray-700 font-medium">Transactions</strong>
                <div className="w-full mt-3 flex-1 text-xs">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            width={500}
                            height={300}
                            data={info}
                            margin={{
                                top: 20,
                                right: 10,
                                left: -10,
                                bottom: 0
                            }}>
                            <CartesianGrid strokeDasharray="3 3 0 0" vertical={false} />
                            <XAxis dataKey="nom" />
                            <YAxis />
                            <Legend />
                            <Bar dataKey="Intrusion" fill="#0ea5e9" />
                            <Bar dataKey="Expension" fill="#ea580c" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
        </div>
    );
}

export default ChartTableauDeBord;
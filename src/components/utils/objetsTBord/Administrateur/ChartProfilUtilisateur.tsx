import { Cell, Legend, Pie, PieChart, ResponsiveContainer } from "recharts";


const sexe = [
    { name: "Masculin", value: 540 },
    { name: "Feminin", value: 630 },
    { name: "Autres", value: 8 },
]

const RADIAN = Math.PI / 180;
const COLORS = ["#00C49F", "#FFBB28", "#FF8042"]

const renderLabelCustomise = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }:any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x < cx ? "start" : "end"} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
}

const ChartProfilUtilisateurs: React.FC = () => {

    return (
        <div className="w-[20rem] h-[22rem] bg-white p-4 rounded-sm border border-gray-200 flex flex-col flex-col">
            <strong className="text-gray-700 font-medium">Profil des utilisateurs</strong>
            <div className="w-full mt-3 flex-1 text-xs">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart width={400} height={300}>
                        <Pie
                            data={sexe}
                            cx={50}
                            cy={45}
                            labelLine={false}
                            label={renderLabelCustomise}
                            outerRadius={185}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {
                                sexe.map((_, index) => {
                                    return <Cell key={`cell-${index}`} fill={COLORS[index % VideoColorSpace.length]} />
                                })
                            }
                        </Pie>
                        <Legend/>
                    </PieChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}

export default ChartProfilUtilisateurs;
import React from 'react'
import { ChartContainer } from '../ui/chart';
import { Bar, BarChart } from 'recharts';

const Chart = () => {

    const chartData = [
        { month: "January", desktop: 186, mobile: 80 },
        { month: "February", desktop: 305, mobile: 200 },
        { month: "March", desktop: 237, mobile: 120 },
        { month: "April", desktop: 73, mobile: 190 },
        { month: "May", desktop: 209, mobile: 130 },
        { month: "June", desktop: 214, mobile: 140 },
    ]
    const chartConfig = {
        desktop: {
            label: "Desktop",
            color: "#2563eb",
        },
        mobile: {
            label: "Mobile",
            color: "#60a5fa",
        },
    };

    return (
        <ChartContainer config={chartConfig} className="h-[100%] w-full cursor-pointer">
            <BarChart className='cursor-pointer' accessibilityLayer data={chartData}>
                <Bar dataKey="desktop" fill="blue" radius={4} />
                <Bar dataKey="mobile" fill="var(--sidebar-link)" radius={4} />
            </BarChart>
        </ChartContainer>
    )
}

export default Chart
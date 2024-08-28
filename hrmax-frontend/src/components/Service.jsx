import React from 'react'
import LineChartGraph from './LineChartGraph'
import BarChartGraph from './BarChartGraph'
import PieChartGraph from './PieChartGraph'
import AreaChartGraph from './AreaChartGraph'

const Service = () => {
  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-4 w-4/5">
        <h2 className="text-xl font-bold mb-4">Naing Win Service</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="border p-2 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Line Chart</h3>
            <LineChartGraph />
          </div>
          <div className="border p-2 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Bar Chart</h3>
            <BarChartGraph />
          </div>
          <div className="border p-2 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Pie Chart</h3>
            <PieChartGraph />
          </div>
          <div className="border p-2 rounded-lg">
            <h3 className="text-lg font-bold mb-2">Area Chart</h3>
            <AreaChartGraph />
          </div>
        </div>
      </div>
    </div>
  )
}

export default Service
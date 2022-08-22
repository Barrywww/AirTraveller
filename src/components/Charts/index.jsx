import React from 'react'
import { Bar } from 'react-chartjs-2'

class BarChart extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: props.data }
  }

  render() {
    return (
      <div>
        <Bar
          data={this.state.data}
          width={100}
          height={50}
          options={{
            maintainAspectRatio: false,
          }}
        />
      </div>
    )
  }
}

export { BarChart }

import React from 'react';
import { Chart, Tooltip, Axis, SmoothLine } from 'viser-react';
import moment from 'moment';
function LineChart(props) {

    const label = {
        textStyle: {
            fill: '#aaaaaa',
        }
    }
 
    const data = props.data.map(d => {
        return { Iznos:d.value, date: moment(new Date(d.date)).format('DD.MM.YYYY.') };
    });
    return (
        <Chart   data={data} width={550} height={400} padding={[20,40,20,40]} scale={[{
            dataKey: 'date',
            range: [0, 1],
            tickCount:8
        }]}>
            <Tooltip />
            <Axis dataKey="Iznos" label={label} />
            <Axis dataKey="date" label={label} />
            <SmoothLine position="date*Iznos" />
        </Chart>
    )
}

export default LineChart
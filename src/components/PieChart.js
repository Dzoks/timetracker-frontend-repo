import React from 'react';
import { Chart, Tooltip, Coord, Axis, Pie } from 'viser-react';
import DataSet from '@antv/data-set';
function PieChart(props) {
    const scale = [{
        dataKey: 'percent',
        min: 0,
        formatter: '.0%',
    }];
    const dv = new DataSet.View().source(props.data.map(o=>{
        return {...o,text:`${o.text} - ${o.value}`}
    }));
    dv.transform({
        type: 'percent',
        field: 'value',
        dimension: 'text',
        as: 'percent'
    });
    const data = dv.rows;
    const itemTpl = '<li><span style="background-color:{color};" class="g2-tooltip-marker"></span>{text}</li>';
    const tooltip = [
        'text', (item, percent) => {
        percent = (percent * 100).toFixed(2) + '%';
          return {
            text: item,
              value: percent
          };
        },
      ];

    return (<Chart width={400} height={400} data={data} scale={scale}>
        <Tooltip showTitle={false} itemTpl={itemTpl}  />
        <Coord type="theta" />
        <Axis />
        <Pie
            tooltip={tooltip}
            position="percent"
            color="text"
            style={{ stroke: '#fff', lineWidth: 1 }}
            label={['percent', {
                offset: -40,
                textStyle: {
                    rotate: 0,
                    textAlign: 'center',
                    shadowBlur: 2,
                    shadowColor: 'rgba(0, 0, 0, .45)'
                }
            }]}
        />
    </Chart>
    );
}

export default PieChart;
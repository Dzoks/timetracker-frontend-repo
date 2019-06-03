import React from "react";
import { Table,Popover,Button } from "antd";
import Axios from "axios";

class UserTimeSheetTable extends React.Component{

    constructor(props){
        super(props);
        this.state={
            timesheets:[]
        }
    }

    componentDidMount(){
        Axios.get(
            `hub/timesheet/byUserAndProject/${this.props.userId}/${
              this.props.projectId
            }`
          ).then(res => {
            this.setState({ timesheets: res.data });
          });
    }

    

    render(){
        return (
          <Table dataSource={this.state.timesheets} bordered pagination={{ defaultPageSize: 4}}>
            <Table.Column title="Datum" dataIndex="date" key="date" width={150}  />
            <Table.Column title="Broj sati" dataIndex="hours" key="hours" width={100} />
            <Table.Column
              title="Iznos"
              dataIndex="turnover"
              key="turnover"
              width={150}
              render={turnover => <span>{turnover} KM</span>}
            />
            <Table.Column 
              title="Opis"
              dataIndex="description"
              render={description => {
                  if (!description)
                  return null;
                  return <Popover content={description} title='Opis' placement='left'>
                  <Button size="small" type='circle' icon='info' className='action-btn' />
              </Popover>;
              }}
            />
          </Table>
        );
      }
      
}

export default UserTimeSheetTable;
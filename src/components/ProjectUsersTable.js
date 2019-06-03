import React from "react";
import { Table,Button } from "antd";
import Axios from "axios";
import "../css/ProjectPanel.css"
import UserTimesheetModal from "./UserTimesheetModal";

class ProjectUsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.timesheetRef=React.createRef();
  }

  componentDidMount() {
    Axios.get(`hub/userHasProject/${this.props.project.id}`).then(res => {
      this.setState({ users: res.data });
    });
  }

  render() {
    return (
      <div>
        <UserTimesheetModal ref={this.timesheetRef} />
        <Table bordered dataSource={this.state.users} rowKey="id">
          <Table.Column dataIndex="firstName" title="Ime" />
          <Table.Column dataIndex="lastName" title="Prezime" />
          <Table.Column dataIndex="hourRate" title="Satnica" />
          <Table.Column dataIndex="totalHours" title="Ukupno sati" />
          <Table.Column dataIndex="totalTurnover" title="Ukupan iznos" />
          <Table.Column dataIndex="action" render={(text, record) => {
             const {projectId,userId}=record;
              return (
                  <div>
                      <Button type="circle" size="small" icon="info" onClick={e=>this.timesheetRef.current.showModal(projectId,userId)} />
                      <Button type="circle" size="small" icon="edit"  />
                      <Button type="circle" size="small" icon="delete" className="delete-btn" />
                  </div>
              );
          }} />
        </Table>
      </div>
    );
  }
}

export default ProjectUsersTable;

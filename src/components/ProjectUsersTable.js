import React from "react";
import { Table,Button } from "antd";
import Axios from "axios";
import "../css/ProjectPanel.css"
import UserTimesheetModal from "./UserTimesheetModal";
import AddUserToProjectForm from "./AddUserToProjectForm";
import { connect } from "react-redux";

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

  onAddSuccess=item=>{
    this.setState({users:[...this.state.users,item]});
  }

  onDelete=item=>{
    // TODO
  };

  onUnblock=item=>{
    //TODO
  }

  render() {
    return (
      <div>
        <UserTimesheetModal ref={this.timesheetRef} />
        <strong>Korisnici na projektu:</strong><br/>
        <AddUserToProjectForm projectId={this.props.project.id} updateParentList={this.onAddSuccess} />
        <Table bordered dataSource={this.state.users} rowKey="id">
          <Table.Column dataIndex="firstName" title="Ime" />
          <Table.Column dataIndex="lastName" title="Prezime" />
          <Table.Column dataIndex="hourRate" title="Satnica" />
          <Table.Column dataIndex="totalHours" title="Ukupno sati" />
          <Table.Column dataIndex="totalTurnover" title="Ukupan iznos" />
          <Table.Column dataIndex="action" render={(text, record) => {
             const {projectId,userId}=record;
             const isProjectManager=userId===this.props.user.id;

              return (
                  <div>
                      <Button type="circle" size="small" icon="info" onClick={e=>this.timesheetRef.current.showModal(projectId,userId)} />
                      <Button type="circle" size="small" icon="edit"  />
                      {!isProjectManager&&!record.blocked&&<Button type="circle" size="small" icon="delete" className="delete-btn" onClick={e=>this.onDelete(record)} />}
                      {!isProjectManager&&!!record.blocked&&<Button type="circle" size="small" icon="reload" onClick={e=>this.onUnblock(record)}/>}

                  </div>
              );
          }} />
        </Table>
      </div>
    );
  }
}

export default connect(state=>{return {user:state.userData};},{})(ProjectUsersTable);

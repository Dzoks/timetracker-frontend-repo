import React from "react";
import { Button, Popover, message, Modal, Tag, Tooltip } from "antd";
import "../css/ProjectPanel.css";
import { deleteProject, finishProject } from "../actions";
import UserTimeSheetTable from "./UserTimesheetTable";
import { connect } from "react-redux";
import Axios from "axios";
import ProjectUsersTable from "./ProjectUsersTable";
import EditProjectModal from "./EditProjectModal";
import dateformat from 'dateformat';

class ProjectPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectManager: null,
      userTimesheets: null,
    };
    this.editRef=React.createRef();
  }

  componentDidMount() {
    Axios.get(`hub/user/${this.props.project.projectManagerId}`).then(res => {
      const user = res.data;
      if (user)
        this.setState({ projectManager: `${user.firstName} ${user.lastName}` });
    });
  }

  onEdit=()=>{
    this.editRef.current.showModal();
  }

  onFinish = () => {
    Modal.confirm({
      title: "Da li ste sigurni da želite da završite projekat?",
      okText: "Da",
      okType: "success",
      cancelText: "Ne",
      onOk: () => {
        this.props
          .finishProject(this.props.project)
          .then(res => message.success("Projekat uspješno završen."))
          .catch(err => message.error("Greška prilikom završavanja projekta."));
      }
    });
  };

  onDelete = () => {
    Modal.confirm({
      title: "Da li ste sigurni da želite da obrišete projekat?",
      okText: "Da",
      okType: "danger",
      cancelText: "Ne",
      onOk: () => {
        this.props
          .deleteProject(this.props.project.id)
          .then(res => message.success("Projekat uspješno obrisan."))
          .catch(err => message.error("Greška prilikom brisanja projekta."));
      }
    });
  };

  render() {
    const { project, user } = this.props;
    const { projectManager } = this.state;
    let statusNode;
    if (project.finished)
      statusNode = <Tag color="#87d068">Završen</Tag>;
    else if (new Date(project.startDate) > new Date())
      statusNode = <Tag color="#2db7f5">Nije započet</Tag>;
    else
      statusNode = <Tag color="#108ee9">U toku</Tag>;
    const isProjectManager = user.id === project.projectManagerId;
    return (
      <div className="project-panel">
        <EditProjectModal project={project} ref={this.editRef} />
        <div className="project-container">
          <div className="project-info">
            <div className="project-manager">
              <strong>Rukovodilac projekta:</strong> {projectManager}
            </div>
            <div className="project-start date">
              <strong>Datum početka:</strong> {dateformat(new Date(project.startDate),"dd.mm.yyyy.")}
            </div>
            <div className="project-status>">
              <strong>Status: </strong>{statusNode}
            </div>
            <div className="total-hours>">
              <strong>Utrošeno sati: </strong>{project.totalHours||0} h
            </div>
            <div className="total-amount>">
              <strong>{isProjectManager?'Utrošeno sredstava':'Zarada'}: </strong>{project.totalAmount||0} KM
            </div>
          </div>
          {isProjectManager ? (
            <div className="project-users">
              <ProjectUsersTable project={project} />
            </div>
          ) : (
              <div className="user-timesheets">
                <UserTimeSheetTable userId={user.id} projectId={project.id} />
              </div>
            )}
          {!project.finished && <div className="project-buttons">
            {isProjectManager && (
              <Tooltip title="Završavanje projekta">
                <Button type="circle" icon="check" className="action-btn finish-btn" onClick={this.onFinish} />
              </Tooltip>
            )}
            {project.description && (
              <Popover
                content={this.props.project.description}
                title="Opis"
                placement="left"
              >
                <Button type="circle" icon="info" className="action-btn" />
              </Popover>
            )}
            {isProjectManager && (
              <Tooltip title="Izmjena">
                <Button type="circle" icon="edit" className="action-btn" onClick={this.onEdit} />
              </Tooltip>
            )}
            {isProjectManager && (
              <Tooltip title="Brisanje">
                <Button
                  type="circle"
                  onClick={this.onDelete}
                  icon="delete"
                  className="action-btn delete-btn"
                />
              </Tooltip>
            )}
          </div>}
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    return { user: state.userData };
  },
  { deleteProject, finishProject }
)(ProjectPanel);

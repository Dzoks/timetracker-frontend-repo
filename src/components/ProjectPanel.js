import React from "react";
import { Button, Popover, message, Modal, Tag } from "antd";
import "../css/ProjectPanel.css";
import { deleteProject } from "../actions";
import UserTimeSheetTable from "./UserTimesheetTable";
import { connect } from "react-redux";
import Axios from "axios";
import ProjectUsersTable from "./ProjectUsersTable";

class ProjectPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      projectManager: null,
      userTimesheets: null,
    };
  }

  componentDidMount() {
    Axios.get(`hub/user/${this.props.project.projectManagerId}`).then(res => {
      const user = res.data;
      if (user)
        this.setState({ projectManager: `${user.firstName} ${user.lastName}` });
    });
  }

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
      statusNode=<Tag color="#87d068">Završen</Tag>;
    else if (project.startDate<new Date())
      statusNode=<Tag color="#2db7f5">Nije započet</Tag>;
    else
      statusNode=<Tag color="#108ee9">U toku</Tag>;
    const isProjectManager = user.id === project.projectManagerId;
    return (
      <div className="project-panel">
        <div className="project-container">
          <div className="project-info">
            <div className="project-manager">
              <strong>Rukovodilac projekta:</strong> {projectManager}
            </div>
            <div className="project-start date">
              <strong>Datum početka:</strong> {project.startDate}
            </div>
            <div className="project-status>">
              <strong>Status: </strong>{statusNode}
            </div>
            {isProjectManager && (
              <div>
                <div className="project-end-date">
                  <strong>Datum završetka (procjena): </strong>
                  {project.estimatedEndDate}
                </div>
                <div className="project-budget>">
                  <strong>Budžet (procjena): </strong>{project.estimatedBudget}
                  KM
                </div>
                <div className="project-hours">
                  <strong>Broj radnih sati (procjena): </strong>
                  {project.estimatedWorkHours}
                </div>
              </div>
            )}
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
          <div className="project-buttons">
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
              <Button type="circle" icon="edit" className="action-btn" />
            )}
            {isProjectManager && (
              <Button
                type="circle"
                onClick={this.onDelete}
                icon="delete"
                className="action-btn delete-btn"
              />
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default connect(
  state => {
    return { user: state.userData };
  },
  { deleteProject }
)(ProjectPanel);

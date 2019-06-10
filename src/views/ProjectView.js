import React from "react";
import { Collapse, Button,Icon } from "antd";
import { connect } from "react-redux";
import ProjectPanel from "../components/ProjectPanel";
import { getProjects,selectMenuItem } from "../actions";
import AddProjectModal from "../components/AddProjectModal";
import "../css/ProjectView.css";
import UserGroups from "../util/UserGroups";
class ProjectView extends React.Component {
  mapProjectsToPanel = () => {};

  componentDidMount() {
    this.props.getProjects();
    this.props.selectMenuItem("project");

  }

  constructor(props){
    super(props);
    this.addModalRef=React.createRef();
  }
  showModal=()=>{
    this.addModalRef.current.showModal();
  }

  render() {
    return (
      <div className="project-panel">
        {this.props.isProjectManager&&<Button className='project-add-btn' type="primary" onClick={this.showModal}>
            <Icon type="plus" />
            Dodajte novi projekat
        </Button>}
        <AddProjectModal
         ref={this.addModalRef}
        />   
        <Collapse accordion className="project-collapse">
          {this.props.projects.map(project => {
            return (
              <Collapse.Panel header={project.name} key={project.id}>
                <ProjectPanel project={project} />
              </Collapse.Panel>
            );
          })}
        </Collapse>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return { projects: state.projects,isProjectManager:state.userData.userGroupId===UserGroups.PROJECT_MANAGER };
};

export default connect(
  mapStateToProps,
  { getProjects,selectMenuItem }
)(ProjectView);

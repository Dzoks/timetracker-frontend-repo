import React from "react";

import { Modal } from "antd";
import UserTimesheetTable from "./UserTimesheetTable";

class UserTimesheetModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  onCancel = () => {
    this.setState({ visible: false });
  };

  showModal = (projectId, userId) => {
    this.setState({
      visible: true,
      projectId,
      userId
    });
  };

  render() {
    return (
      <Modal
        visible={this.state.visible}
        title="Dodavanje novog projekta"
        footer={false}
        onCancel={this.onCancel}
        destroyOnClose={true}
      >
        <UserTimesheetTable
          projectId={this.state.projectId}
          userId={this.state.userId}
        />
      </Modal>
    );
  }
}

export default UserTimesheetModal;

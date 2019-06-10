import React from "react";
import { Table, Button, message, Tooltip, InputNumber, Form, Modal } from "antd";
import Axios from "axios";
import "../css/ProjectPanel.css"
import UserTimesheetModal from "./UserTimesheetModal";
import AddUserToProjectForm from "./AddUserToProjectForm";
import { connect } from "react-redux";

const ChangeHourRateForm = Form.create({ name: "changeRateForm" })(
  class extends React.Component {

    componentDidUpdate() {

    }

    render() {
      const { visible, onCancel, onSubmit, form, loading } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Promjena satnice"
          destroyOnClose={true}
          onCancel={onCancel}
          width={210}
          footer={[
            <Button key="back" onClick={onCancel}>
              Nazad
            </Button>,
            <Button
              form="changeRateForm"
              htmlType="submit"
              type="primary"
              loading={loading}
              onClick={onSubmit}
            >
              Sačuvaj
            </Button>
          ]}
        >
          <Form layout="vertical" onSubmit={onSubmit}>
            <Form.Item label="Satnica:" >
              {getFieldDecorator("hourRate", { initialValue: this.props.hourRate, rules: [{ required: true, message: 'Satnica je obavezna!' }] })(<InputNumber value={this.props.hourRate} min={0} autoFocus={true} />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);

class ProjectUsersTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      visible: false,
      selectedUser: null,
      selectedHourRate: null,
      loading:false,
    };
    this.timesheetRef = React.createRef();
  }
  saveFormRef = formRef => {
    this.formRef = formRef;
  };
  showModal = (id, hourRate) => {
    this.setState({ visible: true, selectedHourRate: hourRate, selectedUser: id });
  };

  handleCancel = () => {
    this.setState({ visible: false, selectedHourRate: null, selectedUser: null });
  };

  componentDidMount() {
    Axios.get(`hub/userHasProject/${this.props.project.id}`).then(res => {
      this.setState({ users: res.data });
    });
  }

  onAddSuccess = item => {
    this.setState({ users: [...this.state.users, item] });
  }

  onEdit = (e) => {
    e.preventDefault();
    const {form}=this.formRef.props;
    form.validateFields((err, values)=>{
      if (!err){
        const item = {
          id: this.state.selectedUser,
          ...values
        };
        this.setState({loading:true});
        Axios.put('hub/userHasProject', item).then(res => {
          if (res.status === 200 && res.data) {
            this.setState({ users: this.state.users.map(u => u.id !== item.id ? u : { ...u, hourRate: item.hourRate }) })
            message.success("Uspješna izmjena satnice.");
            this.setState({visible:false,loading:false});
          } else {
            message.error("Neuspješna izmjena satnice.");
            this.setState({loading:false});

          }
        }).catch(err =>{
          this.setState({loading:false});
          message.error("Neuspješna izmjena satnice.");
        } );
      }
    });
   
  }

  onDelete = item => {
    Axios.delete(`hub/userHasProject/${item.id}`).then(res => {
      if (res.data.blocked) {
        this.setState({ users: this.state.users.map(u => (u.id === item.id ? { ...u, blocked: true } : u)) });
        message.success("Uspješno blokiranje");
      } else {
        this.setState({ users: this.state.users.filter(u => u.id !== item.id) });
        message.success("Uspješno brisanje");
      }
    }).catch(err => message.error("Neuspješno brisanje."))
  };

  onUnblock = item => {
    Axios.put(`hub/userHasProject/unblock/${item.id}`).then(res => {
      if (res.data) {
        this.setState({ users: this.state.users.map(u => (u.id === item.id ? { ...u, blocked: false } : u)) });
        message.success("Korisnik ponovo aktiviran");
      }
    }).catch(err => message.error("Neuspješno reaktiviranje."))
  }

  render() {
    return (
      <div>
        <ChangeHourRateForm wrappedComponentRef={this.saveFormRef}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          loading={this.state.loading}
          hourRate={this.state.selectedHourRate}
          onSubmit={this.onEdit} />
        <UserTimesheetModal ref={this.timesheetRef} />
        <strong>Korisnici na projektu:</strong><br />
        {!this.props.project.finished && <AddUserToProjectForm projectId={this.props.project.id} updateParentList={this.onAddSuccess} />}
        <Table bordered dataSource={this.state.users} rowKey="id">
          <Table.Column dataIndex="firstName" title="Ime" />
          <Table.Column dataIndex="lastName" title="Prezime" />
          <Table.Column dataIndex="hourRate" title="Satnica" />
          <Table.Column dataIndex="totalHours" title="Ukupno sati" />
          <Table.Column dataIndex="totalTurnover" title="Ukupan iznos" />
          <Table.Column dataIndex="action" render={(text, record) => {
            const { projectId, userId } = record;
            const isProjectManager = userId === this.props.user.id;

            return (
              <div>
                <Tooltip title="Zapisi"><Button type="circle" size="small" icon="info" onClick={e => this.timesheetRef.current.showModal(projectId, userId)} /></Tooltip>
                {!this.props.project.finished && !record.blocked && <Tooltip title="Promjena satnice"><Button type="circle" size="small" icon="edit" onClick={e => this.showModal(record.id, record.hourRate)} /></Tooltip>}
                {!this.props.project.finished && !isProjectManager && !record.blocked && <Tooltip title="Brisanje"><Button type="circle" size="small" icon="delete" className="delete-btn" onClick={e => this.onDelete(record)} /></Tooltip>}
                {!this.props.project.finished && !isProjectManager && !!record.blocked && <Tooltip title="Reaktiviranje"><Button type="circle" size="small" icon="reload" onClick={e => this.onUnblock(record)} /></Tooltip>}

              </div>
            );
          }} />
        </Table>
      </div>
    );
  }
}

export default connect(state => { return { user: state.userData }; }, {})(ProjectUsersTable);

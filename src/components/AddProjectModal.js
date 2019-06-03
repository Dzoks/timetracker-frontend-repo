import React from "react";
import { Form, Modal, Input, DatePicker, message, InputNumber } from "antd";
import { connect } from "react-redux";
import { addProject } from "../actions";

const AddProjectForm = Form.create()(
  class extends React.Component {
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form layout="horizontal">
          <Form.Item label="Naziv:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Naziv je obavezan!" }]
            })(<Input />)}
          </Form.Item>
          <Form.Item label="Opis:">
            {getFieldDecorator("description")(<Input type="textarea" />)}
          </Form.Item>
          <Form.Item>
            <Form.Item label="Datum početka:">
              {getFieldDecorator("startDate", {
                rules: [
                  {
                    required: true,
                    message: "Datum početka je obavezan!"
                  }
                ]
              })(<DatePicker format="DD.MM.YYYY" />)}
            </Form.Item>
            <Form.Item label="Datum završetka (procjena):" layout="inline">
              {getFieldDecorator("estimatedEndDate", {
                rules: []
              })(<DatePicker format="DD.MM.YYYY" />)}
            </Form.Item>
          </Form.Item>

          <Form.Item label="Budžet (procjena):">
            {getFieldDecorator("estimatedBudget")(<InputNumber min="0" />)}
          </Form.Item>
          <Form.Item label="Radni sati (procjena):">
            {getFieldDecorator("estimatedWorkHours")(
              <InputNumber min="0" step="1" />
            )}
          </Form.Item>
          <Form.Item label="Satnica rukovodioca:">
            {getFieldDecorator("hourRate", {
              rules: [
                {
                  required: true,
                  message: "Satnica rukovodioca je obavezna!"
                }
              ]
            })(<InputNumber min="0" step="1" />)}
          </Form.Item>
        </Form>
      );
    }
  }
);

class AddProjectModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      confirmLoading: false
    };
    this.form = null;
  }

  onAddCancel = () => {
    this.form.props.form.resetFields();

    this.setState({ visible: false });
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  onAdd = () => {
    this.form.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ confirmLoading: true });
        this.props
          .addProject(values)
          .then(res => {
            this.form.props.form.resetFields();

            this.setState({ confirmLoading: false, visible: false });
            message.success("Projekat uspješno dodan.");
          })
          .catch(err => {
            this.setState({ confirmLoading: false });
            message.error("Greška prilikom dodavanja projekta.");
          });
      }
    });
  };

  render() {
    return (
      <Modal
        visible={this.state.visible}
        title="Dodavanje novog projekta"
        okText="Dodajte projekat"
        confirmLoading={this.state.confirmLoading}
        onCancel={this.onAddCancel}
        onOk={this.onAdd}
      >
        <AddProjectForm wrappedComponentRef={form => (this.form = form)} />
      </Modal>
    );
  }
}

export default connect(
  null,
  { addProject },
  null,
  { forwardRef: true }
)(AddProjectModal);

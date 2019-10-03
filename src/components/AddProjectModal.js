import React from "react";
import { Button, Form, Modal, Input, DatePicker, message, InputNumber, Row, Col } from "antd";
import { connect } from "react-redux";
import { addProject } from "../actions";

const AddProjectForm = Form.create("addProjectForm")(
  class extends React.Component {
    render() {
      const { getFieldDecorator } = this.props.form;
      return (
        <Form layout="horizontal" onSubmit={e => alert(e)}>
          <Form.Item label="Naziv:">
            {getFieldDecorator("name", {
              rules: [{ required: true, message: "Naziv je obavezan!" }]
            })(<Input onPressEnter={this.props.onSubmit} autoFocus={true} />)}
          </Form.Item>
          <Form.Item label="Opis:">
            {getFieldDecorator("description")(<Input.TextArea rows={4} onPressEnter={this.props.onSubmit} type="textarea" />)}
          </Form.Item>
          <Row>
            <Col span={12}>
              <Form.Item label="Datum početka:">
                {getFieldDecorator("startDate", {
                  rules: [
                    {
                      required: true,
                      message: "Datum početka je obavezan!"
                    }
                  ]
                })(<DatePicker onKeyDown={this.props.onSubmit} format="DD.MM.YYYY" />)}
              </Form.Item>
            </Col>
            <Col span={12}> <Form.Item layout="inline" label="Datum završetka (procjena):">
              {getFieldDecorator("estimatedEndDate", {
              })(<DatePicker onKeyDown={this.props.onSubmit} format="DD.MM.YYYY" />)}
            </Form.Item></Col>
          </Row>
          <Row>
            <Col span={12}>
              <Form.Item label="Satnica rukovodioca:">
                {getFieldDecorator("hourRate", {
                  rules: [
                    {
                      required: true,
                      message: "Satnica rukovodioca je obavezna!"
                    }
                  ]
                })(<InputNumber
                  onKeyDown={e => { if (e.keyCode === 13) this.props.onSubmit() }} min={1} />)}
              </Form.Item>

            </Col>
            <Col span={12}>
              <Form.Item label="Budžet:">
                {getFieldDecorator("budget")(<InputNumber onKeyDown={e => { if (e.keyCode === 13) this.props.onSubmit() }} min={1} />)}
              </Form.Item>
            </Col>
          </Row>
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
        style={{ top: 30 }}
        visible={this.state.visible}
        title="Dodavanje novog projekta"
        onCancel={this.onAddCancel}
        onOk={this.onAdd}
        destroyOnClose={true}
        footer={[
          <Button key="back" onClick={this.onAddCancel}>
            Nazad
                    </Button>,
          <Button
            form={"addProjectForm"}
            htmlType="submit"
            key="submit"
            type="primary"
            loading={this.state.confirmLoading}
            onClick={this.onAdd}
          >
            Sačuvajte
                    </Button>
        ]}
      >
        <AddProjectForm onSubmit={this.onAdd} wrappedComponentRef={form => (this.form = form)} />
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

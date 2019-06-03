import React from "react";
import { Form, InputNumber, Button, Select, Modal, Input, message } from "antd";
import { connect } from "react-redux";
import { getProjects, addTimesheet } from "../actions";
import "../css/AddTimesheetForm.css";

const AddDescriptionForm = Form.create({ name: "addDescriptionForm" })(
  class extends React.Component {
    render() {
      const { visible, onCancel, onAdd, form, loading } = this.props;
      const { getFieldDecorator } = form;
      return (
        <Modal
          visible={visible}
          title="Dodavanje novog unosa"
          destroyOnClose={true}
          onCancel={onCancel}
          footer={[
            <Button key="back" onClick={onCancel}>
              Nazad
            </Button>,
            <Button
              form="addDescriptionForm"
              htmlType="submit"
              type="primary"
              loading={loading}
              onClick={onAdd}
            >
              Sačuvaj
            </Button>
          ]}
        >
          <Form layout="vertical" onSubmit={onAdd}>
            <Form.Item label="Opis (opciono):">
              {getFieldDecorator("description")(<Input autoFocus={true} />)}
            </Form.Item>
          </Form>
        </Modal>
      );
    }
  }
);
class AddTimesheetForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popupVisible: false,
      loading: false
    };
  }

  componentDidMount() {
    this.props.getProjects();
  }

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({ popupVisible: true });
      }
    });
  };

  onAdd = e => {
    e.preventDefault();
    this.setState({ loading: true });
    const timesheet={...this.props.form.getFieldsValue(),...this.formRef.props.form.getFieldsValue(),date:this.props.selectedDate};
    this.props.addTimesheet(timesheet).then(res=>{
      message.success("Uspješno dodavanje.")
      this.setState({loading:false,popupVisible:false});

    }).catch(err=>{
      this.setState({loading:false});
      message.error("Greška prilikom dodavanja.")
    })
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <AddDescriptionForm
          wrappedComponentRef={this.saveFormRef}
          loading={this.state.loading}
          visible={this.state.popupVisible}
          onCancel={() => this.setState({ popupVisible: false,loading:false })}
          onAdd={this.onAdd}
        />
        <Form
          layout="inline"
          className="form-container"
          onSubmit={this.onSubmit}
        >
          <Form.Item>
            {getFieldDecorator("userHasProjectId", {
              rules: [{ required: true }]
            })(
              <Select
                showSearch
                style={{ width: 150 }}
                placeholder="Projekat"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.props.children
                    .toLowerCase()
                    .indexOf(input.toLowerCase()) >= 0
                }
              >
                {this.props.projects.map(p => (
                  <Select.Option
                    value={p.userHasProjectId}
                    key={p.userHasProjectId}
                  >
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("hours", {
              rules: [{ required: true }]
            })(
              <InputNumber
                placeholder="h"
                style={{ width: 50 }}
                min="0"
                step="1"
                max="25"
              />
            )}
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            shape="circle"
            icon="plus"
            size="small"
          />
        </Form>
      </div>
    );
  }
}

const WrappedForm = Form.create({ name: "normal_login" })(AddTimesheetForm);

const mapStateToProps = state => {
  return {
    selectedDate:state.selectedDate,
    projects: state.projects.filter(
      p => !p.finished && new Date(p.startDate) <= new Date()
    )
  };
};

export default connect(
  mapStateToProps,
  { getProjects, addTimesheet }
)(WrappedForm);

import React from "react";
import { Form, Modal, Input, DatePicker, message, Button } from "antd";
import { connect } from "react-redux";
import { editProject } from "../actions";
import moment from 'moment';

const EditProjectForm = Form.create({name:"editProject"})(
    class extends React.Component {

        componentDidMount(){
            let {startDate}=this.props.project;
            startDate=new Date(startDate);
            this.props.form.setFieldsValue({...this.props.project, startDate:moment(startDate)});
            // TODO projekat
        }

        render() {
            const { getFieldDecorator } = this.props.form;
            return (
                <Form layout="horizontal">
                    <Form.Item label="Naziv:">
                        {getFieldDecorator("name", {
                            rules: [{ required: true, message: "Naziv je obavezan!" }]
                        })(<Input onPressEnter={this.props.onSubmit} autoFocus={true} />)}
                    </Form.Item>
                    <Form.Item label="Opis:">
                        {getFieldDecorator("description")(<Input onPressEnter={this.props.onSubmit} type="textarea" />)}
                    </Form.Item>
                    <Form.Item label="Datum početka:"  >
                        {getFieldDecorator("startDate", {
                            rules: [
                                {
                                    required: true,
                                    message: "Datum početka je obavezan!"
                                }
                            ]
                        })(<DatePicker disabled={this.props.project.totalHours>0} format="DD.MM.YYYY"  />)}
                    </Form.Item>
                </Form>
            );
        }
    }
);

class EditProjectModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false
        };
    }

    onEditCancel = () => {
        this.form.props.form.resetFields();

        this.setState({ visible: false });
    };

    showModal = () => {
        this.setState({ visible: true });

    };



    onEdit = () => {
        this.form.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true });
                this.props
                    .editProject({...this.props.project,...values})
                    .then(res => {
                        this.form.props.form.resetFields();

                        this.setState({ confirmLoading: false, visible: false });
                        message.success("Uspješna izmjena.");
                    })
                    .catch(err => {
                        this.setState({ confirmLoading: false });
                        message.error("Greška prilikom izmjene.");
                    });
            }
        });
    };

    render() {
        return (
            <Modal
                visible={this.state.visible}
                title="Izmjena projekta"
                okText="Sačuvajte"
                confirmLoading={this.state.confirmLoading}
                onCancel={this.onEditCancel}
                destroyOnClose={true}
                footer={[
                    <Button key="back" onClick={this.onEditCancel}>
                      Nazad
                    </Button>,
                    <Button
                      form="editProject"
                      htmlType="submit"
                      type="primary"
                      loading={this.state.confirmLoading}
                      onClick={this.onEdit}
                    >
                      Sačuvaj
                    </Button>
                  ]}
            >
                <EditProjectForm onSubmit={this.onEdit} project={this.props.project} wrappedComponentRef={form => (this.form = form)} />
            </Modal>
        );
    }
}

export default connect(
    null,
    { editProject },
    null,
    { forwardRef: true }
)(EditProjectModal);
import React from "react";
import { Form, Modal, Input, DatePicker, message, Button, Row, Col,InputNumber } from "antd";
import { connect } from "react-redux";
import { editProject } from "../actions";
import moment from 'moment';

const EditProjectForm = Form.create({ name: "editProject" })(
    class extends React.Component {

        componentDidMount() {
            let { startDate, estimatedEndDate } = this.props.project;
            startDate = moment(new Date(startDate));
            estimatedEndDate = estimatedEndDate ?  moment(new Date(estimatedEndDate)):null;
            this.props.form.setFieldsValue({ ...this.props.project, startDate, estimatedEndDate });
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
                        {getFieldDecorator("description")(<Input.TextArea lines={4} onPressEnter={this.props.onSubmit} type="textarea" />)}
                    </Form.Item>
                    <Row>
                        <Col span={12}>
                            <Form.Item label="Datum početka:"  >
                                {getFieldDecorator("startDate", {
                                    rules: [
                                        {
                                            required: true,
                                            message: "Datum početka je obavezan!"
                                        }
                                    ]
                                })(<DatePicker disabled={this.props.project.totalHours > 0} format="DD.MM.YYYY" />)}
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item label="Datum završetka (procjena):"  >
                                {getFieldDecorator("estimatedEndDate")(<DatePicker format="DD.MM.YYYY" />)}
                            </Form.Item>
                        </Col>
                    </Row>
                    <Form.Item label="Budžet (KM):">
                        {getFieldDecorator("budget")(<InputNumber onKeyDown={e => { if (e.keyCode === 13) this.props.onSubmit() }} min={1} />)}
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
                    .editProject({ ...this.props.project, ...values })
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
                style={{ top: 30 }}
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
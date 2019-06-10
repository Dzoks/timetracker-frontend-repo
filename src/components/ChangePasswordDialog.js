import React from 'react';
import { Modal, Input, message, Form, Button } from 'antd';
import { connect } from 'react-redux';
import { updatePassword } from '../actions';

const PasswordForm = Form.create("passwordForm")(



    class extends React.Component {
        compareToFirstPassword = (rule, value, callback) => {
            const form = this.props.form;
            if (value && value !== form.getFieldValue('newPassword')) {
              callback('Ponovljena lozinka nije identična!');
            } else {
              callback();
            }
        }
        render() {
            const { getFieldDecorator } = this.props.form;
            return (
                <Form layout="horizontal" onSubmit={this.props.onSubmit}>
                    <Form.Item label="Trenutna lozinka:">
                        {getFieldDecorator("oldPassword", {
                            rules: [{ required: true, message: "Trenutna lozinka je obavezna!" }]
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="Nova lozinka:">
                        {getFieldDecorator("newPassword", {
                            rules: [{ required: true, message: "Nova lozinka je obavezna!" }]
                        })(<Input.Password />)}
                    </Form.Item>
                    <Form.Item label="Potvrdite lozinku:">
                        {getFieldDecorator("confirmPassword", {
                            rules: [{ required: true, message: "Potvrđena lozinka je obavezna!" }, {
                                validator: this.compareToFirstPassword,
                            },]
                        })(<Input.Password />)}
                    </Form.Item>
                </Form>
            );
        }
    }
);

class ChangePasswordModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            confirmLoading: false
        };
    }

    onCancel = () => {
        this.setState({ visible: false });
    }

    showModal = () => {
        this.setState({ visible: true });
    }

    onSubmit = () => {
        this.form.props.form.validateFields((err, values) => {
            if (!err) {
                this.setState({ confirmLoading: true });

                this.props.updatePassword({ id: this.props.user.id, ...values }).then(res => {
                    this.setState({ confirmLoading: false, visible: false });
                    message.success("Promjena lozinke uspješna.");

                }).catch(err => {
                    this.setState({ confirmLoading: false });
                    message.error("Greška prilikom promjene lozinke.");
                });
            }
        });
    }

    render() {
        return (<Modal
            visible={this.state.visible}
            title="Promjena lozinke"
            onCancel={this.onCancel}
            confirmLoading={this.state.confirmLoading}
            destroyOnClose={true}
            footer={[
                <Button key="back" onClick={this.onCancel}>
                    Nazad
                </Button>,
                <Button
                    form="passwordForm"
                    htmlType="submit"
                    type="primary"
                    loading={this.state.confirmLoading}
                    onClick={this.onSubmit}
                >
                    Sačuvaj
                </Button>
            ]}
        >
            <PasswordForm wrappedComponentRef={form => (this.form = form)} onSubmit={this.onSubmit} />
        </Modal>);
    }
}

const mapStateToProps = state => {
    return {
        user: state.userData
    }
}

export default connect(mapStateToProps, { updatePassword }, null, { forwardRef: true })(ChangePasswordModal)
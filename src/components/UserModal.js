import React from 'react';
import { Form, Modal, Button, Input, message, Select } from 'antd';
import Axios from 'axios';


const UserForm = Form.create({ name: "userForm" })(
    class extends React.Component {
        render() {
            const { getFieldDecorator } = this.props.form;

            return (<Form layout="vertical" >
                <Form.Item label="Email">
                    {getFieldDecorator('email', {
                        initialValue: this.props.user.email,
                        rules: [{ required: true, message: 'Email je obavezan!' }],
                    })(<Input onPressEnter={this.props.onSubmit} autoFocus={true} />)}
                </Form.Item>
                <Form.Item label="Grupa" style={{ display: this.props.hideGroup ? "none" : "inherit" }}
                >
                    {getFieldDecorator("userGroupId", {

                        initialValue: this.props.user.userGroupId,
                        rules: [{ required: true, message: 'Grupa je obavezna!' }]
                    })(
                        <Select
                            showSearch
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {this.props.userGroups.map(ug => (
                                <Select.Option
                                    value={ug.id}
                                    key={ug.id}
                                >
                                    {ug.name}
                                </Select.Option>
                            ))}
                        </Select>
                    )}
                </Form.Item>
                <Form.Item label="Ime">
                    {getFieldDecorator('firstName', {
                        initialValue: this.props.user.firstName,
                        rules: [{ required: true, message: 'Ime je obavezno!' }],
                    })(<Input onPressEnter={this.props.onSubmit} />)}
                </Form.Item>
                <Form.Item label="Prezime">
                    {getFieldDecorator('lastName', {
                        initialValue: this.props.user.lastName,
                        rules: [{ required: true, message: 'Prezime je obavezno!' }],
                    })(<Input onPressEnter={this.props.onSubmit} />)}
                </Form.Item>

            </Form>)
        }
    }
);

class UserModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            hideUserGroup: false,
            title: "Dodavanje korisnika",
            visible: false,
            confirmLoading: false,
            user: {}
        }
    }

    onCancel = () => {
        this.setState({ visible: false });
    }

    showAddModal = () => {
        this.setState({
            title: "Dodavanje korisnika",
            visible: true
        });

    }

    showEditModal = (user, userId) => {
        this.setState({
            hideUserGroup: userId === user.id,
            user, title: "Izmjena korisnika",
            visible: true
        });
    }

    onSubmit = e => {
        e.preventDefault();
        const { form } = this.form.props;
        form.validateFields((err, values) => {
            if (!err) {
                if (this.state.user.id)
                    this.onEdit(values);
                else this.onAdd(values);
            }

        });
    }

    onAdd = (values) => {
        this.setState({ confirmLoading: true });
        Axios.post("hub/user", values).then(res => {
            if (res.status === 200 && res.data) {
                message.success("Korisnik uspješno dodan.");
                this.props.onAdd(values);
                this.setState({ visible: false, confirmLoading: false });
            } else {
                message.error("Greška prilikom dodavanja.");
                this.setState({ confirmLoading: false });
            }
        }).catch(err => {
            if (err.response.status === 400)
                message.error(err.response.data);
            else message.error("Neuspješna izmjena.");
            this.setState({ confirmLoading: false });
        })
    }

    onEdit = (values) => {
        const postObject = { ...this.state.user, ...values };
        this.setState({ confirmLoading: true });
        Axios.put("hub/user", postObject).then(res => {
            if (res.status === 200 && res.data) {
                message.success("Uspješna izmjena.");
                this.props.onEdit(postObject);
                this.setState({ visible: false, confirmLoading: false });
            } else {

                message.error("Neuspješna izmjena.");
                this.setState({ confirmLoading: false });
            }
        }).catch(err => {
            if (err.response.status === 400)
                message.error(err.response.data);
            else message.error("Neuspješna izmjena.");
            this.setState({ confirmLoading: false });
        })
    }

    render() {

        return (<Modal
            visible={this.state.visible}
            title={this.state.title}
            onCancel={this.onCancel}
            destroyOnClose={true}
            footer={[
                <Button key="back" onClick={this.onCancel}>
                    Nazad
                </Button>,
                <Button
                    form="userForm"
                    htmlType="submit"
                    key="submit"
                    type="primary"
                    loading={this.state.confirmLoading}
                    onClick={this.onSubmit}
                >
                    Sačuvaj
                </Button>
            ]}
        >   <UserForm hideGroup={this.state.hideUserGroup} userGroups={this.props.userGroups} onSubmit={this.onSubmit} user={this.state.user} wrappedComponentRef={form => (this.form = form)} />

        </Modal>);
    }
}

export default UserModal;
import React from 'react';
import { Form, message, InputNumber, Select, Button } from 'antd';
import Axios from 'axios';

class AddUserToProjectForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: []
        }
    }

    componentDidMount() {
        Axios.get(`hub/user/availableFor/${this.props.projectId}`).then(res => {
            if (res.status === 200)
                this.setState({ users: res.data });
        })
    }

    onSubmit = e => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                Axios.post(`hub/userHasProject`, { ...values, projectId: this.props.projectId }).then(res => {
                    if (res.status === 200) {
                        this.props.form.resetFields();
                        this.setState({ users: this.state.users.filter(u => u.id !== values.userId) });
                        this.props.updateParentList(res.data);
                        message.success("Korisnik dodan u projekat.");
                    } else {
                        message.error("Greška prilikom dodavanja korisnika u projekat.");
                    }
                }).catch(err => message.error("Greška prilikom dodavanja korisnika u projekat."))
            }
        })
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <Form layout="inline" className="form-container" onSubmit={this.onSubmit}>
                    <Form.Item >
                        {getFieldDecorator("userId", {
                            rules: [{ required: true }]
                        })(<Select
                            showSearch
                            style={{ width: 370 }}
                            placeholder="Odaberite korisnika"
                            optionFilterProp="children"
                            filterOption={(input, option) =>
                                option.props.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                            }
                        >
                            {
                                this.state.users.map(u => {
                                    return (<Select.Option value={u.id} key={u.id}>
                                        {u.firstName} {u.lastName} ({u.email})
                                    </Select.Option>);
                                })
                            }
                        </Select>)
                        }
                    </Form.Item>
                    <Form.Item>
                        {getFieldDecorator("hourRate", {
                            rules: [{ required: true }]
                        })(
                            <InputNumber
                                placeholder="Satnica"
                                min={0}
                            />
                        )}
                    </Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        icon="plus"
                    >Dodajte</Button>
                </Form>
            </div>
        )
    }
}

export default Form.create({ name: "add_user_to_project" })(AddUserToProjectForm);
import React from "react";
import { Form, Icon, Input, Button, message } from "antd";
import 'antd/dist/antd.css';
import "../css/LoginView.css";
import {loginAction} from '../actions';
import {connect} from 'react-redux';
import { Redirect} from 'react-router-dom';
import logo from "../images/logo.png";

class LoginView extends React.Component {

  handleSubmit =  e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.loginAction(values).then(()=>{
          message.success('Uspješno ste se prijavili.',2);
          this.props.history.push('/timesheet')
        }).catch(err=>message.error('Pogrešni podaci za prijavljivanje. Molimo pokušajte ponovo.',2));  
      }
    });
  };

  render() {
    if (this.props.authenticated)
      return <Redirect to="/" />
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="login-panel">
        <img src={logo} alt="logo" className="login-logo" />
        <Form onSubmit={this.handleSubmit} className="login-form">
        <Form.Item help={false}>
          {getFieldDecorator("email", {
            rules: [{ required: true, message: "Email je obavezan!" }]
          })(
            <Input
              prefix={<Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email"
            />
          )}
        </Form.Item>
        <Form.Item>
          {getFieldDecorator("password", {
            rules: [{ required: true, message: "Lozinka je obavezna!" }]
          })(
            <Input
              prefix={<Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />}
              type="password"
              placeholder="Lozinka"
            />
          )}
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="login-form-button"
          >
            Prijavite se
          </Button>
        </Form.Item>
      </Form>
      </div>
      
    );
  }
}

const mapStateToProps=state=>{
  return {
    authenticated:!!state.userData
  }
}

export default connect(mapStateToProps,{loginAction})(Form.create({})(LoginView));

import React from "react";
import { Menu, Button, message, Tooltip, Icon } from "antd";
import { Link, withRouter } from "react-router-dom";
import "../css/Header.css";
import { logoutAction } from "../actions";
import { connect } from "react-redux";
import logo from "../images/logo.png";
import {userGroups} from "../util";
import ChangePasswordDialog from "./ChangePasswordDialog";

class HeaderView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: "timesheet"
    };
    this.modalRef = React.createRef();
  }


  showModal = () => {
    this.modalRef.current.showModal();
  }

  logout = e => {
    this.props.logoutAction().then(success => {
      message.success("Uspješno ste se odjavili.");
      this.props.history.push("/");
    });
  };

  handleClick = e => {
    this.setState({
      current: e.key
    });
  };

  render() {
    if (this.props.authenticated)
      return (
        <div>
          <ChangePasswordDialog ref={this.modalRef} />
          <img alt="logo" src={logo} className="menu-logo" />
          <Menu
            onClick={this.handleClick}
            selectedKeys={[this.props.selectedMenuItem]}
            mode="horizontal"
            className="header"
          >
            <Menu.Item key="timesheet">
              <Link to="/">Kalendar</Link>
            </Menu.Item>
            <Menu.Item key="project">
              <Link to="/project">Projekti</Link>
            </Menu.Item>
            <Menu.Item key="user">
              <Link hidden={this.props.user.userGroupId===userGroups.USER} to="/user">Korisnici</Link>
            </Menu.Item>
            <span style={{ float: "right" }}>
              <span style={{ marginRight: '8px' }} >
                <strong>
                  <i>
                    {this.props.user.firstName} {this.props.user.lastName}
                  </i>
                </strong>
              </span>
              <Tooltip title="Promijenite lozinku"><Icon type="lock" className="change-password" onClick={this.showModal} /></Tooltip>
              <Button
                className="logout-btn"
                type="primary"
                onClick={this.logout}
              >
                Odjavite se
              </Button>
            </span>
          </Menu>
        </div>
      );
    else return null;
  }
}

const mapStateToProps = state => {
  return {
    user: state.userData,
    authenticated: !!state.userData,
    selectedMenuItem: state.selectedMenuItem,
  };
};

export default connect(
  mapStateToProps,
  { logoutAction }
)(withRouter(HeaderView));

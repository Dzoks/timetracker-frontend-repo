import React from "react";
import { BrowserRouter, Route,Redirect } from "react-router-dom";
import ProjectView from "./views/ProjectView";
import LoginView from "./views/LoginView";
import TimeSheetView from "./views/TimeSheetView";
import PrivateRoute from "./util/PrivateRoute";
import { connect } from "react-redux";
import { getStateAction } from "./actions";
import Header from "./components/Header";
import { Spin, Icon } from "antd";
import "./css/LoginView.css";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    };
  }

  componentDidMount() {
    this.props
      .getStateAction()
      .then(suc => this.setState({ loading: false }))
      .catch(err => this.setState({ loading: true }));
  }

  render() {
    if (this.state.loading) {
      const icon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
      return <Spin className="spinner" indicator={icon} />;
    }
    return (
      <div>
        <BrowserRouter>
          <div>
            <Header />
            <Route
              exact
              path="/"
              render={() => <Redirect to="/timesheet" />}
            />
            <Route path="/login" exact component={LoginView} />
            <PrivateRoute
              path="/timesheet"
              exact
              component={TimeSheetView}
              authenticated={this.props.authenticated}
            />
            <PrivateRoute
              path="/project"
              exact
              component={ProjectView}
              authenticated={this.props.authenticated}
            />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    authenticated: !!state.userData
  };
};

export default connect(
  mapStateToProps,
  { getStateAction }
)(App);

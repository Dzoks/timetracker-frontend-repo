import { Calendar, Badge } from "antd";
import React from "react";
import "antd/dist/antd.css";
import { connect } from "react-redux";
import { getTimesheets } from "../actions";
import "../css/TimeSheetView.css";
import { selectDate,selectMenuItem, } from "../actions";
import { datesEqual } from "../util";
import TimesheetSidebar from "../components/TimesheetSidebar";

class TimeSheetView extends React.Component {
  componentDidMount() {
    this.props.getTimesheets(this.props.user.id);
    this.props.selectMenuItem("timesheet");
    this.props.selectDate(new Date());
  }

  getTimesheetsForDate = value => {
    return this.props.timesheets.filter(timesheet =>
      datesEqual(timesheet.date, new Date(value))
    );
  };

  cellRender = value => {
    return (
      <ul className="date-render">
        {this.getTimesheetsForDate(value).map(timesheet => (
          <li key={timesheet.id}>
            <Badge status="success" text={timesheet.projectName} />
          </li>
        ))}
      </ul>
    );
  };

  onDateSelect = selectedDate => {
    this.props.selectDate(new Date(selectedDate));
  };

  render() {
    return (
      <div className="timesheet-layout">
        <div className="calendar-layout">
          <Calendar
            dateCellRender={this.cellRender}
            onSelect={this.onDateSelect}
          />
        </div>
        <div className="sheet-layout">
          <TimesheetSidebar className="sheet-sidebar" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    timesheets: state.timesheets,
    user: state.userData
  };
};

export default connect(
  mapStateToProps,
  { getTimesheets, selectDate,selectMenuItem }
)(TimeSheetView);

import React from "react";
import { Popover, Button, Modal } from "antd";
import { connect } from "react-redux";
import AddTimesheetForm from "./AddTimesheetForm";
import { datesEqual } from "../util";
import { deleteTimesheet } from "../actions";
import "../css/TimesheetSidebar.css";
class TimesheetSidebar extends React.Component {
  onDelete = timesheetId => {
    Modal.confirm({
      title: "Da li ste sigurni da želite da obrišete unos?",
      okText: "Da",
      okType: "danger",
      cancelText: "Ne",
      onOk: () => {
        this.props.deleteTimesheet(timesheetId);
      }
    });
  };
  render() {
    return (
      <div className={this.props.className}>
        <AddTimesheetForm />
        <ul className="sheet-list">
          {this.props.selectedTimesheets.map(t => (
            <li className="sheet-list-item" key={t.id}>
              <div>
                <div>
                  <strong>Projekat: </strong>
                  {t.projectName}
                </div>
                <div>
                  <strong>Broj sati: </strong>
                  {t.hours} h
                </div>
              </div>
              <div>
                {t.description && (
                  <Popover
                    content={t.description}
                    title="Opis"
                    placement="left"
                  >
                    <Button
                      size="small"
                      type="circle"
                      icon="info"
                      className="action-btn"
                    />
                  </Popover>
                )}
                <Button
                  type="circle"
                  size="small"
                  onClick={e => this.onDelete(t.id)}
                  icon="delete"
                  className="action-btn delete-btn"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { selectedDate, timesheets } = state;
  const selectedTimesheets = selectedDate
    ? timesheets.filter(t => datesEqual(selectedDate, t.date))
    : [];
  return {
    selectedTimesheets
  };
};

export default connect(
  mapStateToProps,
  { deleteTimesheet }
)(TimesheetSidebar);

import React from 'react';
import { Table, Tooltip, Button, Modal, message } from 'antd';
import { connect } from 'react-redux';
import "../css/UserView.css";
import { selectMenuItem } from "../actions";
import Axios from 'axios';
import UserModal from '../components/UserModal';
import {Redirect} from 'react-router-dom';
import {userGroups} from "../util";

class UserView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            users: [],
            userGroups: []
        }

        this.userModalRef = React.createRef();
    }

    componentDidMount() {
        this.props.selectMenuItem("user");
        Axios.get("hub/userGroup").then(res => {
            this.setState({ userGroups: res.data });
        })
        Axios.get("hub/user").then(res => {
            this.setState({ users: res.data });
        })
    }

    showAddModal = () => {
        this.userModalRef.current.showAddModal();
    }

    onDelete = record => {
        Modal.confirm({
            title: "Da li ste sigurni da želite da obrišete korisnika?",
            okText: "Da",
            okType: "danger",
            cancelText: "Ne",
            onOk: () => {
                Axios.delete(`hub/user/${record.id}`).then(res => {
                    if (res.status === 200 && res.data) {
                        message.success("Korisnik uspješno obrisan.");
                        this.setState({ users: this.state.users.filter(u => u.id !== record.id) });
                    } else {
                        message.error("Neuspješno brisanje.");
                    }
                }).catch(err => {
                    if (err.response.status === 400)
                        message.error(err.response.data);
                    else message.error("Neuspješno brisanje.");
                });
            }
        });
    }

    onGeneratePassword=record=>{
        Modal.confirm({
            title: "Da li ste sigurni da želite da generišete novu lozinku za korisnika?",
            okText: "Da",
            okType: "danger",
            cancelText: "Ne",
            onOk: () => {
                Axios.put(`hub/user/generatePassword`,{id:record.id}).then(res => {
                    if (res.status === 200 && res.data) {
                        message.success("Uspješno generisana nova lozinka.");
                    } else {
                        message.error("Greška prilikom generisanja lozinke.");
                    }
                }).catch(err => {
                    if (err.response.status === 400)
                        message.error(err.response.data);
                    else message.error("Greška prilikom generisanja lozinke.");
                });
            }
        });
    }

    onAdd = user => {
        this.setState({users:[...this.state.users,user]});
    }

    onEdit = user => {
        this.setState({ users: this.state.users.map(u => (u.id === user.id ? { ...u, ...user } : u)) });

    }

    render() {
        if (this.props.user.userGroupId===userGroups.USER)
            return <Redirect to="/" />
        return (<div className="user-panel">
            <UserModal ref={this.userModalRef} onAdd={this.onAdd} onEdit={this.onEdit} userGroups={this.state.userGroups} />
            <Button className="add-btn" type="primary" icon="plus" onClick={this.showAddModal} >Dodajte novog korisnika</Button>
            <Table bordered dataSource={this.state.users} rowKey="id">
                <Table.Column dataIndex="email" title="Email" />
                <Table.Column dataIndex="firstName" title="Ime" />
                <Table.Column dataIndex="lastName" title="Prezime" />
                <Table.Column dataIndex="userGroup" title="Grupa" render={(text,record)=>{
                    const group=this.state.userGroups.find(ug=>ug.id===record.userGroupId);
                    if (group)
                    return <div>{group.name}</div>;
                    return null;
                }}/>;
                <Table.Column dataIndex="action" render={(text, record) => {
                    return (<div>
                        <Tooltip title="Izmjena"><Button type="circle" size="small" icon="edit" onClick={e => this.userModalRef.current.showEditModal(record,this.props.user.id)} /></Tooltip>
                        <Tooltip title="Generisanje nove lozinke"><Button type="circle" size="small" icon="lock" onClick={e => this.onGeneratePassword(record)} /></Tooltip>

                        {record.id !== this.props.user.id && <Tooltip title="Brisanje"><Button type="circle" size="small" className="delete-btn" icon="delete" onClick={e => this.onDelete(record)} /></Tooltip>}
                    </div>)
                }} />
            </Table>

        </div>);
    }
}

const mapStateToProps = state => {
    return { user: state.userData }
}

export default connect(mapStateToProps, { selectMenuItem })(UserView);
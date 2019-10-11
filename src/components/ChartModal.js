import React from 'react';
import { Modal, Row, Select, Empty } from 'antd';
import Axios from 'axios';
import PieChart from './PieChart';
import LineChart from './LineChart';
import "../css/ChartModal.css";


class ChartModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            options: [],
            selectedValue: null,
            lineData: [],
            pieData: [],
            emptyData: true,
        };
    }

    onCancel = () => {
        this.setState({ visible: false, emptyData: true, selectedValue: null });
    }

    showModal = (options) => {
        this.setState({ options, visible: true, emptyData: true, selectedValue: null });
        // this.handleOptionChange(options[0].id);
    }

    handleOptionChange = value => {
        this.setState({ selectedValue: value });
        const option = this.state.options.find(o => o.id == value);
        const piePromise = Axios.get(option.pieUrl).then(res => {
            this.setState({ pieData: res.data })
        })
        const linePromise = Axios.get(option.lineUrl).then(res => {
            this.setState({ lineData: res.data })
        })
        Promise.all([piePromise, linePromise]).then(res => {
            this.setState({ emptyData: false });
        })
    }

    render() {
        return (
            <Modal
                width={1000}
                visible={this.state.visible}
                title={this.props.title}
                onCancel={this.onCancel}
                destroyOnClose={true}
                footer={null}
            >
                <Row  className="select-row" >
                    <span>Odaberite opciju: </span><Select value={this.state.selectedValue} onChange={this.handleOptionChange} className='select'>
                        {this.state.options.map(option => <Select.Option key={option.id} value={option.id}>{option.text}</Select.Option>)}
                    </Select>
                </Row>


                <Row className='chart-row' type="flex" justify="center" align="center">
                    {this.state.emptyData ? <Empty className='empty' /> :
                        <>
                            <LineChart data={this.state.lineData} />
                            <PieChart data={this.state.pieData} />
                        </>
                    }
                </Row>
            </Modal>
        )

    }

}

export default ChartModal;
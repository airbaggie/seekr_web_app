"use strict";


class DropdownButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const Dropdown = ReactBootstrap.Dropdown;

        return (
            <Dropdown className="dropdown">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Change status
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "Applied");
                                                                        this.props.reFresh();
                                                                        }}>Applied</Dropdown.Item>
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "Online assessment");
                                                                        this.props.reFresh();
                                                                        }}>Online assessment</Dropdown.Item>
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "Phone screen");
                                                                        this.props.reFresh();
                                                                        }}>Phone screen</Dropdown.Item>
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "On-site");
                                                                        this.props.reFresh();
                                                                        }}>On-site</Dropdown.Item>
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "Decision made");
                                                                        this.props.reFresh();
                                                                        }}>Decision made</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>   
        );
    }
}


class LogModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    
        this.fetchLogs = this.fetchLogs.bind(this);
        this.handleLogInput = this.handleLogInput.bind(this);
        this.postLog = this.postLog.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.generateLogHistory = this.generateLogHistory.bind(this);
    
        this.state = {
            show: false,
            log: "",
            logs: [],
        };
    }

    fetchLogs(evt) {
        evt.preventDefault();
    
        fetch(`/logs?user_job_id=${this.props.user_job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ logs: data });
            }).then(this.setState({ log: ""}));
    }

    handleClose() {
        this.setState({ show: false });
    }
  
    handleShow() {
        this.setState({ show: true });
    }

    handleLogInput(evt) {
        this.setState({ log: evt.target.value });
    }

    postLog(user_job_id, log) {

        if (log) {
            const data = new FormData();
            data.append("user_job_id", user_job_id);
            data.append("log", log);
    
            fetch("api/log", {
                method: "POST",
                body: data,
                }).then((evt) => {this.fetchLogs(evt)})
                .then(this.handleClose())
                // .then(this.props.reFresh())
        }
        this.setState({ log: "" });
        
    }

    generateLogHistory() {
        const logs = [];
        for (const log of this.state.logs) {
            logs.push(
                    <div className="log-history">
                        <span className="mb-1">{log.log}</span>
                        <span className="right_header log-time italic">{log.log_date}</span>
                    </div>
                    )
        }
        return logs;
    }

    render() {
        const Modal = ReactBootstrap.Modal;
        const Button = ReactBootstrap.Button;

        return (
            <div>
                <Button variant="primary" onClick={(evt) => {
                                                    this.handleShow(evt);
                                                    this.fetchLogs(evt);
                                                    }}>
                    add log
                </Button>
        
                <Modal show={this.state.show}
                       onHide={this.handleClose}
                       size="lg"
                       aria-labelledby="contained-modal-title-vcenter"
                       className="job-detail-modal"
                       centered>
                    <Modal.Header closeButton>
                    <Modal.Title>
                        <div>
                            <h5>{this.props.title}</h5>
                            <p>{this.props.company_name}</p>
                        </div>
                        <DropdownButton user_job_id={this.props.user_job_id}
                                        status={this.props.status} 
                                        changeStatus={this.props.changeStatus}
                                        reFresh={this.props.reFresh}
                                        />
                    </Modal.Title>
                    </Modal.Header>
                    <div>{this.generateLogHistory()}</div>
                    <form>
                        <div className="form-group add-log">
                            <label htmlFor="messageText" className="col-form-label">Add log:</label>
                            <textarea className="form-control log-input" id="messageText" name="log" onChange={this.handleLogInput}></textarea>
                        </div>
                    </form>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <button type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                this.postLog(`${this.props.user_job_id}`, `${this.state.log}`);
                                // this.props.reFresh();
                                }}>
                        Submit
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

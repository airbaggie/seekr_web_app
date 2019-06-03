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
                }).then((evt) => {this.fetchLogs(evt)});
        }
        this.setState({ log: "" });
        this.handleFormReset();
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
                                    }}>
                        Submit
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}


class TrackingCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div key={this.props.user_job_id} className="tracking-card">
                <p className="card-title">{this.props.title}</p>
                <p className="card-company">{this.props.company_name}</p>
                <LogModal user_job_id={this.props.user_job_id}
                          title={this.props.title}
                          company_name={this.props.company_name}
                          changeStatus={this.props.changeStatus}
                          reFresh={this.props.reFresh}
                           />
            </div>
        );
    }
}


class StatusColumn extends React.Component {
    constructor(props) {
        super(props);

        this.countCard = this.countCard.bind(this);
        this.generateTrackingCards = this.generateTrackingCards.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.postStatusLog = this.postStatusLog.bind(this);
    }

    // reFresh() {
    //     fetch(`/tracking?status=${this.props.status}`)
    //         .then(res => res.json())
    //         .then(data => {
    //             this.setState({ results: data });
    //         });
    // }

    // componentDidMount() {
    //     this.reFresh();
    // }

    // componentDidUpdate() {
    //     this.reFresh();
    // }

    postStatusLog(user_job_id, log) {
        const data = new FormData();
        data.append("user_job_id", user_job_id);
        data.append("log", log);

        fetch("api/log", {
            method: "POST",
            body: data,
            });
    }

    changeStatus(user_job_id, new_status) {
        const data = new FormData();
        data.append('user_job_id', user_job_id);
        data.append('new_status', new_status);

        fetch('api/changestatus', {
            method: 'POST',
            body: data,
            }).then(() => {this.props.reFresh()})
        
        this.postStatusLog(user_job_id, `Status changed: ${new_status}`)
    }

    countCard() {
        return this.props.results.length;
    }

    generateTrackingCards() {
        const tracking_cards = []

        for (const job of this.props.results) {
            tracking_cards.push(<TrackingCard user_job_id={job.user_job_id}
                                              title={job.title}
                                              company_name={job.company_name}
                                              status={job.status}
                                              changeStatus={this.changeStatus}
                                              reFresh={this.props.reFresh}
                                              />)
        }
        return tracking_cards;
    }

    render() {
        return (
            <div className="col-md-2 status-column" key={this.props.status}>
                <p className="column-header">{this.props.status} ({this.countCard()})</p>
                {this.generateTrackingCards()}
            </div>
        );
    }
}


class MyBoard extends React.Component {
    constructor(props) {
        super(props);

        this.generateStatusColumns = this.generateStatusColumns.bind(this);
        this.reFresh = this.reFresh.bind(this);
         // this.reRender = this.reRender.bind(this);

        this.state = {
                        search: "",
                        result: [],
                        Applied: [],
                        Online_assessment: [],
                        Phone_screen: [],
                        Onsite: [],
                        Decision_made: [],
                     };
    }

    reFresh() {
        fetch("/tracking?status=Applied")
            .then(res => res.json())
            .then(data => {
                this.setState({ Applied: data });
            });
        fetch("/tracking?status=Online assessment")
            .then(res => res.json())
            .then(data => {
                this.setState({ Online_assessment: data });
            });
        fetch("/tracking?status=Phone screen")
            .then(res => res.json())
            .then(data => {
                this.setState({ Phone_screen: data });
            });
        fetch("/tracking?status=On-site")
            .then(res => res.json())
            .then(data => {
                this.setState({ Onsite: data });
            });
        fetch("/tracking?status=Decision made")
            .then(res => res.json())
            .then(data => {
                this.setState({ Decision_made: data });
            });
    }
    
    componentDidMount() {
        this.reFresh();
    }
    
    generateStatusColumns() {
        const status_column = []
        status_column.push(<StatusColumn status="Applied" results={this.state.Applied} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Online assessment" results={this.state.Online_assessment} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Phone screen" results={this.state.Phone_screen} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="On-site" results={this.state.Onsite} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Decision made" results={this.state.Decision_made} reFresh={this.reFresh} />)

        return status_column;
    }

    render() {
        return (
            <div>
                <p>TODO: search bar goes here</p>
                <AddJob />
                <div className="container">
                    <div className="row">
                        {this.generateStatusColumns()}
                    </div>
                </div>
            </div>
        ); 
    }
}

window.addEventListener("load", () => {
    ReactDOM.render(
        <MyBoard />,
        document.getElementById("myboard")
    );
})

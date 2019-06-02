"use strict";


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
            })
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

        const data = new FormData();
        data.append('user_job_id', user_job_id);
        data.append('log', log);

        fetch('api/log', {
            method: 'POST',
            body: data,
            }).then((evt) => {this.fetchLogs(evt)});
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
                    </Modal.Title>
                    </Modal.Header>
                    <div>{this.generateLogHistory()}</div>
                    <form>
                        <div className="form-group add-log">
                            <label htmlFor="message-text" className="col-form-label">Add log:</label>
                            <textarea className="form-control log-input" id="message-text" name="log" onChange={this.handleLogInput}></textarea>
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
                          company_name={this.props.company_name} />
            </div>
        );
    }
}


class StatusColumn extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            results: [],
        }

        this.countCard = this.countCard.bind(this);
        this.generateTrackingCards = this.generateTrackingCards.bind(this);
    }

    componentDidMount() {
        fetch(`/tracking?status=${this.props.status}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ results: data });
            });
    };

    countCard() {
        return this.state.results.length;
    }

    generateTrackingCards() {
        const tracking_cards = []

        for (const job of this.state.results) {
            tracking_cards.push(<TrackingCard user_job_id={job.user_job_id}
                                              job_id={job.job_id}
                                              title={job.title}
                                              company_name={job.company_name}
                                              status={job.status} />)
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
    }

    generateStatusColumns() {
        const status_list = ["Applied", "Online assessment", "Phone screen", "On-site", "Decision made"]
        const status_column = []

        for (const status of status_list) {
            status_column.push(<StatusColumn status={status} />)
        }

        return status_column;
    }


    render() {
        return (
            <div>
                <p>TODO: search bar goes here</p>
                <p>TODO: show all button</p>
                <div className="container">
                    <div className="row">
                        {this.generateStatusColumns()}
                    </div>
                </div>
            </div>
        ); 
    }
}


ReactDOM.render(
    <MyBoard />,
    document.getElementById("myboard")
);


"use strict";


class NoteModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
    
        this.state = {
            show: false,
            notes: ["hello", "This is the first job that i have applied!"],
        };
    }

    handleClose() {
        this.setState({ show: false });
    }
  
    handleShow() {
        this.setState({ show: true });
    }

    // TODO: update status and add notes
    // fetchNotes(evt) {
    //     evt.preventDefault();

    //     fetch(`/notes?key=${this.props.job_id}`)
    //         .then(res => res.json())
    //         .then(data => { 
    //             this.setState({ notes: data });
    //         })
    // }


    // TODO: change status. Use dropdown button
    // handleSave(evt) {
    //     evt.preventDefault();

    //     const data = new FormData();                                 //formdata object
    //     data.append("job_id", JSON.stringify(this.props.job_id));    //append the values with key, value pair

    //     fetch("/api/userjobs", {
    //         method: "POST",
    //         body: data,
    //         })

    //     this.setState({ saved: true });
    // }

    render() {
        const Modal = ReactBootstrap.Modal;
        const Button = ReactBootstrap.Button;

        const notes = [];
        for (const note of this.state.notes) {
            notes.push(<p>{note}</p>)
        }

        return (
            <div>
                <Button variant="primary" onClick={(evt) => {
                                                    this.handleShow(evt);
                                                    // this.fetchNotes(evt);
                                                    }}>
                    Add notes
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
                            <h3>{this.props.title}</h3>
                            <h5>{this.props.company_name}</h5>
                        </div>
                    </Modal.Title>
                    </Modal.Header>
                    <div>{notes}</div>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
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
            <div key={this.props.job_id} className="tracking-card">
                <p className="card-title">{this.props.title}</p>
                <p className="card-company">{this.props.company_name}</p>
                <NoteModal title={this.props.title}
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
            tracking_cards.push(<TrackingCard job_id={job.job_id}
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


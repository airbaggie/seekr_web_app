"use strict";


class JobModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        // this.displayAlert = this.displayAlert.bind(this);
        this.fetchTags = this.fetchTags.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    
        this.state = {
            is_active: false,
            show: false,
            tags: [],
            saved: false,
            // message: "",
        };
    }

    handleClose = () => {
        this.setState({ show: false });
    }
  
    handleShow = () => {
        this.setState({ show: true });
    }

    handleSave = (evt) => {
        evt.preventDefault();

        const data = new FormData();                                 //formdata object
        data.append("job_id", JSON.stringify(this.props.job_id));    //append the values with key, value pair

        fetch("/api/userjobs", {
            method: "POST",
            body: data,
            })

        this.setState({ saved: true });
    }

    // displayAlert(evt) {
    //     const Alert = ReactBootstrap.Alert;
    //     return <Alert variant="success">{this.state.message}</Alert>
    // }

    fetchTags = (evt) => {
        evt.preventDefault();

        fetch(`/tags?key=${this.props.job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ tags: data });
            })
    }

    redirectApplication = () => {
        window.open(`${this.props.apply_url}`);
    }
  
    render() {
        const Modal = ReactBootstrap.Modal;
        const Button = ReactBootstrap.Button;
        const Badge = ReactBootstrap.Badge;

        const job_tags = []
        for (const tag of this.state.tags) {
            job_tags.push(<Badge variant="secondary">{tag}</Badge>);
        }

        const save_button = []
        if (!this.state.saved) {
            save_button.push(
                            <Button variant="primary" onClick={this.handleSave}>
                                Save
                            </Button>);
        } else {
            save_button.push(
                            <Button variant="primary" disabled>
                                Saved
                            </Button>);
        }

        return (
            <div key={this.props.job_id}>
                <Button variant="primary" onClick={(evt) => {
                                                    this.handleShow(evt);
                                                    this.fetchTags(evt);
                                                    }}>
                    View Details
                </Button>
        
                <Modal show={this.state.show}
                       onHide={this.handleClose}
                       size="lg"
                       aria-labelledby="contained-modal-title-vcenter"
                       centered>
                    <Modal.Header closeButton>
                    <Modal.Title key={this.props.job_id}>
                        <div>
                            <h3>{this.props.title}</h3>
                            <h5>{this.props.company_name}{this.props.rating}</h5>
                        </div>
                    </Modal.Title>
                    </Modal.Header>
                    <div className="jobtag">{job_tags}</div>
                    <Modal.Body>{this.props.description.split("\n").map((item, key) => {
                                return <span key={key}>{item}<br/></span>})}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="link" onClick={this.redirectApplication}>
                        Apply
                    </Button>
                    <span>{save_button}</span>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}


function JobCard(props) {

    const Card = ReactBootstrap.Card;
    const Badge = ReactBootstrap.Badge;

    return (
        <Card key={props.job_id} width="80%" height="60%">
            <Card.Header>{props.title}</Card.Header>
            <Card.Body>{props.company_name}
                <Badge pill variant="info">{props.rating}</Badge>
                <JobModal job_id={props.job_id}
                        title={props.title}
                        company_name={props.company_name} 
                        rating={props.rating}
                        description={props.description} 
                        apply_url={props.apply_url}/>
            </Card.Body>
        </Card>
    )
}


class JobSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
            mapview: false,
            results: [],
            // log_in_user: false,
        };

        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.fetchSearchingResult = this.fetchSearchingResult.bind(this);
        this.displayResults = this.displayResults.bind(this);
    }


    handleKeywordChange = (evt) => {
        this.setState({ keyword: evt.target.value });
    };

    handleViewChange = (evt) => {
        this.setState({ mapview: evt.target.checked });
    };

    fetchSearchingResult = (evt) => {
        evt.preventDefault();

        fetch(`/searching?keyword=${this.state.keyword}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    // where should I call this function?
    displayResults = () => {
        if (!this.state.mapview) {
            return <div className="jobcards">{job_cards}</div>
        }
        // else {
        //     
        // }
    }

    render() {
        const job_cards = [];

        for (const job of this.state.results) {
            job_cards.push(
                <div key={job.job_id}>
                    <JobCard job_id={job.job_id}
                            title={job.title}
                            company_name={job.company_name} 
                            rating={job.rating}
                            description={job.description} 
                            apply_url={job.apply_url} />
                </div>
            );
        }
        return (
            <div className="job-search">
                <form>
                    <input
                        type="text"
                        id="keyword-field"
                        name="keyword"
                        className="form-control mr-sm-2"
                        value={this.state.keyword}
                        onChange={this.handleKeywordChange}
                        placeholder="Search by keywords"
                        />
                    <button
                        className="btn btn-outline-success my-2 my-sm-0"
                        type="submit"
                        onClick={this.fetchSearchingResult}>Search</button>
                </form>
                <label>
                <input
                    type="checkbox"
                    checked={this.state.mapview}
                    onChange={this.handleViewChange}
                    id="map-view"
                    />
                    Map View
                </label>
                <div className="jobcards" id="job-cards">{job_cards}</div>
            </div>
        );
    }
}


ReactDOM.render(
    <JobSearch />,
    document.getElementById("search")
);


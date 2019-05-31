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

    handleClose() {
        this.setState({ show: false });
    }
  
    handleShow() {
        this.setState({ show: true });
    }

    handleSave(evt) {
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

    fetchTags(evt) {
        evt.preventDefault();

        fetch(`/tags?key=${this.props.job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ tags: data });
            })
    }

    redirectApplication() {
        window.open(`${this.props.apply_url}`);
    }
  
    render() {
        const Modal = ReactBootstrap.Modal;
        const Button = ReactBootstrap.Button;
        const Badge = ReactBootstrap.Badge;

        const job_tags = [];
        for (const tag of this.state.tags) {
            job_tags.push(<Badge variant="secondary">{tag}</Badge>);
        }

        const save_button = [];
        if (!this.state.saved) {
            save_button.push(
                            <Button variant="primary" onClick={this.handleSave} key={this.props.job_id}>
                                Save
                            </Button>);
        } else {
            save_button.push(
                            <Button variant="primary" disabled key={this.props.job_id}>
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
                       className="job-detail-modal"
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
                        Apply on Company Site
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
        <div key={props.job_id} width="80%" height="60%" className="row">
            <Card border="light" className="col-10">
                <Card.Body>
                    <Card.Text>
                        <span>
                            <span>{props.title}</span>
                            <span className="right_header">
                                {props.company_name}
                                <Badge pill variant="info">{props.rating}</Badge>
                            </span>
                        </span>
                    </Card.Text>
                </Card.Body>
            </Card>
            <span className="col-2">
                <JobModal job_id={props.job_id}
                            title={props.title}
                            company_name={props.company_name} 
                            rating={props.rating}
                            description={props.description} 
                            apply_url={props.apply_url}/>
            </span>
        </div>
    )
}


class JobSearch extends React.Component {
    constructor(props) {
        super(props);
        this.mapRef = React.createRef();

        this.state = {
            keyword: "",
            mapview: false,
            results: [],
        };

        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.fetchSearchingResult = this.fetchSearchingResult.bind(this);
        this.quickSearching = this.quickSearching.bind(this);
        this.showMap = this.showMap.bind(this);
    }

    reFresh() {
        fetch("/searching?keyword=")
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    componentDidMount() {
        this.reFresh();
    }

    showMap() {
        //tell react component to create google map
        const mapElement = this.mapRef.current;
        initMap(this.state.results, mapElement);
    }

    handleKeywordChange(evt) {
        this.setState({ keyword: evt.target.value });
    };

    handleViewChange(evt) {
        this.setState({ mapview: evt.target.checked });
    };

    fetchSearchingResult(evt) {
        evt.preventDefault();

        fetch(`/searching?keyword=${this.state.keyword}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    quickSearching(evt) {
        evt.preventDefault();

        fetch(`/searching?keyword=${evt.target.value}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    componentDidUpdate() {
        if (this.state.mapview) {
            this.showMap();
        }
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

        const results_count = this.state.results.length;

        let results_display = null;
        if (!this.state.mapview) {
            results_display = <div className="jobcards" id="job-cards">{job_cards}</div>;
        } else {
            results_display = <div className="google-map" id="google-map" ref={this.mapRef}></div>;
        }

        return (
            <div className="job-search">
                <form>
                    <div className="form-row align-items-center">
                        <div className="col-auto">
                            <input type="text"
                                   id="keyword-field"
                                   name="keyword"
                                   className="form-control mb-2"
                                   value={this.state.keyword}
                                   onChange={this.handleKeywordChange}
                                   placeholder="Search by keywords"
                                   />
                        </div>
                        <div className="form-check mb-2">
                            <input type="checkbox"
                                   checked={this.state.mapview}
                                   onChange={this.handleViewChange}
                                   id="map-view"
                                  className="form-check-input" />
                            <label className="form-check-label" >
                                Mapview
                            </label>
                        </div>
                        <div className="col-auto">
                            <button type="submit"
                                    className="btn btn-primary mb-2"
                                    onClick={this.fetchSearchingResult}
                                    key="search-button">
                                Search
                            </button>
                        </div>
                    </div>
                </form>
                <div>
                    <span>Language: </span>
                    <button type="button" className="btn btn-link" value="python" onClick={(evt) => {this.quickSearching(evt)}}>Python</button>
                    <button type="button" className="btn btn-link" value="javascript" onClick={(evt) => {this.quickSearching(evt)}}>JavaScript</button>
                    <button type="button" className="btn btn-link" value="java" onClick={(evt) => {this.quickSearching(evt)}}>Java</button>
                    <button type="button" className="btn btn-link" value="html" onClick={(evt) => {this.quickSearching(evt)}}>HTML</button>
                    <button type="button" className="btn btn-link" value="css" onClick={(evt) => {this.quickSearching(evt)}}>CSS</button>
                    <button type="button" className="btn btn-link" value="c#" onClick={(evt) => {this.quickSearching(evt)}}>C#</button>
                    <button type="button" className="btn btn-link" value="php" onClick={(evt) => {this.quickSearching(evt)}}>PHP</button>
                    <button type="button" className="btn btn-link" value="c++" onClick={(evt) => {this.quickSearching(evt)}}>C++</button>
                    <button type="button" className="btn btn-link" value="ruby" onClick={(evt) => {this.quickSearching(evt)}}>Ruby</button>
                    <button type="button" className="btn btn-link" value="go" onClick={(evt) => {this.quickSearching(evt)}}>GO</button>
                </div>
                <div>
                    <span>Framework: </span>
                    <button type="button" className="btn btn-link" value="angular" onClick={(evt) => {this.quickSearching(evt)}}>Angular</button>
                    <button type="button" className="btn btn-link" value="react" onClick={(evt) => {this.quickSearching(evt)}}>React</button>
                    <button type="button" className="btn btn-link" value="spring" onClick={(evt) => {this.quickSearching(evt)}}>Spring</button>
                    <button type="button" className="btn btn-link" value="django" onClick={(evt) => {this.quickSearching(evt)}}>Django</button>
                    <button type="button" className="btn btn-link" value="flask" onClick={(evt) => {this.quickSearching(evt)}}>Flask</button>
                    <button type="button" className="btn btn-link" value="tensorflow" onClick={(evt) => {this.quickSearching(evt)}}>TensorFlow</button>
                    <button type="button" className="btn btn-link" value="vue" onClick={(evt) => {this.quickSearching(evt)}}>Vue</button>
                    <button type="button" className="btn btn-link" value=".net" onClick={(evt) => {this.quickSearching(evt)}}>.NET</button>
                </div>
                <div>
                    <span>Database: </span>
                    <button type="button" className="btn btn-link" value="mysql" onClick={(evt) => {this.quickSearching(evt)}}>MySQL</button>
                    <button type="button" className="btn btn-link" value="sql" onClick={(evt) => {this.quickSearching(evt)}}>SQL</button>
                    <button type="button" className="btn btn-link" value="postgresql" onClick={(evt) => {this.quickSearching(evt)}}>PostgreSQL</button>
                    <button type="button" className="btn btn-link" value="oracle" onClick={(evt) => {this.quickSearching(evt)}}>Oracle</button>
                    <button type="button" className="btn btn-link" value="mongodb" onClick={(evt) => {this.quickSearching(evt)}}>MongoDB</button>
                    <button type="button" className="btn btn-link" value="redis" onClick={(evt) => {this.quickSearching(evt)}}>Redis</button>
                    <button type="button" className="btn btn-link" value="rds" onClick={(evt) => {this.quickSearching(evt)}}>RDS</button>
                </div>
                <div>
                    <span>Other: </span>
                    <button type="button" className="btn btn-link" value="ios" onClick={(evt) => {this.quickSearching(evt)}}>iOS</button>
                    <button type="button" className="btn btn-link" value="android" onClick={(evt) => {this.quickSearching(evt)}}>Android</button>
                    <button type="button" className="btn btn-link" value="azure" onClick={(evt) => {this.quickSearching(evt)}}>Azure</button>
                    <button type="button" className="btn btn-link" value="linux" onClick={(evt) => {this.quickSearching(evt)}}>Linux</button>
                    <button type="button" className="btn btn-link" value="aws" onClick={(evt) => {this.quickSearching(evt)}}>AWS</button>
                    <button type="button" className="btn btn-link" value="machine learning" onClick={(evt) => {this.quickSearching(evt)}}>Machine Learning</button>
                    <button type="button" className="btn btn-link" value="restful" onClick={(evt) => {this.quickSearching(evt)}}>RESTful</button>
                </div><br />
                <p>Results({results_count})</p>
                <div>{results_display}</div>
            </div>
        );
    }
}

window.addEventListener("load", () => {
    ReactDOM.render(
        <JobSearch />,
        document.getElementById("search")
    );
})


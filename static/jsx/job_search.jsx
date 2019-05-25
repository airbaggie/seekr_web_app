"use strict";


class JobDetail extends React.Component {
    constructor(props, context) {
        super(props, context);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.fetchTags = this.fetchTags.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    
        this.state = {
            show: false,
            tags: [],
            // add user log in(?) boolean
        };
    }
  
    handleClose(evt) {
        this.setState({ show: false });
    }
  
    handleShow(evt) {
        this.setState({ show: true });
    }

    handleSave(evt) {
        // post userid, job_id to UserJob tables
        // props.user_id (called id in database)
    }

    fetchTags (evt) {
        evt.preventDefault();

        fetch(`/tags?key=${this.props.job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ tags: data });
            });
    }

    redirectApplication() {
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
                    <Modal.Body>{this.props.description.split('\n').map((item, key) => {
                                return <span key={key}>{item}<br/></span>})}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="link" onClick={this.redirectApplication}>
                        Apply
                    </Button>
                    <Button variant="primary" onClick={this.handleSave}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}


function JobBriefInfo(props) {
    const style={margin: '10px',
                 width: '550px',
                 borderRadius: '20px',
                 backgroundColor: '#DFE8D1',
                };

    return (
        <div key={props.job_id}>
            <p>{props.title}</p>
            <p>{props.company_name} {props.rating}</p>
        </div>
    )
};


function JobCard(props) {

    return (
        <div key={props.job_id}>
            <JobBriefInfo job_id={props.job_id} 
                    title={props.title} 
                    company_name={props.company_name} 
                    rating={props.rating}/>
            <JobDetail job_id={props.job_id}
                    title={props.title}
                    company_name={props.company_name} 
                    rating={props.rating}
                    description={props.description} 
                    apply_url={props.apply_url}/>
        </div>
    )
}


class JobSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
            mapview: false,
            results: [],
            log_in_user: false,
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

    fetchSearchingResult (evt) {
        evt.preventDefault();

        fetch(`/search?keyword=${this.state.keyword}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    // where should I call this function?
    displayResults() {
        if (!this.state.mapview) {
            return <div className="jobcards">{job_cards}</div>
        }
        else {
            return <p>Map View is comming soon!</p>
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
                            apply_url={job.apply_url}
                            tags={["python", "react"]} />
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
                    />
                    Map View
                </label>
                <div className="jobcards">{job_cards}</div>
            </div>
        );
    }
};

ReactDOM.render(
    <JobSearch results />,
    document.getElementById("root")
);


// document.addEventListener('load', () => {
    

//     const Alert = ReactBootsta
// });















   // MapView() {
    //     return (
    //         let mapOptions = {
    //                           zoom: 11,
    //                           center: new google.maps.LatLng(37.6844462, -122.343031)
    //                          };
    //         let map = new google.maps.Map(document.getElementById("map-canvas", mapOptions);
    //         let marker, i;
        
    //         for (let id in results) {
    //             marker = new google.maps.Marker({
    //                     position: new google.maps.LatLng(results[id]["lat"], results[id]["lng"]),
    //                     map: map,
    //                     })
    //             google.maps.event.addListener(marker, 'click', showInfo(marker, results[id]))
    //         }
    //     )
    // }

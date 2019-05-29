"use strict";

// const GoogleApiWrapper = googlemapsreact.GoogleApiWrapper;
// const Map = googlemapsreact.Map;
// const InfoWindow = googlemapsreact.InfoWindow;
// const Marker = googlemapsreact.Marker;

// const mapStyles = {
//     width: '100%',
//     height: '100%'
// };

// class MapContainer extends Component {
//     render() {
//         return (
//             <Map
//             google={this.props.google}
//             zoom={14}
//             style={style}
//             initialCenter={{ lat: -1.2884, lng: 36.8233 }}
//             />
//         );
//     }
// }




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
        <div key={props.job_id} width="80%" height="60%">
            <Card border="light">
                <Card.Body>
                    <Card.Text>
                        <span>
                            <h6>{props.title}</h6>
                            <span className="right_header">
                                {props.company_name}
                                <Badge pill variant="info">{props.rating}</Badge>
                            </span>
                        </span>
                    </Card.Text>
                    <JobModal job_id={props.job_id}
                        title={props.title}
                        company_name={props.company_name} 
                        rating={props.rating}
                        description={props.description} 
                        apply_url={props.apply_url}/>
                </Card.Body>
            </Card>
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
            // is_active: false,
        };

        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.fetchSearchingResult = this.fetchSearchingResult.bind(this);
        this.displayResults = this.displayResults.bind(this);
        // this.quickSearching = this.quickSearching.bind(this);
    }

    // componentDidMount = () => {
    //     fetch("/userstatus")
    //         .then(data => { 
    //             this.setState({ is_active: data });
    //         });
    // }

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

    // quickSearching = (evt, keyword) =>{
    //     evt.preventDefault();

    //     fetch(`/searching?keyword=${keyword}`)
    //         .then(res => res.json())
    //         .then(data => { 
    //             this.setState({ results: data });
    //         })
    //     }

    render() {
        const search_by_language = [];
        const search_by_framework = [];
        const search_by_database = [];
        const search_by_other = [];
        const language_list = ["Python", "JavaScript", "Java", "HTML", "CSS", "C#", "PHP", "C++", "Ruby", "GO"];
        const framework_list = ["Angular", "React", "Spring", "Django", "Flask", "TensorFlow", ".NET"];
        const database_list = ["MySQL", "SQL", "PostgreSQL", "Oracle", "MongoDB", "Redis", "RDS"];
        const other_list = ["iOS", "Android", "AWS", "Machine Learning", "RESTful"];

        for (const keyword of language_list) {
            search_by_language.push(
                <button type="button" className="btn btn-link" onClick={(evt) =>{
                    evt.preventDefault();
            
                    fetch(`/searching?keyword=${keyword}`)
                        .then(res => res.json())
                        .then(data => { 
                            this.setState({ results: data });
                        })
                    }}>{keyword}</button>
            )
        }
        for (const keyword of framework_list) {
            search_by_framework.push(
                <button type="button" className="btn btn-link" onClick={(evt) =>{
                    evt.preventDefault();
            
                    fetch(`/searching?keyword=${keyword}`)
                        .then(res => res.json())
                        .then(data => { 
                            this.setState({ results: data });
                        })
                    }}>{keyword}</button>
            )
        }
        for (const keyword of database_list) {
            search_by_database.push(
                <button type="button" className="btn btn-link" onClick={(evt) =>{
                    evt.preventDefault();
            
                    fetch(`/searching?keyword=${keyword}`)
                        .then(res => res.json())
                        .then(data => { 
                            this.setState({ results: data });
                        })
                    }}>{keyword}</button>
            )
        }
        for (const keyword of other_list) {
            search_by_other.push(
                <button type="button" className="btn btn-link" onClick={(evt) =>{
                    evt.preventDefault();
            
                    fetch(`/searching?keyword=${keyword}`)
                        .then(res => res.json())
                        .then(data => { 
                            this.setState({ results: data });
                        })
                    }}>{keyword}</button>
            )
        }

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

        const results_count = this.state.results.length

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
                <div>Language: {search_by_language}</div>
                <div>Framework: {search_by_framework}</div>
                <div>Database: {search_by_database}</div>
                <div>Other: {search_by_other}</div><br />
                <p>Results({results_count})</p>
                <div className="jobcards" id="job-cards">{job_cards}</div>
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
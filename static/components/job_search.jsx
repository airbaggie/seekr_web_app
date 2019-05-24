"use strict";


class JobModal extends React.Component {
    constructor(props, context) {
        super(props, context);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleTags = this.handleTags.bind(this);
        this.handleApply = this.handleApply.bind(this);
    
        this.state = {
            show: false,
            // add user log in(?) boolean
        };
    }
  
    handleClose() {
        this.setState({ show: false });
    }
  
    handleShow() {
        this.setState({ show: true });
    }

    handleSave() {
        // post userid, job_id to UserJob tables
        // props.user_id (called id in database)
    }

    handleApply() {
        window.open(`${props.rating}`);
    }

    handleTags() {
        job_tags = []

        for (const tag of props.tags) {
            // props.tag should be list of tag strings
            job_tags.push(<span>{tag}</span>);
        }
        return <div className="jobtag">{job_tags}</div>;
    }
  
    render() {
        return (
            <div key={props.job_id}>
                <Button variant="primary" onClick={this.handleShow}>
                    View Details
                </Button>
        
                <Modal show={this.state.show} onHide={this.handleClose}>
                    <Modal.Header closeButton>
                    <Modal.Title>{props.job_title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{props.company_name}{props.rating}{props.description}</Modal.Body>
                    { this.handleTags() }
                    <Modal.Footer>
                    <Button variant="primary" onClick={this.handleSave}>
                        Save
                    </Button>
                    <Button variant="secondary" onClick={this.handleApply}>
                        Apply
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


function JobCard(props) {

    return (
        <div key={props.job_id}>
            <p>{props.title}</p>
            <p>{props.company_name} {props.rating}</p>
        </div>
    )
};


class JobSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            keyword: "",
            mapview: false,
            results: [],
            log_in_user: false,
        };

        this.handleKeyword = this.handleKeyword.bind(this);
        this.handleMapview = this.handleMapview.bind(this);
        this.displayResults = this.displayResults.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleSearchResult = this.handleSearchResult.bind(this);
        this.displayInList = this.displayInList.bind(this);
    }


    handleKeywordChange = (evt) => {
        this.setState({ keyword: evt.target.value });
        };


    handleSearchResult (evt) {
        evt.preventDefault();

        fetch(`/search?keyword=${this.state.keyword}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    displayInList() {
        job_cards = [];

        for (const job of this.state.results) {
            job_cards.push(
                <div key={job.job_id}>
                    <JobCard job_id={job.job_id} 
                            title={job.title} 
                            company_name={job.company_name} 
                            rating={job.rating} />
                    <JobModal job_id={job.job_id}
                            title={job.title}
                            company_name={job.company_name} 
                            rating={job.rating}
                            description={job.description} 
                            apply_url={job.apply_url}
                            tags={["python", "react"]} />
                </div>
            );
        }
        return <div className="jobcards">{job_cards}</div>;
    }


    displayResults() {
        if (!this.state.mapview) {
            {this.displayInList}
        }
        else {
            return <p>Map View is comming soon!</p>
        }
    }
    

    handleKeyword() {
        return (
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
                onClick={this.handleSearchResult}>Search</button>
            </form>
        )
    }
    

    // handles the change of this.state.mapview
    handleViewChange = (evt) => {
        this.setState({ mapview: evt.target.checked });
        };


    handleMapview() {
        return (
            <label>
                <input
                    type="checkbox"
                    checked={this.state.mapview}
                    onChange={this.handleViewChange}
                    />
                Map View
            </label>
        )
    };


    render() {
        return (
        <div className="job-search">
            { this.handleKeyword() }
            { this.handleMapview() }
            { this.displayResults() }
        </div>
        )
    }
};

ReactDOM.render(
    <JobSearch results />,
    document.getElementById("root")
);














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

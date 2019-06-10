"use strict";


class JobCard extends React.Component {
    constructor(props) {
        super(props);

        this.state = { tags: [] }
    }

    componentDidMount() {
        fetch(`/api/tags?key=${this.props.job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ tags: data });
            });
    }

    render() {
        const job_tags = [];
        for (const tag of this.state.tags) {
            job_tags.push(<span className="badge badge-pill badge-light">{tag}</span>);
        }

        return (
            <div className="card">
                <div className="card-body">
                    <p className="card-title d-inline-block" onClick={() => {
                                                                            this.props.fetchDetailInfo(`${this.props.job_id}`);
                                                                            }}>{this.props.title}</p>
                    <br />
                    <span className="card-text">{this.props.company_name}</span>
                    <span className="badge badge-pill badge-info">{this.props.rating}</span>
                    <p className="card-text"><small className="text-muted">{job_tags}</small></p>
                </div>
            </div>
        );
    }
}

class MapViewJobCard extends React.Component {
    constructor(props) {
        super(props);
    
        this.state = { tags: [] }
    }

    componentDidMount() {
        fetch(`/api/tags?key=${this.props.job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ tags: data });
            });
    }

    render() {
        const job_tags = [];
        for (const tag of this.state.tags) {
            job_tags.push(<span className="badge badge-pill badge-light">{tag}</span>);
        }

        return(
            <div className="card" style={{width: 30+"rem"}}>
                <div className="card-body">
                    <p className="card-title" onClick={() => {
                                                                this.props.fetchDetailInfo(`${this.props.job_id}`);
                                                                }}>{this.props.title}</p>
                    <span className="card-text">{this.props.company_name}</span>
                    <span className="badge badge-pill badge-info">{this.props.rating}</span>
                    <p className="card-text"><small class="text-muted">{job_tags}</small></p>
                </div>
            </div>
        )
    }
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

        this.renderJobCard = this.renderJobCard.bind(this);
        this.quickSearching = this.quickSearching.bind(this);
        this.generateQuickSearchLinks = this.generateQuickSearchLinks.bind(this);

        this.showMap = this.showMap.bind(this);
        this.generateJobCard = this.generateJobCard.bind(this);
        this.displayResults = this.displayResults.bind(this);
        this.countResults = this.countResults.bind(this);

    }

    reFresh() {
        fetch("/api/search?key=")
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    // componentDidMount() {
    //     this.reFresh();
    // }

    handleKeywordChange(evt) {
        this.setState({ keyword: evt.target.value });
    };

    handleViewChange(evt) {
        this.setState({ mapview: evt.target.checked });
    };

    fetchSearchingResult(evt) {
        evt.preventDefault();

        fetch(`/api/search?key=${this.state.keyword}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    renderJobCard(job){
        return () => {
            ReactDOM.render(
                <MapViewJobCard job_id={job["job_id"]}
                                title={job["title"]}
                                company_name={job["company_name"]}
                                rating={job["rating"]}
                                fetchDetailInfo={this.props.fetchDetailInfo} />,
                document.getElementById("job-div")
            )
        };
    }

    quickSearching(evt) {
        evt.preventDefault();

        fetch(`/api/search?key=${evt.target.value}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    generateQuickSearchLinks() {
        const search_by_language = [];
        const search_by_framework = [];
        const search_by_database = [];
        const language_list = ["Python", "JavaScript", "Java", "HTML", "CSS", "C#", "PHP", "C++", "Ruby", "GO"];
        const framework_list = ["Angular", "React", "Spring", "Django", "Flask", "TensorFlow", ".NET"];
        const database_list = ["MySQL", "SQL", "PostgreSQL", "Oracle", "MongoDB", "Redis", "RDS"];

        for (const item of language_list) {
            search_by_language.push(<button type="button" className="btn btn-link" value={item} onClick={(evt) => {this.quickSearching(evt)}}>{item}</button>)
        }
        for (const item of framework_list) {
            search_by_framework.push(<button type="button" className="btn btn-link" value={item} onClick={(evt) => {this.quickSearching(evt)}}>{item}</button>)
        }
        for (const item of database_list) {
            search_by_database.push(<button type="button" className="btn btn-link" value={item} onClick={(evt) => {this.quickSearching(evt)}}>{item}</button>)
        }

        return (
            <div>
                <span>Language: </span>
                {search_by_language}<br />
                <span>Framework: </span>
                {search_by_framework}<br />
                <span>Database: </span>
                {search_by_database}<br />
            </div>
        )
    }

    showMap() {
        const mapElement = this.mapRef.current;
        initMap(this.state.results, mapElement, this.renderJobCard);
    }

    componentDidUpdate() {
        if (this.state.mapview) {
            this.showMap();
        }
    }

    countResults() {
        const results_count = this.state.results.length;
        return results_count;
    }

    generateJobCard() {
        const job_cards = [];
        for (const job of this.state.results) {
            job_cards.push(
                            <JobCard key={job.job_id}
                                        job_id={job.job_id}
                                        title={job.title}
                                        company_name={job.company_name} 
                                        rating={job.rating}
                                        fetchDetailInfo={this.props.fetchDetailInfo} />
                            );
        }
        return job_cards;
    }

    displayResults() {
        if ((!this.state.mapview) & (!this.state.detail)) {
            return <div className="jobcards card-columns" id="job-cards">{this.generateJobCard()}</div>;
        } else if ((this.state.mapview) & (!this.state.detail)) {
            return [<div className="google-map" id="google-map" ref={this.mapRef}></div>, <span className="job-div" id="job-div"></span>];
        }
    }

    render() {
        return (
            <div className="job-search">
                <div className="jumbotron">
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
                                        className="btn btn-secondary mb-2"
                                        onClick={this.fetchSearchingResult}
                                        key="search-button">
                                    Search
                                </button>
                            </div>
                        </div>
                    </form>
                    <div className="quick-search">
                        {this.generateQuickSearchLinks()}
                    </div>
                </div>
                <p>Results({this.countResults()})</p>
                <div>{this.displayResults()}</div>
            </div>
        );
    }
}


class JobSearchApp extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: false,
            detail_info: [],
        };

        this.handleListView = this.handleListView.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.fetchDetailInfo = this.fetchDetailInfo.bind(this);
    }

    fetchDetailInfo(job_id) {
        fetch(`/api/jobdetail?key=${job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ detail_info: data });
                this.setState({ detail: true });
            })
    }

    handleListView() {
        this.setState({ detail: false });
    };

    handlePage() {
        if (!this.state.detail) {
            return <JobSearch fetchDetailInfo={this.fetchDetailInfo} />
        } else {
            return <ViewJob detail_info={this.state.detail_info} 
                            handleListView={this.handleListView} />;
        }
    }

    render() {
        return (
            <div>
                {this.handlePage()}
            </div>
        );
    }
}

window.addEventListener("load", () => {
    ReactDOM.render(
        <JobSearchApp />,
        document.getElementById("app")
    );
})


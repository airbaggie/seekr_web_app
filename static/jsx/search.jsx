"use strict";


class JobDetail extends React.Component {
    constructor(props) {
        super(props);
    
        this.handleSave = this.handleSave.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    
        this.state = {
            // is_active: false,
            saved: false,
        };
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

    redirectApplication() {
        window.open(`${this.props.apply_url}`);
    }
  
    render() {

        const save_button = [];
        if (!this.state.saved) {
            save_button.push(
                            <button type="button" className="btn btn-primary" onClick={this.handleSave} key={this.props.job_id}>
                                Save
                            </button>);
        } else {
            save_button.push(
                            <button type="button" className="btn btn-primary" disabled key={this.props.job_id}>
                                Saved
                            </button>);
        }

        return (
            <div key={this.props.job_id}>
                <div>
                    <div key={this.props.job_id}>
                        <div>
                            <h3>{this.props.title}</h3>
                            <h5>{this.props.company_name}{this.props.rating}</h5>
                        </div>
                    </div>
                    <div>{this.props.description.split("\n").map((item, key) => {
                                return <span key={key}>{item}<br/></span>})}
                    </div>
                    <div>
                    <button type="button" className="btn btn-link" onClick={this.redirectApplication}>
                        Apply on Company Site
                    </button>
                    <span>{save_button}</span>
                    </div>
                </div>
            </div>
        );
    }
}


class JobCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showdetail: false,
                       tags: [] }

        this.handleDetialView = this.handleDetialView.bind(this);
        this.showDetail = this.showDetail.bind(this);
    }

    componentDidMount() {
        fetch(`/tags?key=${this.props.job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ tags: data });
            });
    }

    handleDetialView() {
        this.setState({ showdetail: true });
    }

    showDetail() {
        if (this.state.showdetail) {
            return (<JobDetail job_id={this.props.job_id}
                              title={this.props.title}
                              company_name={this.props.company_name} 
                              rating={this.props.rating}
                              description={this.props.description} 
                              apply_url={this.props.apply_url}/>
        )}
    }

    render() {
        const job_tags = [];
        for (const tag of this.state.tags) {
            job_tags.push(<span className="badge badge-pill badge-light">{tag}</span>);
        }

        return (
            <div key={this.props.job_id} width="80%" height="60%" className="row">
                <a href="#" className="list-group-item list-group-item-action" onClick={() => {this.handleDetialView()}}>
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{this.props.title}</h5>
                        <small className="text-muted">{job_tags}</small>
                    </div>
                    <p className="mb-1">{this.props.company_name} {this.props.rating}</p>
                </a>
                <div>{this.showDetail()}</div>
            </div>
        );
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

    renderJobCard(job){
        return () => {
            ReactDOM.render(
                <JobCard job_id={job["job_id"]} title={job["title"]} company_name={job["company_name"]} rating={job["rating"]} description={job["description"]} apply_url={job["apply_url"]} />,
                document.getElementById("job-div")
            )
        };
    }

    quickSearching(evt) {
        evt.preventDefault();

        fetch(`/searching?keyword=${evt.target.value}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    generateQuickSearchLinks() {
        const search_by_language = [];
        const search_by_framework = [];
        const search_by_database = [];
        const search_by_other = [];
        const language_list = ["Python", "JavaScript", "Java", "HTML", "CSS", "C#", "PHP", "C++", "Ruby", "GO"];
        const framework_list = ["Angular", "React", "Spring", "Django", "Flask", "TensorFlow", ".NET"];
        const database_list = ["MySQL", "SQL", "PostgreSQL", "Oracle", "MongoDB", "Redis", "RDS"];
        const other_list = ["iOS", "Android", "AWS", "Machine Learning", "RESTful"];

        for (const item of language_list) {
            search_by_language.push(<button type="button" className="btn btn-link" value={item} onClick={(evt) => {this.quickSearching(evt)}}>{item}</button>)
        }
        for (const item of framework_list) {
            search_by_framework.push(<button type="button" className="btn btn-link" value={item} onClick={(evt) => {this.quickSearching(evt)}}>{item}</button>)
        }
        for (const item of database_list) {
            search_by_database.push(<button type="button" className="btn btn-link" value={item} onClick={(evt) => {this.quickSearching(evt)}}>{item}</button>)
        }
        for (const item of other_list) {
            search_by_other.push(<button type="button" className="btn btn-link" value={item} onClick={(evt) => {this.quickSearching(evt)}}>{item}</button>)
        }

        return (
            <div>
                <span>Language: </span>
                {search_by_language}<br />
                <span>Framework: </span>
                {search_by_framework}<br />
                <span>Database: </span>
                {search_by_database}<br />
                <span>Other: </span>
                {search_by_other}<br />
            </div>
        )
    }

    showMap() {
        //tell react component to create google map
        const mapElement = this.mapRef.current;
        initMap(this.state.results, mapElement, this.renderJobCard);
    }

    componentDidUpdate() {
        if (this.state.mapview) {
            this.showMap();
        }
    }

    generateJobCard() {
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
        return job_cards;
    }

    displayResults() {
        if (!this.state.mapview) {
            return <div className="jobcards" id="job-cards">{this.generateJobCard()}</div>;
        } else {
            return [<div className="google-map" id="google-map" ref={this.mapRef}></div>, <span id="job-div"></span>];
        }
    }

    render() {

        const results_count = this.state.results.length;

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
                {this.generateQuickSearchLinks()}
                <p>Results({results_count})</p>
                <div>{this.displayResults()}</div>
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


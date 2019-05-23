"use strict";

function JobCards(props)  {
    const job_cards = [];

    // add props.user_status

    if (props.is_login) {

    }
    else {
        for (const job of props.results) {
            job_cards.push(
                <div id={job.job_id}>
                    <p>{job.title}</p>
                    <p>{job.company_name}</p>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">View Detail</button>
                </div>
            );
        }
    }
    return <div className="jobcard">{job_cards}</div>;
}


// function GoogleMap(props) {

// }


class JobSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
                      keyword: "",
                      mapview: false,
                      results: [],
                     };

        this.handleKeyword = this.handleKeyword.bind(this);
        this.handleMapview = this.handleMapview.bind(this);
        this.displayResults = this.displayResults.bind(this);
        this.handleKeywordChange = this.handleKeywordChange.bind(this);
        this.handleViewChange = this.handleViewChange.bind(this);
        this.handleSearchResult = this.handleSearchResult.bind(this);
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


    displayResults() {
        if (!this.state.mapview) {
            return <JobCards results={this.state.results} />
        }
        else {
            return <p>Hi!</p>
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
    }


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



    render() {
        return (
        <div className="job-search">
            { this.handleKeyword() }
            { this.handleMapview() }
            { this.displayResults() }
        </div>
        )
    }
}

ReactDOM.render(
    <JobSearch results />,
    document.getElementById('root')
);

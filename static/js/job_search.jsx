"use strict";

class JobSearch extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
                      mapview: false,
                      keyword: null,
                      results: null,
                     };

        this.handleMapview = this.handleMapview.bind(this);
        this.handleResults = this.handleResults.bind(this);
        this.handleKeyword = this.handleKeyword.bind(this);
    }
    
    // handles the change of this.state.mapview
    handleMapview() {
        this.state.mapview

        this.state.guessed.add(letter);
        this.setState({guessed: this.state.guessed});

        if (this.props.answer.indexOf(letter) === -1)
            this.setState({'numWrong': this.state.numWrong + 1});
    } 
    }

    // handles the change of this.state.results
    handleResults() {
        this.state.results
    }

    // handles the change of this.state.keyword
    handleKeyword() {
        return (
        <input class="form-control mr-sm-2" type="text" name="keyword" id="keyword-field" placeholder="title, company, skill etc.">
        <span class="input-group-btn">
            <button class="btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
        </span>
        )
    }

    mapviewCheckbox() {
        return (
        <div class="checkbox">
            <label>
                <input id="map-view" type="checkbox" value="false">Map View<br>
            </label>
        </div>
        )
    }

    renderJobCards() {
        for (let id in this.state.results)

        return (
            <div className="jobcard">
                <span id={this}>
                    <p>{this.props.title}</p>
                    <p>{this.props.company_name}</p>
                </span>
                <span>
                    <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">View Detail</button>
                </span>
            </div>
        )
    }


    render() {
        return (
        <div className="job-search">
            { this.searchButton() }
        )
    
    }
}

ReactDOM.render(
    <JobSearch/>,
    document.getElementById("root")
);

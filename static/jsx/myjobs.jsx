"use strict";


// class DropdownButton extends React.Component {
//     constructor(props) {
//         super(props);
//     }

//     render() {
//         const Dropdown = ReactBootstrap.Dropdown;

//         return (
//             <Dropdown className="dropdown">
//                 <Dropdown.Toggle variant="success" id="dropdown-basic">
//                     Change status
//                 </Dropdown.Toggle>
//                 <Dropdown.Menu className="dropdown-menu" aria-labelledby="dropdownMenuButton">
//                     <Dropdown.Item className="dropdown-item" onClick={() => this.props.changeStatus(`${this.props.user_job_id}`, "Applied")}>Applied</Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" onClick={() => this.props.changeStatus(`${this.props.user_job_id}`, "Online assessment")}>Online assessment</Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" onClick={() => this.props.changeStatus(`${this.props.user_job_id}`, "Phone screen")}>Phone screen</Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" onClick={() => this.props.changeStatus(`${this.props.user_job_id}`, "On-site")}>On-site</Dropdown.Item>
//                     <Dropdown.Item className="dropdown-item" onClick={() => this.props.changeStatus(`${this.props.user_job_id}`, "Decision made")}>Decision made</Dropdown.Item>
//                 </Dropdown.Menu>
//             </Dropdown>   
//         );
//     }
// }


class SavedJob extends React.Component {
    constructor(props) {
        super(props);

        // this.handleApply = this.handleApply.bind(this);
        this.handleApplyButton = this.handleApplyButton.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    
        this.state = {
            applied: false,
        };
    }

    // this.props.changeStatus(`${this.props.user_job_id}`, "Applied")}

    redirectApplication() {
        window.open(`${this.props.apply_url}`);
    }

    handleApplyButton() {
        const apply_button = [];
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
    }
    
    render() {
        const buttons = []
        if (this.props.status === "Saved") {
            buttons.push(
                        <span>
                            <button type="button" className="btn btn-link" onClick={this.redirectApplication}>
                                Apply on Company Site
                            </button>
                            <button type="button" className="btn btn-primary" onClick={this.props.removeJob}>
                                Remove
                            </button>
                            {this.applyButton}
                            <DropdownButton user_job_id={this.props.user_job_id}
                                            status={this.props.status} 
                                            changeStatus={this.props.changeStatus}/>
                        </span>);
        } else {
            buttons.push(
                        <span>
                            <span>
                            <button type="button" className="btn btn-primary" onClick={this.props.removeJob}>
                                Remove
                            </button>
                            </span>
                            <span><DropdownButton user_job_id={this.props.user_job_id}
                                                  status={this.props.status} 
                                                  changeStatus={this.props.changeStatus}/>
                            </span>
                        </span>);
        }

        return (
            <div key={this.props.job_id} width="80%" height="60%" className="row">
                <a href="#" className="list-group-item list-group-item-action">
                    <div className="d-flex w-100 justify-content-between">
                        <h5 className="mb-1">{this.props.title}</h5>
                        <span className="right_header">Current status: {this.props.status}</span>
                    </div>
                    <p className="mb-1">{this.props.company_name}</p>
                    <small className="text-muted">{buttons}</small>
                </a>
            </div>
        );
    }
}


class MyJobs extends React.Component {
    constructor(props) {
        super(props);

        this.reFresh = this.reFresh.bind(this);
        this.removeJob = this.removeJob.bind(this);
        this.changeStatus = this.changeStatus.bind(this);

        this.state = {
            results: []
        };
    }

    reFresh() {
        fetch("/userjobs")
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    componentDidMount() {
        this.reFresh();
    }

    removeJob(job_id) {
        const data = new FormData();
        data.append('job_id', JSON.stringify(job_id));

        fetch('api/remove', {
            method: 'DELETE',
            body: data,
            }).then(() => {this.reFresh()})
    }

    changeStatus(user_job_id, new_status) {
        const data = new FormData();
        data.append('user_job_id', user_job_id);
        data.append('new_status', new_status);

        fetch('api/changestatus', {
            method: 'POST',
            body: data,
            }).then(() => {this.reFresh()})
    }

    render() {
        const job_cards = [];

        for (const job of this.state.results) {
            job_cards.push(
                <div key={job[0].job_id}>
                    <SavedJob job_id={job[0].job_id}
                              user_job_id={job[2]}
                              title={job[0].title}
                              company_name={job[0].company_name}
                              apply_url={job[0].apply_url}
                              removeJob={() => this.removeJob(job[0].job_id)}
                              changeStatus={this.changeStatus}
                              status={job[1]} />
                </div>
            );
        }

        const job_count = job_cards.length

        return (
            <div className="saved-job">
                <p>My saved jobs ({job_count})</p>
                <div className="jobcards">{job_cards}</div>
            </div>
        );
    }
};

window.addEventListener("load", () => {
    ReactDOM.render(
        <MyJobs />,
        document.getElementById("myjobs")
    );
})
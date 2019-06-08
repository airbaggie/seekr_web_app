"use strict";


class SavedJob extends React.Component {
    constructor(props) {
        super(props);

        this.showButton = this.showButton.bind(this);
        this.postAppliedNote = this.postAppliedNote.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    }

    redirectApplication() {
        window.open(`${this.props.apply_url}`);
    }

    postAppliedNote(user_job_id) {
        const data = new FormData();
        data.append("user_job_id", user_job_id);
        data.append("note", "Status changed: Applied");

        fetch("/api/notes", { 
            method: "POST",
            body: data,
            }); 
    }

    showButton() {
        const buttons = []
        if (this.props.status === "Saved") {

            buttons.push(
                        <span>
                            <button type="button" className="btn btn-primary" onClick={this.props.removeJob}>
                                Remove
                            </button>
                            <button type="button" className="btn btn-primary" onClick={() => {
                                                                                              this.props.changeStatus(this.props.user_job_id, "Applied");
                                                                                              this.postAppliedNote(this.props.user_job_id)}} >
                                Applied
                            </button>;
                        </span>);
        // } else {
        //     buttons.push(
        //                 <span>
        //                     <span>
        //                     <button type="button" className="btn btn-primary" onClick={this.props.removeJob}>
        //                         Remove
        //                     </button>
        //                     </span>
        //                 </span>);
        }
        return buttons;
    }
    
    render() {
        return (
            <div key={this.props.job_id} width="80%" height="60%" className="row">
                <div className="d-flex w-100 justify-content-between">
                    <button type="button" className="btn btn-link" 
                            onClick={() => {this.props.fetchDetailInfo(`${this.props.user_job_id}`);}}>
                            {this.props.title}
                    </button>
                    <span className="right_header">Current status: {this.props.status}</span>
                </div>
                <p className="mb-1">{this.props.company_name}</p>
                <small className="text-muted">{this.showButton()}</small>
            </div>
        );
    }
}


class JobIndex extends React.Component {
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
        fetch("/api/userjobs")
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
        data.append("key", JSON.stringify(job_id));

        fetch("/api/userjobs", {
            method: 'DELETE',
            body: data,
            }).then(() => {this.reFresh()})
    }

    changeStatus(user_job_id, new_status) {
        const data = new FormData();
        data.append("key1", user_job_id);
        data.append("key2", new_status);

        fetch("/api/userjobdetail", {
            method: 'POST',
            body: data,
            }).then(() => {this.reFresh()})
    }

    generateJobCard() {
        const job_cards = [];
        for (const job of this.state.results) {
            job_cards.push(
                <div key={job.user_job_id}>
                    <SavedJob job_id={job.job_id}
                              user_job_id={job.user_job_id}
                              title={job.title}
                              company_name={job.company_name}
                              removeJob={() => this.removeJob(job.job_id)}
                              changeStatus={this.changeStatus}
                              status={job.status}
                              fetchDetailInfo={this.props.fetchDetailInfo}
                              />
                </div>
            );
        }
        return job_cards;
    }

    countJobCard() {
        return this.state.results.length
    }

    render() {
        return (
            <div className="saved-job">
                <p>My jobs ({this.countJobCard()})</p>
                <div className="jobcards">{this.generateJobCard()}</div>
            </div>
        );
    }
};


class MyJobs extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            detail: false,
            detail_info: [],
            notes: [],
        };

        this.handleIndexView = this.handleIndexView.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.fetchDetailInfo = this.fetchDetailInfo.bind(this);
    }

    fetchDetailInfo(user_job_id) {
        fetch(`/api/userjobdetail?key=${user_job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ detail_info: data });
                this.setState({ detail: true });
            })
        fetch(`/api/notes?key=${user_job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ notes: data });
            })
    }

    handleIndexView() {
        this.setState({ detail: false });
    };

    handlePage() {
        if (!this.state.detail) {
            return <JobIndex fetchDetailInfo={this.fetchDetailInfo} />
        } else {
            return <ViewSavedJob detail_info={this.state.detail_info}
                                 notes={this.state.notes}
                                 handleIndexView={this.handleIndexView} />;
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
        <MyJobs />,
        document.getElementById("myjobs")
    );
})

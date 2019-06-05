"use strict";


class SavedJob extends React.Component {
    constructor(props) {
        super(props);

        // this.applyButton = this.applyButton.bind(this);
        this.showButton = this.showButton.bind(this);
        this.postAppliedLog = this.postAppliedLog.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    
        // this.state = {
        //     applied: false,
        // };
    }

    redirectApplication() {
        window.open(`${this.props.apply_url}`);
    }

    postAppliedLog(user_job_id) {
        const data = new FormData();
        data.append("user_job_id", user_job_id);
        data.append("log", "Status changed: Applied");

        fetch("api/log", {
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
                                                                                              this.postAppliedLog(this.props.user_job_id)}} >
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
                    <button type="button" className="btn btn-link" onClick={() => {
                                                                                    this.props.fetchDetailInfo(`${this.props.job_id}`);
                                                                                    }}>{this.props.title}</button>
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

        console.log("in remove")

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
                              status={job[1]}
                              fetchDetailInfo={this.props.fetchDetailInfo} />
                </div>
            );
        }

        const job_count = job_cards.length

        return (
            <div className="saved-job">
                <p>My jobs ({job_count})</p>
                <div className="jobcards">{job_cards}</div>
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
        };

        this.handleIndexView = this.handleIndexView.bind(this);
        this.handlePage = this.handlePage.bind(this);
        this.fetchDetailInfo = this.fetchDetailInfo.bind(this);
    }

    fetchDetailInfo(job_id) {

        fetch(`/jobdetail?key=${job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ detail_info: data });
                this.setState({ detail: true });
            })
    }

    handleIndexView() {
        this.setState({ detail: false });
    };

    handlePage() {
        if (!this.state.detail) {
            return <JobIndex fetchDetailInfo={this.fetchDetailInfo} />
        } else {
            console.log(`${this.state.detail}, ${this.state.detail_info}`)
            return <ViewSavedJob detail_info={this.state.detail_info} 
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

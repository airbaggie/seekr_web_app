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
                            <button type="button" className="btn btn-primary btn-sm" onClick={this.props.removeJob}>
                                Remove
                            </button>
                            <button type="button" className="btn btn-primary btn-sm" onClick={() => {
                                                                                              this.props.changeStatus(this.props.user_job_id, "Applied");
                                                                                              this.postAppliedNote(this.props.user_job_id)}} >
                                Applied
                            </button>
                        </span>
                        );
        }
        return buttons;
    }
    
    render() {
        return (
                <tr>
                    <td className="td-title">
                        <button type="button" className="btn btn-link" onClick={() => {this.props.fetchDetailInfo(`${this.props.user_job_id}`);}}>
                            {this.props.title}
                        </button>
                    </td>
                    <td className="td-company">{this.props.company_name}</td>
                    <td className="td-status">{this.props.status}</td>
                    <td className="td-action">{this.showButton()}</td>
                </tr>
        );
    }
}


class JobIndex extends React.Component {
    constructor(props) {
        super(props);

        this.reFresh = this.reFresh.bind(this);
        this.removeJob = this.removeJob.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.switchStatus = this.switchStatus.bind(this);

        this.state = {
                        Saved: [],
                        Applied: [],
                        Online_assessment: [],
                        Phone_screen: [],
                        Onsite: [],
                        Offer: [],
                        status: "Saved",
        };
    }

    reFresh() {
        fetch("/api/track?key=Saved")
            .then(res => res.json())
            .then(data => {
                this.setState({ Saved: data });
            });
        fetch("/api/track?key=Applied")
            .then(res => res.json())
            .then(data => {
                this.setState({ Applied: data });
            });
        fetch("/api/track?key=Online assessment")
            .then(res => res.json())
            .then(data => {
                this.setState({ Online_assessment: data });
            });
        fetch("/api/track?key=Phone screen")
            .then(res => res.json())
            .then(data => {
                this.setState({ Phone_screen: data });
            });
        fetch("/api/track?key=On-site")
            .then(res => res.json())
            .then(data => {
                this.setState({ Onsite: data });
            });
        fetch("/api/track?key=Offer")
            .then(res => res.json())
            .then(data => {
                this.setState({ Offer: data });
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

        if (this.state.status === "Saved") {
            for (const job of this.state.Saved) {
                job_cards.push(
                                <SavedJob key={job.user_job_id}
                                          job_id={job.job_id}
                                          user_job_id={job.user_job_id}
                                          title={job.title}
                                          company_name={job.company_name}
                                          removeJob={() => this.removeJob(job.job_id)}
                                          changeStatus={this.changeStatus}
                                          status={job.status}
                                          fetchDetailInfo={this.props.fetchDetailInfo}
                                          />
                )
            }
        } else if (this.state.status === "Applied") {
            for (const job of this.state.Applied) {
                job_cards.push(
                                <SavedJob key={job.user_job_id}
                                          job_id={job.job_id}
                                          user_job_id={job.user_job_id}
                                          title={job.title}
                                          company_name={job.company_name}
                                          removeJob={() => this.removeJob(job.job_id)}
                                          changeStatus={this.changeStatus}
                                          status={job.status}
                                          fetchDetailInfo={this.props.fetchDetailInfo}
                                          />
                )
            }
        } else if (this.state.status === "Online assessment") {
            for (const job of this.state.Online_assessment) {
                job_cards.push(
                                <SavedJob key={job.user_job_id}
                                          job_id={job.job_id}
                                          user_job_id={job.user_job_id}
                                          title={job.title}
                                          company_name={job.company_name}
                                          removeJob={() => this.removeJob(job.job_id)}
                                          changeStatus={this.changeStatus}
                                          status={job.status}
                                          fetchDetailInfo={this.props.fetchDetailInfo}
                                          />
                )
            }
        } else if (this.state.status === "Phone screen") {
            for (const job of this.state.Phone_screen) {
                job_cards.push(
                                <SavedJob key={job.user_job_id}
                                          job_id={job.job_id}
                                          user_job_id={job.user_job_id}
                                          title={job.title}
                                          company_name={job.company_name}
                                          removeJob={() => this.removeJob(job.job_id)}
                                          changeStatus={this.changeStatus}
                                          status={job.status}
                                          fetchDetailInfo={this.props.fetchDetailInfo}
                                          />
                )
            }
        } else if (this.state.status === "On-site") {
            for (const job of this.state.Onsite) {
                job_cards.push(
                                <SavedJob key={job.user_job_id}
                                        job_id={job.job_id}
                                        user_job_id={job.user_job_id}
                                        title={job.title}
                                        company_name={job.company_name}
                                        removeJob={() => this.removeJob(job.job_id)}
                                        changeStatus={this.changeStatus}
                                        status={job.status}
                                        fetchDetailInfo={this.props.fetchDetailInfo}
                                        />
                )
            }
        } else if (this.state.status === "Offer") {
            for (const job of this.state.Offer) {
                job_cards.push(
                                <SavedJob key={job.user_job_id}
                                          job_id={job.job_id}
                                          user_job_id={job.user_job_id}
                                          title={job.title}
                                          company_name={job.company_name}
                                          removeJob={() => this.removeJob(job.job_id)}
                                          changeStatus={this.changeStatus}
                                          status={job.status}
                                          fetchDetailInfo={this.props.fetchDetailInfo}
                                          />
                )
            }
        }
    
        return job_cards;
    }

    switchStatus(evt) {
        this.setState({ status: evt.target.value });
    }

    render() {
        return (
            <div className="myjobs row">
                <div class="col-2">
                    <button type="button" className="btn btn-link" value="Saved" onClick={(evt) => {this.switchStatus(evt)}}>Saved</button><br />
                    <button type="button" className="btn btn-link" value="Applied" onClick={(evt) => {this.switchStatus(evt)}}>Applied</button><br />
                    <button type="button" className="btn btn-link" value="Online assessment" onClick={(evt) => {this.switchStatus(evt)}}>Online assessment</button><br />
                    <button type="button" className="btn btn-link" value="Phone screen" onClick={(evt) => {this.switchStatus(evt)}}>Phone screen</button><br />
                    <button type="button" className="btn btn-link" value="On-site" onClick={(evt) => {this.switchStatus(evt)}}>On-site</button><br />
                    <button type="button" className="btn btn-link" value="Offer" onClick={(evt) => {this.switchStatus(evt)}}>Offer</button><br />
                </div>
                <div className="col-10">
                    <table class="table">
                        <caption></caption>
                        <thead>
                            <tr>
                                <th scope="col" className="td-title">Title</th>
                                <th scope="col" className="td-company">Company</th>
                                <th scope="col" className="td-status">Status</th>
                                <th scope="col" className="td-action">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.generateJobCard()}
                        </tbody>
                    </table>
                </div>
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

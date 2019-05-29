"use strict";


class SavedJob extends React.Component {
    constructor(props) {
        super(props);

        this.redirectApplication = this.redirectApplication.bind(this);
    }

    redirectApplication = () => {
        window.open(`${this.props.apply_url}`);
    }
    
    
    render() {
        const Card = ReactBootstrap.Card;
        const Button = ReactBootstrap.Button;

        const buttons = []
        if (this.props.status === "Saved") {
            buttons.push(
                        <span>
                            <Button variant="link" onClick={this.redirectApplication}>
                                Apply on Company Site
                            </Button>
                            <Button variant="primary" onClick={this.props.removeJob}>
                                Remove
                            </Button>
                            <span> </span>
                            <Button variant="primary" onClick={this.props.appliedJob}>
                                Applied
                            </Button>
                        </span>);
        } else if (this.props.status === "Applied") {
            buttons.push(
                        <span>
                            <Button variant="primary" onClick={this.props.removeJob}>
                                Remove
                            </Button>
                            <span> </span>
                            <Button variant="primary" disabled>
                                Pending Review
                            </Button>
                        </span>);
        }

        return (
            <div key={this.props.job_id} width="80%" height="60%">
                <Card>
                    <Card.Header>{this.props.title}</Card.Header>
                    <Card.Body>
                        <Card.Text>{this.props.description}</Card.Text>
                        <span>{buttons}</span>
                    </Card.Body>
                </Card>
            </div>
        );
    }
}


class MyJobs extends React.Component {
    constructor(props) {
        super(props);

        this.reFresh = this.reFresh.bind(this);
        this.removeJob = this.removeJob.bind(this);
        this.appliedJob = this.appliedJob.bind(this);

        this.state = {
            results: []
            // saved: [],
            // applied: [],
            // p_sheduled: [],
            // p_completed: [],
            // r_scheduled: [],
            // r_completed: [],
            // o_scheduled: [],
            // o_completed: [],
        };
    }

    reFresh = () => {
        fetch("/userjobs")
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    componentDidMount = () => {
        this.reFresh();
    }

    removeJob = (job_id) => {

        const data = new FormData();
        data.append('job_id', JSON.stringify(job_id));

        fetch('api/remove', {
            method: 'DELETE',
            body: data,
            }).then(() => {this.reFresh()})
    }

    appliedJob = (job_id) => {
        const data = new FormData();
        data.append('job_id', JSON.stringify(job_id));

        fetch('api/applied', {
            method: 'PUT',
            body: data,
            }).then(() => {this.reFresh()})
    }

    render() {
        const job_cards = [];

        for (const job of this.state.results) {
            job_cards.push(
                <div key={job[0].job_id}>
                    <SavedJob job_id={job[0].job_id}
                              title={job[0].title}
                              description={job[0].description.slice(0, 500)}
                              apply_url={job[0].apply_url}
                              removeJob={() => this.removeJob(job[0].job_id)}
                              appliedJob={() => this.appliedJob(job[0].job_id)}
                              status={job[1]} />
                </div>
            );
        }

        const job_count = job_cards.length

        return (
            <div className="saved-job">
                <h3>My saved jobs ({job_count})</h3>
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
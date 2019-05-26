"use strict";


class SavedJob extends React.Component {
    constructor(props) {
        super(props);

        this.redirectApplication = this.redirectApplication.bind(this);
        this.removeJob = this.removeJob.bind(this);
    }

    redirectApplication = () => {
        window.open(`${this.props.apply_url}`);
    }

    removeJob = () => {

        const data = new FormData();
        data.append('job_id', JSON.stringify(this.props.job_id));

        fetch('api/remove', {
            method: 'DELETE',
            body: data,
            })

        setTimeout(this.props.parentMethod, 66);
    }
    
    render() {
        const Card = ReactBootstrap.Card;
        const Button = ReactBootstrap.Button;

        return (
            <div key={this.props.job_id} width="80%" height="60%">
                <Card>
                    <Card.Header>{this.props.title}</Card.Header>
                    <Card.Body>
                        <Card.Text>{this.props.description}</Card.Text>
                        <Button variant="link" onClick={this.redirectApplication}>
                            Apply
                        </Button>
                        <Button variant="primary" onClick={ (evt) => {
                                                            this.removeJob(evt);
                                                            }}>
                            Remove
                        </Button>
                        <Button variant="primary">Applied</Button>
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

        this.state = {
            results: [],
        };
    }

    componentDidMount = () => {
        fetch("/userjobs")
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    reFresh = () => {

        fetch("/userjobs")
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
    }

    render() {
        const job_cards = [];

        for (const job of this.state.results) {
            job_cards.push(
                <div key={job.job_id}>
                    <SavedJob job_id={job.job_id}
                              title={job.title}
                              description={job.description.slice(0, 500)}
                              apply_url={job.apply_url} 
                              parentMethod={this.reFresh}/>
                </div>
            );
        }

        return (
            <div className="saved-job">
                <h3>My saved jobs</h3>
                <div className="jobcards">{job_cards}</div>
            </div>
        );
    }
};

ReactDOM.render(
    <MyJobs />,
    document.getElementById("myjobs")
);

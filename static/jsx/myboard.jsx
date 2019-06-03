"use strict";


class TrackingCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div key={this.props.user_job_id} className="tracking-card">
                <p className="card-title">{this.props.title}</p>
                <p className="card-company">{this.props.company_name}</p>
                <LogModal user_job_id={this.props.user_job_id}
                          title={this.props.title}
                          company_name={this.props.company_name}
                          changeStatus={this.props.changeStatus}
                          reFresh={this.props.reFresh}
                           />
            </div>
        );
    }
}


class StatusColumn extends React.Component {
    constructor(props) {
        super(props);

        this.countCard = this.countCard.bind(this);
        this.generateTrackingCards = this.generateTrackingCards.bind(this);
        this.changeStatus = this.changeStatus.bind(this);
        this.postStatusLog = this.postStatusLog.bind(this);
    }

    postStatusLog(user_job_id, log) {
        const data = new FormData();
        data.append("user_job_id", user_job_id);
        data.append("log", log);

        fetch("api/log", {
            method: "POST",
            body: data,
            });
    }

    changeStatus(user_job_id, new_status) {
        const data = new FormData();
        data.append('user_job_id', user_job_id);
        data.append('new_status', new_status);

        fetch('api/changestatus', {
            method: 'POST',
            body: data,
            }).then(() => {this.props.reFresh()})
        
        this.postStatusLog(user_job_id, `Status changed: ${new_status}`)
    }

    countCard() {
        return this.props.results.length;
    }

    generateTrackingCards() {
        const tracking_cards = []

        for (const job of this.props.results) {
            tracking_cards.push(<TrackingCard user_job_id={job.user_job_id}
                                              title={job.title}
                                              company_name={job.company_name}
                                              status={job.status}
                                              changeStatus={this.changeStatus}
                                              reFresh={this.props.reFresh}
                                              />)
        }
        return tracking_cards;
    }

    render() {
        return (
            <div className="col-md-2 status-column" key={this.props.status}>
                <p className="column-header">{this.props.status} ({this.countCard()})</p>
                {this.generateTrackingCards()}
            </div>
        );
    }
}


class MyBoard extends React.Component {
    constructor(props) {
        super(props);

        this.generateStatusColumns = this.generateStatusColumns.bind(this);
        this.reFresh = this.reFresh.bind(this);

        this.state = {
                        search: "",
                        result: [],
                        Applied: [],
                        Online_assessment: [],
                        Phone_screen: [],
                        Onsite: [],
                        Decision_made: [],
                     };
    }

    reFresh() {
        fetch("/tracking?status=Applied")
            .then(res => res.json())
            .then(data => {
                this.setState({ Applied: data });
            });
        fetch("/tracking?status=Online assessment")
            .then(res => res.json())
            .then(data => {
                this.setState({ Online_assessment: data });
            });
        fetch("/tracking?status=Phone screen")
            .then(res => res.json())
            .then(data => {
                this.setState({ Phone_screen: data });
            });
        fetch("/tracking?status=On-site")
            .then(res => res.json())
            .then(data => {
                this.setState({ Onsite: data });
            });
        fetch("/tracking?status=Decision made")
            .then(res => res.json())
            .then(data => {
                this.setState({ Decision_made: data });
            });
    }
    
    componentDidMount() {
        this.reFresh();
    }
    
    generateStatusColumns() {
        const status_column = []
        status_column.push(<StatusColumn status="Applied" results={this.state.Applied} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Online assessment" results={this.state.Online_assessment} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Phone screen" results={this.state.Phone_screen} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="On-site" results={this.state.Onsite} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Decision made" results={this.state.Decision_made} reFresh={this.reFresh} />)

        return status_column;
    }

    render() {
        return (
            <div>
                <p>TODO: search bar goes here</p>
                <AddJob reFresh={this.reFresh}/>
                <div className="container">
                    <div className="row">
                        {this.generateStatusColumns()}
                    </div>
                </div>
            </div>
        ); 
    }
}

window.addEventListener("load", () => {
    ReactDOM.render(
        <MyBoard />,
        document.getElementById("myboard")
    );
})

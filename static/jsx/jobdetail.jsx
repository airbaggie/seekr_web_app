"use strict";


class JobDetail extends React.Component {
    constructor(props) {
        super(props);
    
        this.handleSave = this.handleSave.bind(this);
        this.reFresh = this.reFresh.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    
        this.state = {
            // is_active: false,
            results: [],
            saved: false,
            // message: "",
        };
    }

    reFresh() {
        fetch("/jobdetail")
            .then(res => res.json())
            .then(data => { 
                this.setState({ results: data });
            });
        fetch(`/tags?key=${this.props.job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ tags: data });
            });
    }

    componentDidMount() {
        this.reFresh();
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
                            <button type="button" class="btn btn-primary" onClick={this.handleSave} key={this.props.job_id}>
                                Save
                            </button>);
        } else {
            save_button.push(
                            <button type="button" class="btn btn-primary" disabled key={this.props.job_id}>
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

window.addEventListener("load", () => {
    ReactDOM.render(
        <JobDetail />,
        document.getElementById("jobdetail")
    );
})

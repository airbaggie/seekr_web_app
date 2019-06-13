"use strict";


class ViewJob extends React.Component {
    constructor(props) {
        super(props);
    
        this.handleSave = this.handleSave.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    
        this.state = {
            saved: false,
        };
    }

    handleSave(evt) {
        evt.preventDefault();

        const data = new FormData();                                 
        data.append("key", JSON.stringify(this.props.detail_info[0].job_id));

        fetch("/api/userjobs", {
            method: "POST",
            body: data,
            })

        this.setState({ saved: true });
    }

    redirectApplication() {
        window.open(`${this.props.detail_info[0].apply_url}`);
    }

    handlePrivateJobInfo() {
        if ((!this.props.detail_info[0].description) & (!this.props.detail_info[0].description)) {

        }
    }
  
    render() {

        const save_button = [];
        if (!this.state.saved) {
            save_button.push(
                            <button type="button" className="btn btn-info" onClick={this.handleSave} key={this.props.detail_info[0].job_id}>
                                Save
                            </button>);
        } else {
            save_button.push(
                            <button type="button" className="btn btn-info" disabled key={this.props.detail_info[0].job_id}>
                                Saved
                            </button>);
        }

        return (
            <div key={this.props.detail_info[0].job_id} className="row">
                <div className="col-1"></div>
                <div className="col-10">
                    <div className="row">
                        <div className="col">
                            <button type="button" className="bt btn btn-secondary" onClick={this.props.handleListView}>Back</button>
                            <span>{save_button}</span>
                            <button type="button" className="btn btn-outline-warning url" onClick={this.redirectApplication}>Apply on Company Site</button>
                        </div>
                    </div>
                    <br />
                    <div key={this.props.detail_info[0].job_id} className="job-detail">
                        <div>
                            <h3>{this.props.detail_info[0].title}</h3>
                            <h5>{this.props.detail_info[0].company_name}</h5>
                        </div>
                        <div className="jd">{this.props.detail_info[0].description.split("\n").map((item, key) => {
                                return <span key={key}>{item}<br/></span>})}
                        </div>
                    </div>
                </div>
                <div className="col-1"></div>
            </div>
        );
    }
}


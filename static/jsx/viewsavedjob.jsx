"use strict";


class ViewSavedJob extends React.Component {
    constructor(props) {
        super(props);
    
        // this.handleApply = this.handleApply.bind(this);
        this.redirectApplication = this.redirectApplication.bind(this);
    
        this.state = {
            applied: false,
        };
    }

    redirectApplication() {
        window.open(`${this.props.detail_info[0].apply_url}`);
    }

    handlePrivateJobInfo() {
        if ((!this.props.detail_info[0].description) & (!this.props.detail_info[0].description)) {
            
        }
    }
  
    render() {
        return (
            <div key={this.props.detail_info[0].job_id}>
                <div>
                    <button type="button" onClick={this.props.handleIndexView}>Back to my jobs</button>
                    <div class="container">
                        <div class="row">
                            <div class="col-12 col-md-8">
                                <div key={this.props.detail_info[0].job_id}>
                                    <div>
                                        <h3>{this.props.detail_info[0].title}</h3>
                                        <h5>{this.props.detail_info[0].company_name}</h5>
                                    </div>
                                    <div>
                                        <button type="button" className="btn btn-link" onClick={this.redirectApplication}>
                                            Apply on Company Site
                                        </button>
                                    </div>
                                </div>
                                <div>{this.props.detail_info[0].description.split("\n").map((item, key) => {
                                            return <span key={key}>{item}<br/></span>})}
                                </div>
                            </div>
                            <div class="col-6 col-md-4">
                                <p>TODO: create note component and show history on the right side</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


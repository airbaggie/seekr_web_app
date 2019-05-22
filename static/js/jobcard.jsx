"use strict";

class JobCard extends React.Component {

  render() {
      return (
            <div className="jobcard">
              <span id={this}>
              <p>{this.props.title}</p>
              <p>{this.props.company_name}</p>
              </span>
              <span>
              <button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModalLong">View Detail</button>
              </span>
            </div>
            )
  }
}

ReactDOM.render(
  <JobCard title="software engineer" company_name="uber"/>, 
  document.getElementById("search-results")
);
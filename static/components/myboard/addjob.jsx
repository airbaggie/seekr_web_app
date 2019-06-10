"use strict";


class AddJob extends React.Component {
    constructor(props) {
        super(props);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.handleTitleInput = this.handleTitleInput.bind(this);
        this.handleCompanyInput = this.handleCompanyInput.bind(this);
        this.handleDescriptionInput = this.handleDescriptionInput.bind(this);
        this.handleUrlInput = this.handleUrlInput.bind(this);

        this.state = {
            show: false,
            title: "",
            company_name: "",
            description: "",
            apply_url: "",
        };
    }

    handleClose() {
        this.setState({ show: false });
    }
  
    handleShow() {
        this.setState({ show: true });
    }

    postJob(title, company_name, description, apply_url) {
        const data = new FormData();
        data.append("key1", title);
        data.append("key2", company_name);
        data.append("key3", description);
        data.append("key4", apply_url);
    
        fetch("/api/privatejob", {
            method: "POST",
            body: data,
            }).then(this.handleClose())
            .then(this.props.reFresh());
    }

    handleTitleInput(evt) {
        this.setState({ title: evt.target.value });
    }
    handleCompanyInput(evt) {
        this.setState({ company_name: evt.target.value });
    }
    handleDescriptionInput(evt) {
        this.setState({ description: evt.target.value });
    }
    handleUrlInput(evt) {
        this.setState({ apply_url: evt.target.value });
    }

    render() {
        const Modal = ReactBootstrap.Modal;
        const Button = ReactBootstrap.Button;

        return (
            <div>
                <Button variant="secondary" onClick={(evt) => {
                                                    this.handleShow(evt);
                                                    }}>
                    + add job
                </Button>
        
                <Modal show={this.state.show}
                       onHide={this.handleClose}
                       size="lg"
                       aria-labelledby="contained-modal-title-vcenter"
                       className="job-detail-modal"
                       centered>
                    <Modal.Header closeButton>
                    <Modal.Title>
                        <div>
                            <p>Add a job:</p>
                        </div>
                    </Modal.Title>
                    </Modal.Header>
                    <form>
                        <div className="form-group add-job">
                            <label htmlFor="messageText" className="col-form-label">Job title:</label>
                            <input className="form-control add-row" id="messageText" name="title" onChange={this.handleTitleInput} />
                            <label htmlFor="messageText" className="col-form-label">Company name:</label>
                            <input className="form-control add-row" id="messageText" name="company_name" onChange={this.handleCompanyInput} />
                            <label htmlFor="messageText" className="col-form-label">Description:</label>
                            <textarea className="form-control job-input" id="messageText" name="description" onChange={this.handleDescriptionInput}></textarea>
                            <label htmlFor="messageText" className="col-form-label">Apply URL(optional):</label>
                            <input className="form-control add-row" id="messageText" name="apply_url" onChange={this.handleUrlInput} />
                        </div>
                    </form>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <button type="submit"
                            className="btn btn-primary"
                            onClick={() => {
                                    this.postJob(`${this.state.title}`, `${this.state.company_name}`, `${this.state.description}`, `${this.state.apply_url}`);
                                    this.props.reFresh();
                                    }}>
                        Submit
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
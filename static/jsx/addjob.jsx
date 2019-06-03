

class AddJob extends React.Component {
    constructor(props, context) {
        super(props, context);
    
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.state = {
            show: false,
        };
    }

    handleClose() {
        this.setState({ show: false });
    }
  
    handleShow() {
        this.setState({ show: true });
    }

    postJob(title, company_name) {

        const data = new FormData();
        data.append("title", title);
        data.append("company_name", company_name);
    
        fetch("api/addjob", {
            method: "POST",
            body: data,
            });
    }

    render() {
        const Modal = ReactBootstrap.Modal;
        const Button = ReactBootstrap.Button;

        return (
            <div>
                <Button variant="primary" onClick={(evt) => {
                                                    this.handleShow(evt);
                                                    }}>
                    add job
                </Button>
        
                <Modal show={this.state.show}
                       onHide={this.handleClose}
                       size="lg"
                       aria-labelledby="contained-modal-title-vcenter"
                       className="add-jobmodal"
                       centered>
                        <form key="add-job" method="POST" action="/api/addjob">
                            <div className="form-group add-job">

                                <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Title</label>
                                <input type="title" className="form-control col-sm-4" name="title" id="inputtitle" placeholder="Job Title"/>

                                <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Company Name</label>
                                <input type="company-name" className="form-control col-sm-4" name="company-name" id="inputcompany-name" placeholder="Company Name"/>

                                <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">Description(Optional)</label>
                                <textarea className="form-control" name="description" id="inputdescription" placeholder="Description(Optional)"></textarea>
                                
                                <label htmlFor="inputEmail3" className="col-sm-2 col-form-label">URL(Optional)</label>
                                <input type="url" className="form-control col-sm-6" name="url" id="inputurl" placeholder="URL(Optional)"/>
                            </div>
                            
                            <div className="form-group row">
                                <div className="col-sm-10">
                                    <button type="submit" className="btn btn-primary">Add job</button>
                                </div>
                            </div>
                    </form>
                </Modal>
            </div>
        );
    }
}
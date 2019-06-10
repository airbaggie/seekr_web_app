"use strict";


class DropdownButton extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const Dropdown = ReactBootstrap.Dropdown;

        return (
            <Dropdown className="dropdown">
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    Change status
                </Dropdown.Toggle>
                <Dropdown.Menu className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "Applied");
                                                                        this.props.reFresh();
                                                                        }}>Applied</Dropdown.Item>
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "Online assessment");
                                                                        this.props.reFresh();
                                                                        }}>Online assessment</Dropdown.Item>
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "Phone screen");
                                                                        this.props.reFresh();
                                                                        }}>Phone screen</Dropdown.Item>
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "On-site");
                                                                        this.props.reFresh();
                                                                        }}>On-site</Dropdown.Item>
                    <Dropdown.Item className="dropdown-item" onClick={() => {
                                                                        this.props.changeStatus(`${this.props.user_job_id}`, "Offer");
                                                                        this.props.reFresh();
                                                                        }}>Offer</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>   
        );
    }
}


class NoteModal extends React.Component {
    constructor(props) {
        super(props);
    
        this.fetchNotes = this.fetchNotes.bind(this);
        this.handleNoteInput = this.handleNoteInput.bind(this);
        this.postNote = this.postNote.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.generateNoteHistory = this.generateNoteHistory.bind(this);
    
        this.state = {
            show: false,
            note: "",
            notes: [],
        };
    }

    fetchNotes(evt) {
        evt.preventDefault();
    
        fetch(`/api/notes?key=${this.props.user_job_id}`)
            .then(res => res.json())
            .then(data => { 
                this.setState({ notes: data });
            }).then(this.setState({ note: ""}));
    }

    handleClose() {
        this.setState({ show: false });
    }
  
    handleShow() {
        this.setState({ show: true });
    }

    handleNoteInput(evt) {
        this.setState({ note: evt.target.value });
        console.log(this.state.note);
    }

    postNote(user_job_id, note) {

        if (note) {
            const data = new FormData();
            data.append("key1", user_job_id);
            data.append("key2", note);

            fetch("/api/notes", {
                method: "POST",
                body: data,
                }).then((evt) => {this.fetchNotes(evt)})
                .then(this.handleClose())
        }
        this.setState({ note: "" });
    }

    generateNoteHistory() {
        const notes = [];
        for (const note of this.state.notes) {
            notes.push(
                    <div className="note-history row">
                        <div className="col note-in-modal">
                            <span className="mb-1">{note.note}</span>
                        </div>
                        <div className="col notetime-in-modal">
                            <span className="right_header note-time italic">{note.note_date}</span>
                        </div>
                    </div>
                    )
        }
        return notes;
    }

    render() {
        const Modal = ReactBootstrap.Modal;
        const Button = ReactBootstrap.Button;

        return (
            <div>
                <Button className="add-note-button" variant="light" size="sm" onClick={(evt) => {
                                                    this.handleShow(evt);
                                                    this.fetchNotes(evt);
                                                    }}>
                    + note
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
                            <h5>{this.props.title}</h5>
                            <p>{this.props.company_name}</p>
                        </div>
                        <DropdownButton user_job_id={this.props.user_job_id}
                                        status={this.props.status} 
                                        changeStatus={this.props.changeStatus}
                                        reFresh={this.props.reFresh}
                                        />
                    </Modal.Title>
                    </Modal.Header>
                    <div>{this.generateNoteHistory()}</div>
                    <form>
                        <div className="form-group add-note">
                            <label htmlFor="messageText" className="col-form-label">Add note:</label>
                            <textarea className="form-control note-input" id="messageText" name="note" onChange={this.handleNoteInput}></textarea>
                        </div>
                    </form>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={this.handleClose}>
                        Close
                    </Button>
                    <button type="button"
                            className="btn btn-primary"
                            onClick={() => {
                                this.postNote(`${this.props.user_job_id}`, `${this.state.note}`);
                                }}>
                        Submit
                    </button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

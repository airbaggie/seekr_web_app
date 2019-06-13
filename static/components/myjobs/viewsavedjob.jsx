"use strict";


class NoteCard extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="card mb-1">
                <div className="card-body note-card">
                    <p className="card-text">{this.props.note}</p>
                    <p className="card-text"><small className="text-muted">{this.props.timestamp}</small></p>
                </div>
            </div>
        )
    }
}


class ViewSavedJob extends React.Component {
    constructor(props) {
        super(props);
    
        this.redirectApplication = this.redirectApplication.bind(this);
        this.generateNoteCard = this.generateNoteCard.bind(this);
    
        this.state = {
            applied: false,
        };
    }

    redirectApplication() {
        window.open(`${this.props.detail_info[0].apply_url}`);
    }

    generateNoteCard() {
        const note_cards = [];
        for (const note of this.props.notes) {
            note_cards.push(<NoteCard note={note.note} timestamp={note.note_date} />)
        }
        return note_cards;
    }

    render() {
        return (
            <div key={this.props.detail_info[0].job_id} className="container">
                <div className="row">
                    <div className="col-12 col-md-9">
                        <button type="button" className="bt btn btn-secondary" onClick={this.props.handleIndexView}>Back</button>
                        <button type="button" className="btn btn-outline-warning url" onClick={this.redirectApplication}>Link to Company Site</button>
                        <br />
                        <div className="saved-job-detail">
                            <div key={this.props.detail_info[0].job_id}>
                                <div>
                                    <h3>{this.props.detail_info[0].title}</h3>
                                    <h5>{this.props.detail_info[0].company_name}</h5>
                                </div>
                            </div>
                            <div className="jd">{this.props.detail_info[0].description.split("\n").map((item, key) => {
                                        return <span key={key}>{item}<br/></span>})}
                            </div>
                        </div>
                    </div>
                    <div className="col-6 col-md-3">
                        <span className="history-tag">History</span>
                        {this.generateNoteCard()}
                    </div>
                </div>
            </div>
        );
    }
}


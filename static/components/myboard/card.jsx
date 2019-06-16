"use strict";


const DragSource = ReactDnD.DragSource;
const ItemTypes = { CARD: 'card' };

// original undraggable card component
class RawTrackingCard extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const connectDragSource = this.props.connectDragSource; // new added
        const isDragging = this.props.isDragging;               // new added
        const opacity = isDragging ? 0.4 : 1;
        return (
            <div key={this.props.user_job_id} className={`tracking-card ${ this.props.status }`}
                 ref={connectDragSource} style={{ opacity }}>
                <p className="card-title">{this.props.title}</p>
                <p className="card-company">{this.props.company_name}</p>
                <NoteModal user_job_id={this.props.user_job_id}
                           title={this.props.title}
                           company_name={this.props.company_name}
                           changeStatus={this.props.changeStatus}
                           reFresh={this.props.reFresh}
                           />
            </div>
        );
    }
}

// Wrap RawTrackingCard component with DragSource to make it draggable.
// DragSource is accepting three required parameters.
const type = ItemTypes.CARD;
const spec = { beginDrag: props => ({ name: props.title,
                                      changeStatus: props.changeStatus,
                                      user_job_id: props.user_job_id,
                                     }),
            };

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
    }
}

const TrackingCard = DragSource(type, spec, collect)(RawTrackingCard);

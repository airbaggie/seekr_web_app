"use strict";


const DropTarget = ReactDnD.DropTarget;
// const rowStyle = { overflow: 'hidden', clear: 'both' };
const ItemTypes = { CARD: 'card' };

// original undroppable column component
class RawStatusColumn extends React.Component {
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
        const connectDropTarget = this.props.connectDropTarget;
        const canDrop = this.props.canDrop; 
        const isOver = this.props.isOver;
        const isActive = canDrop && isOver;

        // let backgroundColor = '#222'
        // if (isActive) {
        //     backgroundColor = 'darkgreen'
        // } else if (canDrop) {
        //     backgroundColor = 'darkkhaki'
        // }

        return (
            <div className="col-md-2 status-column" key={this.props.status}>
                <p className="column-header">{this.props.status} ({this.countCard()})</p>
                <div ref={connectDropTarget}>
                    <div>
                         {/* style={{ backgroundColor }} */}
                        {isActive ? 'Release to change status' : 'Drag card to change status'}
                        {this.generateTrackingCards()}
                    </div>
                </div>
            </div>
        );
    }
}


// Wrap RawStatusColumn component with DropTarget to make it droppable.
// DropTarget is accepting three required parameters.
const type = ItemTypes.CARD;
const spec = { drop: props => ({ name: props.status }),
               drop(props, monitor) {
                    // Obtain the dragged item
                    const item = monitor.getItem();
                    // Call TrackingCard's props method to update card status depending on the StatusColumn
                    return item.changeStatus(item.user_job_id, props.status)
               }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop(),
    }
}

const StatusColumn = DropTarget(type, spec, collect)(RawStatusColumn)

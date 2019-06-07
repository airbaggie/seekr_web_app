"use strict";


const DragDropContext = ReactDnD.DragDropContext;
const HTML5Backend = ReactDnDHTML5Backend.default;
// const rowStyle = { overflow: 'hidden', clear: 'both' }

class MyBoard extends React.Component {
    constructor(props) {
        super(props);

        this.generateStatusColumns = this.generateStatusColumns.bind(this);
        this.reFresh = this.reFresh.bind(this);

        this.state = { Applied: [],
                       Online_assessment: [],
                       Phone_screen: [],
                       Onsite: [],
                       Decision_made: [],
                     };
    }

    reFresh() {
        fetch("/tracking?status=Applied")
            .then(res => res.json())
            .then(data => {
                this.setState({ Applied: data });
            });
        fetch("/tracking?status=Online assessment")
            .then(res => res.json())
            .then(data => {
                this.setState({ Online_assessment: data });
            });
        fetch("/tracking?status=Phone screen")
            .then(res => res.json())
            .then(data => {
                this.setState({ Phone_screen: data });
            });
        fetch("/tracking?status=On-site")
            .then(res => res.json())
            .then(data => {
                this.setState({ Onsite: data });
            });
        fetch("/tracking?status=Decision made")
            .then(res => res.json())
            .then(data => {
                this.setState({ Decision_made: data });
            });
    }
    
    componentDidMount() {
        this.reFresh();
    }
    
    generateStatusColumns() {
        const status_column = []
        status_column.push(<StatusColumn status="Applied" results={this.state.Applied} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Online assessment" results={this.state.Online_assessment} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Phone screen" results={this.state.Phone_screen} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="On-site" results={this.state.Onsite} reFresh={this.reFresh} />)
        status_column.push(<StatusColumn status="Decision made" results={this.state.Decision_made} reFresh={this.reFresh} />)
        return status_column;
    }

    render() {
        return (
            <div>
                <AddJob reFresh={this.reFresh}/>
                    <div className="container">
                        <div className="row">
                            {this.generateStatusColumns()}
                        </div>
                    </div>
            </div>
        ); 
    }
}


const TrackingBoard = DragDropContext(HTML5Backend)(MyBoard);
 
class Tracker extends React.Component {
    render() {
        return <TrackingBoard />;
   }
}


window.addEventListener("load", () => {
    ReactDOM.render(
        <Tracker />,
        document.getElementById("myboard")
    );
})

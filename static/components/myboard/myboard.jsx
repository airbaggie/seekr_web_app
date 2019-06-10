"use strict";


const DragDropContext = ReactDnD.DragDropContext;
const HTML5Backend = ReactDnDHTML5Backend.default;

class Board extends React.Component {
    constructor(props) {
        super(props);

        this.generateStatusColumns = this.generateStatusColumns.bind(this);
        this.reFresh = this.reFresh.bind(this);

        this.state = { Applied: [],
                       Online_assessment: [],
                       Phone_screen: [],
                       Onsite: [],
                       Offer: [],
                     };
    }

    reFresh() {
        fetch("/api/track?key=Applied")
            .then(res => res.json())
            .then(data => {
                this.setState({ Applied: data });
            });
        fetch("/api/track?key=Online assessment")
            .then(res => res.json())
            .then(data => {
                this.setState({ Online_assessment: data });
            });
        fetch("/api/track?key=Phone screen")
            .then(res => res.json())
            .then(data => {
                this.setState({ Phone_screen: data });
            });
        fetch("/api/track?key=On-site")
            .then(res => res.json())
            .then(data => {
                this.setState({ Onsite: data });
            });
        fetch("/api/track?key=Offer")
            .then(res => res.json())
            .then(data => {
                this.setState({ Offer: data });
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
        status_column.push(<StatusColumn status="Offer" results={this.state.Offer} reFresh={this.reFresh} />)
        return status_column;
    }

    render() {
        return (
            <div>
                <AddJob reFresh={this.reFresh}/>
                    <div>
                        <div className="row status-columns justify-content-center">
                            {this.generateStatusColumns()}
                        </div>
                    </div>
            </div>
        ); 
    }
}


const TrackingBoard = DragDropContext(HTML5Backend)(Board);

class MyBoard extends React.Component {
    render() {
        return <TrackingBoard />;
   }
}


window.addEventListener("load", () => {
    ReactDOM.render(
        <MyBoard />,
        document.getElementById("myboard")
    );
})

"use strict";


class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="jumbotron homepage-jumbotron">
                <h3>Welcome to seekr!</h3>
                <p>
                    
                </p>
                <p>
                <button type="button" className="btn btn-info">Start</button>
                </p>
            </div>
        );
    }
};


window.addEventListener("load", () => {
    ReactDOM.render(
        <Home />,
        document.getElementById("home")
    );
})
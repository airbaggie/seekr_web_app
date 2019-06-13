"use strict";


class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="jumbotron">
                <h1>Hello, world!</h1>
                <p>
                    This is a simple hero unit, a simple jumbotron-style component for calling
                    extra attention to featured content or information.
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
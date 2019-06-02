"use strict";


class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
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
                <button type="button" className="btn btn-primary">Start</button>
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
"use strict";


class Home extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const Button = ReactBootstrap.Button;
        const Jumbotron = ReactBootstrap.Jumbotron;

        return (
            <div>
                <Jumbotron>
                    <h1>Hello, world!</h1>
                    <p>
                        This is a simple hero unit, a simple jumbotron-style component for calling
                        extra attention to featured content or information.
                    </p>
                    <p>
                        <Button variant="primary">Start</Button>
                    </p>
                </Jumbotron>
            </div>
        );
    }
};
    
ReactDOM.render(
    <Home />,
    document.getElementById("home")
);
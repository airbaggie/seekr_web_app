"use strict";


class Home extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div id="carouselControls" className="carousel slide" data-ride="carousel">
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img className="d-block w-100" src="/static/assets/1.png" alt="First slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="/static/assets/2.png" alt="Second slide" />
                    </div>
                    <div className="carousel-item">
                        <img className="d-block w-100" src="/static/assets/3.png" alt="Third slide" />
                    </div>
                </div>
                <a className="carousel-control-prev" href="#carouselControls" role="button" data-slide="prev">
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="sr-only">Previous</span>
                </a>
                <a className="carousel-control-next" href="#carouselControls" role="button" data-slide="next">
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="sr-only">Next</span>
                </a>
            </div>
        );
    }
};

ReactDOM.render(
    <Home />,
    document.getElementById("home")
);
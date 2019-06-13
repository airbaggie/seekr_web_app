"use strict";


class Login extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <form key="login" method="POST" action="/login">
                <div className="form-group row">
                    <label htmlFor="inputEmail3" className="col-sm-1 col-form-label">Email</label>
                    <div className="col-sm-3">
                        <input type="email" className="form-control" name="email" id="inputEmail3" placeholder="Email" />
                    </div>
                </div>
                <div className="form-group row">
                    <label htmlFor="inputPassword3" className="col-sm-1 col-form-label">Password</label>
                    <div className="col-sm-3">
                        <input type="password" className="form-control" name="password" id="inputPassword3" placeholder="Password" />
                    </div>
                </div>
                <div className="form-group row">
                    <div className="col-sm-10">
                        <button type="submit" className="btn btn btn-secondary">Log in</button>
                    </div>
                </div>
            </form>
        ); 
    }
};

ReactDOM.render(
    <Login />,
    document.getElementById("login")
);
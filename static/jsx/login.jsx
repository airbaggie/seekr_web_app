"use strict";


class Login extends React.Component {
    constructor(props, context) {
        super(props, context);
    }

    render() {
        const Form = ReactBootstrap.Form;
        const Row = ReactBootstrap.Row;
        const Col = ReactBootstrap.Col;
        const Button = ReactBootstrap.Button;

        return (
            <div>
                <Form key="login" method="POST" action="/login" sm={4}>
                    <Form.Group as={Row} controlId="login-email">
                        <Form.Label column sm={1}>
                        Email
                        </Form.Label>
                        <Col sm={3}>
                        <Form.Control name="email" type="email" placeholder="Email" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row} controlId="login-password">
                        <Form.Label column sm={1}>
                        Password
                        </Form.Label>
                        <Col sm={3}>
                        <Form.Control name="password" type="password" placeholder="Password" />
                        </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                        <Col sm={{ span: 10, offset: 1 }}>
                        <Button type="submit">Log in</Button>
                        </Col>
                    </Form.Group>
                </Form>
            </div>
        ); 
    }
};

window.addEventListener("load", () => {
    ReactDOM.render(
        <Login />,
        document.getElementById("login")
    );
})
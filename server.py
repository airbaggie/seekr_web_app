from jinja2 import StrictUndefined
from flask import Flask, render_template, request, flash, redirect, session
from flask_debugtoolbar import DebugToolbarExtension
from model import connect_to_db, db, Job, User, Tag, JobTag, UserTag, UserJob, Comment, Status, Decision, Company, Avatar

app = Flask(__name__)

# Required to use Flask sessions and the debug toolbar
app.secret_key = "TEMPKEY"

# Raise an error if an undefined variable is in use.
app.jinja_env.undefined = StrictUndefined


@app.route("/")
def index():
    """Homepage."""

    return render_template("homepage.html")


@app.route('/register', methods=['GET'])
def register_form():
    """Show form for user signup."""

    return render_template("register_form.html")


@app.route('/register', methods=['POST'])
def register_process():
    """Process registration."""

    # Get form variables
    email = request.form["email"]
    password = request.form["password"]
    zipcode = request.form["zipcode"]

    new_user = User(email=email, password=password, zipcode=zipcode)

    db.session.add(new_user)
    db.session.commit()

    flash(f"User {email} added.")
    return redirect(f"/users/{new_user.user_id}")


@app.route('/login', methods=['GET'])
def login_form():
    """Show login form."""

    return render_template("login_form.html")


@app.route('/login', methods=['POST'])
def login_process():
    """Process login."""

    # Get form variables
    email = request.form["email"]
    password = request.form["password"]

    user = User.query.filter_by(email=email).first()

    if not user:
        flash("No such user")
        return redirect("/register")

    if user.password != password:
        flash("Incorrect password")
        return redirect("/login")

    session["user_id"] = user.user_id

    flash("Logged in")
    return redirect(f"/users/{user.user_id}")


@app.route("/users/<int:user_id>", methods=['GET'])
def user_detail(user_id):
    """Show info about user."""

    user = User.query.get(user_id)
    return render_template("user.html", user=user)


@app.route("/select_tag", methods=['POST'])
def select_tag_process():
    """Process tag selection."""

    user_id = session["user_id"]
    user = User.query.get(user_id)

    tag_list = []
    tag_list.append(request.form.get("language"))
    tag_list.append(request.form.get("framework"))
    tag_list.append(request.form.get("database"))
    tag_list.append(request.form.get("platform"))

    for tag in tag_list:
        tag = Tag.query.filter(Tag.tag_name == tag).one()
        user_tag = UserTag(user_id=user.user_id, tag_id=tag.tag_id)
        db.session.add(user_tag)
    db.session.commit()

    flash(f"User {tag} added.")
    return redirect(f"/users/{user.user_id}")


@app.route('/logout')
def logout():
    """Log out."""

    del session["user_id"]
    flash("Logged Out.")
    return redirect("/")


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension

    # Do not debug for demo
    app.debug = True

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
from jinja2 import StrictUndefined
from flask import Flask, render_template, request, flash, redirect, session
from flask_debugtoolbar import DebugToolbarExtension
from model import connect_to_db, db, Job, User, Tag, JobTag, UserTag, UserJob, Comment, Company, ExtJob, Avatar

app = Flask(__name__)

# Required to use Flask sessions and the debug toolbar
app.secret_key = "TEMPKEY"

# Raise an error if an undefined variable is in use.
app.jinja_env.undefined = StrictUndefined




if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension

    # Do not debug for demo
    app.debug = True

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
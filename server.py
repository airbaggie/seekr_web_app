from jinja2 import StrictUndefined
from flask import Flask, render_template, abort, make_response, request, flash, redirect, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from model import connect_to_db, db, Job, User, Tag, JobTag, UserTag, UserJob, Comment, Company, Avatar
from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
api = Api(app) 
CORS(app)

# Required to use Flask sessions and the debug toolbar
app.secret_key = "TEMPKEY"

# Raise an error if an undefined variable is in use.
app.jinja_env.undefined = StrictUndefined

# Configuration for login handling
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = "login"


@login_manager.user_loader
def load_user(user_id):
    """Requirement for flask_login."""

    return User.query.get(user_id)


class Search_Result(Resource):
    def get(self):
        """Job searching from database."""

        ### TODO: if login user ###

        keyword = request.args.get('keyword')
        search_result = Job.query.filter(Job.description.ilike(f'%{keyword}%')).all()
        results = []
        for job in search_result:
            results.append(job.get_attributes())

        return jsonify(results)

api.add_resource(Search_Result, '/search')


class Job_Detail(Resource):
    def get(self):
        """Job detail from database."""

        key = request.args.get('key')
        job = Job.query.get(key)

        return jsonify(job.get_attributes())

api.add_resource(Job_Detail, '/jobs')



# class Job_Tags(Resource):
#     def get(self):
#         """Job tagbs from database."""

#         key = request.args.get('key')
#         job_tag = []
#         tags_list = Tag.query.filter()

#         return jsonify(job.get_attributes())

# api.add_resource(Job_Tags, '/jobs')


@app.route("/")
def index():
    """Homepage."""

    return render_template("homepage.html")


# @app.route("/job/<int:job_id>", methods=['GET'])
# def job_detail(job_id):
#     """Show info about job."""

#     job = Job.query.get(job_id)
#     job_info = job.get_attributes()

#     return render_template("job_detail.html", job=job_info)


@app.route("/myboard")
def view_my_dashboard():

    return render_template("myboard.html")


@app.route('/user/login', methods=['GET', 'POST'])
def login():
    """Display login form and handle logging in user."""

    if current_user.is_authenticated:
        return redirect("/myboard")

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')

        user = User.query.filter(User.email == email).first()

        if user and user.is_password(password):
            # user.is_authenticated = True
            login_user(user)

            return redirect("/myboard")

    return render_template('login.html')


# @app.route("/search.json")
# def get_search_result_json():
#     """Job searching from database."""

#     keyword = request.args.get('keyword')
#     search_result = Job.query.filter(Job.description.ilike(f'%{keyword}%')).all()

#     results = {}
#     for job in search_result:
#         job_id = job.get_job_id()
#         results[job_id]= job.get_attributes()

#     return jsonify(results)


@app.route('/signup', methods=['GET'])
def sign_up():
    """Show form for user signup."""

    return render_template("signup.html")


@app.route('/register', methods=['POST'])
def register():
    """Register a user."""

    email = request.form["email"]
    password = request.form["password"]
    zipcode = request.form["zipcode"]

    new_user = User(email=email, password=password, zipcode=zipcode)

    db.session.add(new_user)
    db.session.commit()

    return redirect('/user/login')


@app.route("/user/<int:user_id>", methods=['GET'])
def user_detail(user_id):
    """Show info about user."""

    user = User.query.get(user_id)

    return render_template("user.html", user=user)


# @app.route("/select_tag", methods=['POST'])
# def select_tag_process():
#     """Process tag selection."""

#     user_id = session["user_id"]
#     user = User.query.get(user_id)

#     tag_list = []
#     tag_list.append(request.form.get("language"))
#     tag_list.append(request.form.get("framework"))
#     tag_list.append(request.form.get("database"))
#     tag_list.append(request.form.get("platform"))

#     # Improvement needed: only add user_tag if the tag has not been added to this user. 
#     for tag in tag_list:
#         tag = Tag.query.filter(Tag.tag_name == tag).one()
#         user_tag = UserTag(user_id=user.user_id, tag_id=tag.tag_id)
#         db.session.add(user_tag)
#     db.session.commit()

#     flash(f"User {tag} added.")
#     return redirect(f"/user/{user.user_id}")


@app.route('/logout')
def logout():
    logout_user()
    return redirect("/")



if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension

    # Do not debug for demo
    app.debug = False

    connect_to_db(app)

    # Use the DebugToolbar
    DebugToolbarExtension(app)

    app.run(host="0.0.0.0")
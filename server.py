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
def load_user(id):
    """Requirement for flask_login."""

    return User.query.get(id)



################# FLASK-RESTFUL API #################


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


class Job_Tags(Resource):
    def get(self):
        """Job tags from database."""

        key = request.args.get('key')
        search_result = JobTag.query.filter(JobTag.job_id == f'{key}').all()
        results = []
        
        for tag in search_result:
            results.append(tag.get_tag_name())

        return jsonify(results)

api.add_resource(Job_Tags, '/tags')


class User_Jobs(Resource):
    def get(self):
        """User jobs from database."""

        key = current_user.get_id()
        search_result = UserJob.query.filter(UserJob.user_id == f'{key}').all()
        results = []
        
        for user_job in search_result:
            results.append(user_job.to_job.get_attributes())

        return jsonify(results)

api.add_resource(User_Jobs, '/userjobs')



################# WEB ROUTES #################

@app.route("/")
def index():
    """Homepage."""

    return render_template("homepage.html")


@app.route('/login', methods=['GET', 'POST'])
def login():
    """Display login form and handle logging in user."""

    if request.method == 'POST':
        email = request.form.get('email')
        password = request.form.get('password')
        user = User.query.filter(User.email == email).first()

        if user:
            if user.check_password(password):
                login_user(user)
                return redirect(f'/user/{user.id}')
        
        else:
                return redirect('/signup')

    return render_template('login.html')


@app.route('/signup', methods=['GET', 'POST'])
def sign_up():
    """Show form for user signup."""

    if request.method == 'POST':
        email = request.form['email']
        password = request.form['password']
        user = User.query.filter(User.email == email).first()

        if user:
            return redirect('/login')
        
        else:
            new_user = User(email, password)
            db.session.add(new_user)
            db.session.commit()
            return redirect('/login')

    return render_template('signup.html')


@app.route('/user/<int:id>', methods=['GET'])
def user_detail(id):
    """Show info about user."""

    user = User.query.get(id)
    return render_template('user.html', user=user)


@app.route('/api/userjobs', methods=['POST'])
@login_required
def save_job():
    """Update database when user saves a job."""

    # check if user is a login user
    # only login user can save jobs
    if current_user.is_active:

        user_id = current_user.get_id()
        job_id = request.form.get('job_id')

        # check if user has already saved this job
        # only add unsaved job to database
        if UserJob.query.filter((UserJob.user_id == user_id)&(UserJob.job_id == job_id)).first(): 
            message = 'You have saved this job already.'

        else:
            new_user_job = UserJob(user_id, job_id)
            db.session.add(new_user_job)
            db.session.commit()
            message = 'Job added succesfully'

    else:
        message = 'Please login to save this job.'

    return message


@app.route('/api/remove', methods=['DELETE'])
@login_required
def remove_job():
    """Delete a user saved job from user_jobs table."""

    # check if user is a login user
    # only login user can save jobs
    if current_user.is_active:

        user_id = current_user.get_id()
        job_id = request.form.get('job_id')

        # check if user has already saved this job
        # only add unsaved job to database
        if UserJob.query.filter((UserJob.user_id == user_id)&(UserJob.job_id == job_id)).first(): 
            UserJob.query.filter((UserJob.user_id == user_id)&(UserJob.job_id == job_id)).delete()
            db.session.commit()
            message = 'Job removed succesfully.'

            print('removed')

        else:
            print('Job not found')

    else:
        message = 'Please login first.'
        print('unlogin')
    
    return message


# @app.route('/api/user_status', methods=['GET'])
# def is_active():
#     """Check whether the user is a login user."""

#     return jsonify(current_user.is_active)



@app.route('/myjobs', methods=['GET'])
@login_required
def view_my_dashboard():

    return render_template('myjobs.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect("/")


if __name__ == "__main__":
    app.debug = True
    connect_to_db(app)
    DebugToolbarExtension(app)
    app.run(host="0.0.0.0")
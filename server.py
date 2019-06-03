from jinja2 import StrictUndefined
from flask import Flask, render_template, abort, make_response, request, flash, redirect, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from model import connect_to_db, db, Job, User, Tag, JobTag, UserJob, Log, Company
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

api.add_resource(Search_Result, '/searching')


class Show_Detail(Resource):
    def get(self):
        """Job searching from database."""

        key = request.args.get('key')
        single_job = Job.query.filter(Job.job_id == f'{key}').one()
        results = []
        
        results.append(single_job.get_attributes())

        return jsonify(results)

api.add_resource(Show_Detail, '/jobdetail')


class Job_Tags(Resource):
    def get(self):
        """Job tags from database."""

        key = request.args.get('key')
        # TODO: SQL injection 
        # user_input = request.get('whatever')
        # sql_statement = "select * from wwhere FIELD == INPUT"
        #
        # Bad user }:)
        # user_input = "ios; drop table user; --"
        # TODO: @tess follow up with this and send an article :)
        #
        # sql_statement.prepare(user_input)
        # auto wrap the user stuff to make your query safe :)
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
            results.append([user_job.to_job.get_attributes(), user_job.status, user_job.user_job_id])

        return jsonify(results)

api.add_resource(User_Jobs, '/userjobs')


class Tracking_Board(Resource):
    def get(self):
        """User jobs from database."""

        key = current_user.get_id()
        status = request.args.get('status')

        search_result = UserJob.query.filter((UserJob.user_id == f'{key}') & (UserJob.status == status)).all()
        results = []
        
        for user_job in search_result:
            results.append(user_job.get_card_attributes())

        return jsonify(results)

api.add_resource(Tracking_Board, '/tracking')


class Logs(Resource):
    def get(self):
        """User jobs from database."""

        user_job_id = request.args.get('user_job_id')

        search_result = Log.query.filter(Log.user_job_id == f'{user_job_id}').all()
        results = []
        
        for log in search_result:
            results.append(log.get_log_attributes())

        return jsonify(results)

api.add_resource(Logs, '/logs')


# class User_Status(Resource):
#     def get(self):
#         """Check whether the user is a login user."""

#         return (current_user.is_active).ToString()

# api.add_resource(User_Status, '/userstatus')


################# WEB ROUTES #################

@app.route("/")
def index():
    """Homepage."""

    return render_template("home.html")

@app.route("/search")
def search():
    """Search page."""

    return render_template("search.html")


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


# @app.route('/job/<int:job_id>', methods=['GET'])
# def job_detail(job_id):
#     """Show info about job."""

#     job = Job.query.get(job_id)
#     return render_template('jobdetail.html')


@app.route('/api/userjobs', methods=['POST'])
@login_required
def save_job():
    """Update database when user saves a job."""

    # check if user is a login user
    # only login user can save jobs
    
    # include guard? Guarding statements? Todo Tess find google blog post about this

    # other methods: if current_user is valid/is able to modify this
    # if not return
    # 
    # now I'm here user is AOK to go

    if not current_user.is_active:
        return 'Please login to save this job.'


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
    
    return 'Job Saved.'

   
@app.route('/api/log', methods=['POST'])
@login_required
def save_log():
    """Update database when application status has changed or a log has been added."""

    if not current_user.is_active:
        return 'Please login first.'

    user_job_id = request.form.get('user_job_id')
    log = request.form.get('log')

    new_log = Log(user_job_id, log)

    db.session.add(new_log)
    db.session.commit()
    message = 'Log added succesfully'
    
    return 'Log Added.'


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


@app.route('/api/changestatus', methods=['POST'])
@login_required
def update_application_status():
    """Change the status of a saved job."""

    user_job_id = request.form.get('user_job_id')
    new_status = request.form.get('new_status')

    if UserJob.query.filter(UserJob.user_job_id == user_job_id).first(): 
        user_job = UserJob.query.filter(UserJob.user_job_id == user_job_id).first()

        user_job.status = new_status
        db.session.commit()

    return 'Status Updated.'


@app.route('/api/addjob', methods=['POST'])
@login_required
def add_job():
    """Add job."""

    if request.method == 'POST':
        title = request.form.get('title')
        company_name = request.form.get('company_name')
        description = request.form.get('description')
        apply_url = request.form.get('apply_url')

        print("")
        print(title)
        print(company_name)
        print(apply_url)
        print("")
        
        if company_name:

            if Company.query.filter(Company.company_name == company_name).first():
                company = Company.query.filter(Company.company_name == company_name).first()
                company_id = company.company_id
        
            else:
                new_company = Company(company_name, is_private='t')
                db.session.add(new_company)
                db.session.commit()

                print("")
                print("company added")
                print("")
        
                company = Company.query.filter(Company.company_name == company_name).one()
                company_id = company.company_id

                print(company_id)
                print("")

        new_job = Job(title, company_id, description, apply_url, is_private='t')
        db.session.add(new_job)
        db.session.commit()

        the_job = Job.query.filter((Job.title == title) & (Job.is_private == 't')).one()
        job_id = the_job.job_id

        user_id = current_user.get_id()
        status = "Applied"
        new_user_job = UserJob(user_id, job_id, status)
        db.session.add(new_user_job)
        db.session.commit()

        return "User Job Added."



# @app.route('/api/user_status', methods=['GET'])
# def is_active():
#     """Check whether the user is a login user."""

#     return jsonify(current_user.is_active)



@app.route('/myjobs', methods=['GET'])
@login_required
def view_my_saved_jobs():

    return render_template('myjobs.html')


@app.route('/myboard', methods=['GET'])
@login_required
def view_my_dashboard():

    return render_template('myboard.html')


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
from jinja2 import StrictUndefined
from flask import Flask, render_template, abort, make_response, request, flash, redirect, jsonify
from flask_debugtoolbar import DebugToolbarExtension
from model import connect_to_db, db, Job, User, Tag, JobTag, UserJob, Note, Company
from flask_login import LoginManager, login_user, login_required, current_user, logout_user
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
api = Api(app) 
CORS(app)

# Required to use Flask sessions and the debug toolbar
app.secret_key = 'TEMPKEY'

# Raise an error if an undefined variable is in use.
app.jinja_env.undefined = StrictUndefined

# Configuration for login handling
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

@login_manager.user_loader
def load_user(id):
    """Requirement for flask_login."""

    return User.query.get(id)



################# API #################


class Search(Resource):
    def get(self):
        """Job searching from database."""

        key = request.args.get('key')

        # TODO: add a condition keywork must not be empty
        search_result = Job.query.filter((Job.description.ilike(f'%{key}%')) & (Job.is_private == 'f')).all()
        results = []
        for job in search_result:
            results.append(job.get_attributes())

        return jsonify(results)

api.add_resource(Search, '/api/search')


class Job_Detail(Resource):
    def get(self):
        """Public job post detail from database."""

        key = request.args.get('key')
        job = Job.query.filter(Job.job_id == key).one()
        results = []
        
        results.append(job.get_detail_info())

        return jsonify(results)

api.add_resource(Job_Detail, '/api/jobdetail')


class Job_Tags(Resource):
    def get(self):
        """Job tags from database."""

        key = request.args.get('key')
        search_result = JobTag.query.filter(JobTag.job_id == key).all()
        results = []
        
        for tag in search_result:
            results.append(tag.get_tag_name())

        return jsonify(results)

api.add_resource(Job_Tags, '/api/tags')


class User_Jobs(Resource):
    def get(self):
        """User jobs from database."""

        if not current_user.is_active:
            return 'No permission.'

        key = current_user.get_id()
        search_result = UserJob.query.filter(UserJob.user_id == key).all()
        results = []

        for user_job in search_result:
            results.append(user_job.get_saved_job_attributes())

        return jsonify(results)
    
    def post(self):
        """Update database when user saves a job."""

        if not current_user.is_active:
            return 'No permission.'
            
        key1 = current_user.get_id()
        key2 = request.form.get('key')

        if UserJob.query.filter((UserJob.user_id == key1)&(UserJob.job_id == key2)).first(): 
            message = 'You have saved this job already.'

        else:
            new_user_job = UserJob(key1, key2)
            db.session.add(new_user_job)
            db.session.commit()
            message = 'Job added succesfully'
        
        return 'Job Saved.'

    def delete(self):
        """Delete a user saved job from user_jobs table."""

        if not current_user.is_active:
            return 'No permission.'

        key1 = current_user.get_id()
        key2 = request.form.get('key')

        if UserJob.query.filter((UserJob.user_id == key1)&(UserJob.job_id == key2)).first(): 
            UserJob.query.filter((UserJob.user_id == key1)&(UserJob.job_id == key2)).delete()
            db.session.commit()
            message = 'Job removed succesfully.'
        else:
            print('Job not found')

        return message

api.add_resource(User_Jobs, '/api/userjobs')


class User_Job_Detail(Resource):
    def get(self):
        """Job post detail from database include user comments."""
        
        if not current_user.is_active:
            return 'No permission.'

        key = request.args.get('key')
        user_job = UserJob.query.filter(UserJob.user_job_id == f'{key}').one()
        results = []
        
        results.append(user_job.to_job.get_detail_info())

        print('')
        print(results)
        print('')

        return jsonify(results)
    
    def post(self):
        """Change the status of a saved job."""

        if not current_user.is_active:
            return 'No permission.'

        key1 = request.form.get('key1')
        key2 = request.form.get('key2')

        if UserJob.query.filter(UserJob.user_job_id == key1).first(): 
            user_job = UserJob.query.filter(UserJob.user_job_id == key1).first()

            user_job.status = key2
            db.session.commit()

        return 'Status Updated.'

api.add_resource(User_Job_Detail, '/api/userjobdetail')


class User_Job_Notes(Resource):
    def get(self):
        """User notes from database."""

        if not current_user.is_active:
            return 'No permission.'

        key = request.args.get('key')
        search_result = Note.query.filter(Note.user_job_id == key).all()
        results = []
        
        for note in search_result:
            results.append(note.get_note_attributes())

        return jsonify(results)

    def post(self):
        if not current_user.is_active:
            return 'No permission.'

        key1 = request.form.get('key1')
        key2 = request.form.get('key2')
        new_note = Note(key1, key2)

        db.session.add(new_note)
        db.session.commit()
        message = 'Note added succesfully'
        
        return 'Note Added.'

api.add_resource(User_Job_Notes, '/api/notes')


class Private_Job(Resource):
    def post(delf):
        """Adda private job."""

        if not current_user.is_active:
            return 'Please login first.'

        key1 = request.form.get('key1')
        key2 = request.form.get('key2')
        key3 = request.form.get('key3')
        key4 = request.form.get('key4')

        company_id = None
        job_id = None

        if Company.query.filter(Company.company_name == key2).first():
            company = Company.query.filter(Company.company_name == key2).first()
            company_id = company.company_id
        else:
            new_company = Company(key2, is_private='t')
            db.session.add(new_company)
            db.session.commit()

            company = Company.query.filter(Company.company_name == key2).one()
            company_id = company.company_id
        
        if Job.query.filter((Job.title == key1) & (Job.description == key3) & (Job.company_id == company_id) & (Job.is_private == 't')).first():
            the_job = Job.query.filter((Job.title == key1) & (Job.description == key3) & (Job.company_id == company_id) & (Job.is_private == 't')).first()
            job_id = the_job.job_id
        else:
            new_job = Job(key1, company_id, key3, key4, is_private='t')
            db.session.add(new_job)
            db.session.commit()
            
            the_job = Job.query.filter((Job.title == key1) & (Job.description == key3) & (Job.company_id == company_id) & (Job.is_private == 't')).first()
            job_id = the_job.job_id

        user_id = current_user.get_id()
        status = 'Applied'

        new_user_job = UserJob(user_id, job_id, status)
        db.session.add(new_user_job)
        db.session.commit()

        return 'User Job Added.'

api.add_resource(Private_Job, '/api/privatejob')


class Track(Resource):
    def get(self):
        """User jobs from database."""

        if not current_user.is_active:
            return 'No permission.'

        key1 = current_user.get_id()
        key2 = request.args.get('key')

        search_result = UserJob.query.filter((UserJob.user_id == key1) & (UserJob.status == key2)).all()
        results = []
        
        for user_job in search_result:
            results.append(user_job.get_saved_job_attributes())

        return jsonify(results)

api.add_resource(Track, '/api/track')




################# WEB ROUTES #################

@app.route('/')
def index():
    """Homepage."""

    return render_template('home.html')

@app.route('/jobs')
def search_job():
    """Search page."""

    return render_template('search.html')

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
                return redirect('/myboard')
        
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


@app.route('/myjobs')
@login_required
def view_my_saved_jobs():

    return render_template('myjobs.html')


@app.route('/myboard')
@login_required
def view_my_dashboard():

    return render_template('myboard.html')


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect('/')


if __name__ == '__main__':
    app.debug = True
    connect_to_db(app)
    DebugToolbarExtension(app)
    app.run(host='0.0.0.0')
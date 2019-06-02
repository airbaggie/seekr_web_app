from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

db = SQLAlchemy()


class Job(db.Model):
    """Job on the website."""

    __tablename__ = "jobs"

    job_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    unique_key = db.Column(db.String(20), nullable=True)
    title = db.Column(db.String(120), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), nullable=True)
    apply_url = db.Column(db.String(200), nullable=True)
    description = db.Column(db.String(20000), nullable=True)
    indeed_url = db.Column(db.String(200), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Define relationships
    to_user = db.relationship("User", secondary="user_jobs")
    to_tag = db.relationship("JobTag")
    to_userjob = db.relationship("UserJob")
    to_comment = db.relationship("Comment", secondary="user_jobs")
    to_company = db.relationship("Company")

    def __repr__(self):
        """Provide helpful representation when printed."""

        return f"<Job job_id={self.job_id} title={self.title} company={self.to_company.company}>"

    def __init__(self, title, company_id=None, unique_key=None, apply_url=None, description=None, indeed_url=None):
        """Instantiate a Job."""
        # Instantiate a job instance when user is manully adding a job info on his/her tracking board.

        self.unique_key = unique_key
        self.title = title
        self.company_id = company_id
        self.apply_url = apply_url
        self.description = description
        self.indeed_url = indeed_url
    
    def get_attributes(self):
        """Return a dictionary representation of a job."""

        return {
                "job_id": self.job_id,
                "title": self.title,
                "company_name": self.to_company.company_name,
                "apply_url": self.apply_url,
                "description": self.description,
                "rating": self.to_company.rating,
                "lat": self.to_company.lat,
                "lng": self.to_company.lng,
                }
    
    def get_job_tags(self):
        # need to add tag list query
        pass
        
        
class User(UserMixin, db.Model):
    """User of the website."""

    __tablename__ = "users"

    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_name = db.Column(db.String(50), nullable=True)
    email = db.Column(db.String(50), nullable=False)
    pw_hash = db.Column(db.String(256), nullable=False)
    zipcode = db.Column(db.String(50), nullable=True)
    create_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    avatar_id = db.Column(db.Integer, db.ForeignKey('avatars.avatar_id'), nullable=True)
    
    # Define relationships
    to_tag = db.relationship("UserTag")
    to_job = db.relationship("Job", secondary="user_jobs")
    to_userjob = db.relationship("UserJob")
    to_comment = db.relationship("Comment", secondary="user_jobs")
    to_avatar = db.relationship("Avatar")


    def __repr__(self):
        """Provide helpful representation when printed."""

        return f"<User id={self.id} email={self.email} zipcode={self.zipcode}>"

    def __init__(self, email, password):
        """Instantiate a User."""

        self.email = email
        self.set_password(password)

    def set_password(self, password):
        """Set user password."""

        self.pw_hash = generate_password_hash(password)

    def check_password(self, password):
        """Return true if stored password matches hash of given password."""

        return check_password_hash(self.pw_hash, password)

    

class Tag(db.Model):
    """Available tag/keywords for a job post and user profile."""

    __tablename__ = "tags"

    tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    tag_type = db.Column(db.String(50), nullable=False)
    tag_name = db.Column(db.String(50), nullable=False)

    # Define relationships
    to_job = db.relationship("Job", secondary="job_tags")
    to_user = db.relationship("User", secondary="user_tags")

    ### options of tag_type ###
    # "language", "framework", "database", "platform"
    # the type of "framwork" contains frameworks, libraries and tools

    def __repr__(self):
        """Provide helpful representation when printed."""

        return f"<Tag tag_id={self.tag_id} tag_type={self.tag_type} tag_name={self.tag_name}>"


class JobTag(db.Model):
    """Associate table which connects jobs and tags tables. Tag/keyword of a job."""

    __tablename__ = "job_tags"

    job_tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), nullable=False)

    to_job = db.relationship("Job")
    to_tag = db.relationship("Tag")

    def __repr__(self):
        """Provide helpful representation when printed."""

        return f"<JobTag job_tag_id={self.job_tag_id} title={self.to_job.title} tag_name={self.to_tag.tag_name}>"

    def get_tag_name(self):

        return self.to_tag.tag_name


class UserTag(db.Model):
    """Associate table which connects users and tags tables. Tag/keyword of a user."""

    __tablename__ = "user_tags"

    user_tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), nullable=False)

    # Define relationships
    to_user = db.relationship("User")
    to_tag = db.relationship("Tag")

    def __repr__(self):
        """Provide helpful representation when printed."""

        return f"<UserTag email={self.to_user.email} tag_name={self.to_tag.tag_name}>"


class UserJob(db.Model):
    """Tracking info of jobs that saved by a user."""

    __tablename__ = "user_jobs"

    user_job_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), nullable=False)
    status = db.Column(db.String(50), nullable=False, default = "Saved")
    decision = db.Column(db.String(50), nullable=False, default = "Unknown")
    save_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    # Define relationships
    to_user = db.relationship("User")
    to_job = db.relationship("Job")
    to_comment = db.relationship("Comment")

    # Status: 
    #   Saved / Applied / Online assessment / Phone screen / On-site / Decision made
    # Decisions: 
    #   Unknown / Closed / Withdrawn / Offered / Unselected

    def __init__(self, user_id, job_id):
        """Instantiate a UserJob."""

        self.user_id = user_id
        self.job_id = job_id

    def get_card_attributes(self):
        """Return a dictionary representation of a job."""

        return {
                "job_id": self.to_job.job_id,
                "title": self.to_job.title,
                "company_name": self.to_job.to_company.company_name,
                "status": self.status,
                }


class Comment(db.Model):
    """Comment of a job application."""

    __tablename__ = "comments"

    comment_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_job_id = db.Column(db.Integer, db.ForeignKey('user_jobs.user_job_id'), nullable=False)
    comment = db.Column(db.String(20000), nullable=False)
    comment_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    # Define relationships
    to_userjob = db.relationship("UserJob")
    to_user = db.relationship("User", secondary="user_jobs")
    to_job = db.relationship("Job", secondary="user_jobs")


class Company(db.Model):
    """Additional info of a company."""

    __tablename__ = "companies"

    company_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=True)

    # Use Google Places API to get below info
    address = db.Column(db.String(200), nullable=True)
    lat = db.Column(db.Float, nullable=True)
    lng = db.Column(db.Float, nullable=True)
    rating = db.Column(db.Float, nullable=True)

    # Define relationships
    to_jobs = db.relationship("Job")


class Avatar(db.Model):
    """Image url of a user avatar."""

    __tablename__ = "avatars"

    avatar_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    avatar = db.Column(db.String(200), nullable=False)


##############################################################################
# Helper functions

def connect_to_db(app):
    """Connect the database to the Flask app."""

    # Configure to use PostgreSQL database
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql:///soft'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['SQLALCHEMY_ECHO'] = True
    db.app = app
    db.init_app(app)

def create_tables():
    db.create_all()


if __name__ == "__main__":
    # Leave a state of being able to work with the soft database,
    # if run this module interactively.

    from server import app

    connect_to_db(app)
    print("Connected to DB.")
    create_tables()
    print("Tables created.")

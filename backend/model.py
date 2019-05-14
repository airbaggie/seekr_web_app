from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()


class Job(db.Model):
    """Job on the website."""

    __tablename__ = "jobs"

    job_id = db.Column(db.String(20), primary_key=True)
    title = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    apply_url = db.Column(db.String(200), nullable=False)
    is_active = db.Column(db.Boolean, nullable=False, default=True)
    description = db.Column(db.String(20000),nullable=False)
    indeed_url = db.Column(db.String(200), nullable=False)
    create_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    # Define relationships
    to_user = db.relationship("User", secondary="user_jobs")
    to_tag = db.relationship("Tag", secondary="job_tags")


class User(db.Model):
    """User of the website."""

    __tablename__ = "users"

    user_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_name = db.Column(db.String(50), nullable=False)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(20), nullable=False)
    zipcode = db.Column(db.String(50), nullable=True)
    is_googler = db.Column(db.Boolean, nullable=False, default=False)
    create_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)
    avatar_id = db.Column(db.Integer, db.ForeignKey('avatars.avatar_id'), nullable=False, default=1, index=True)

    # Define relationships
    to_tag = db.relationship("Tag", secondary="user_tags")
    to_job = db.relationship("Job", secondary="user_jobs")
    to_userjob = db.relationship("UserJob")
    to_comment = db.relationship("Comment", secondary="user_jobs")
    to_avatar = db.relationship("Avatar")
    to_extjob = db.relationship("ExtJob")


class Tag(db.Model):
    """Available tag/keywords for a job post and user profile."""

    __tablename__ = "tags"

    tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    tag_type = db.Column(db.String(50), nullable=False)
    tag_name = db.Column(db.String(50), nullable=False)

    ### options of tag_type ###
    # "language", "framework", "database", "platform"
    # the type of "framwork" contains frameworks, libraries and tools

    to_job = db.relationship("Job", secondary="job_tags")
    to_user = db.relationship("User", secondary="user_tags")


class JobTag(db.Model):
    """Associate table which connects jobs and tags tables. Tag/keyword of a job."""

    __tablename__ = "job_tags"

    job_tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    job_id = db.Column(db.String(20), db.ForeignKey('jobs.job_id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), nullable=False)


class UserTag(db.Model):
    """Associate table which connects users and tags tables. Tag/keyword of a user."""

    __tablename__ = "user_tags"

    user_tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), nullable=False)


class UserJob(db.Model):
    """Tracking info of jobs that saved by a user."""

    __tablename__ = "user_jobs"

    user_job_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False, index=True)
    job_id = db.Column(db.String(20), db.ForeignKey('jobs.job_id'), nullable=False, index=True)
    status = db.Column(db.String(50), nullable=False)
    decision = db.Column(db.String(50), nullable=False)
    calendar_available = db.Column(db.Boolean, nullable=False, default=False)
    save_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    ### options of status ###
    # "saved", "applied", "phone-screen scheduled", "phone-screen completed", 
    # "on-site scheduled", "on-site completed", "decision made"

    ### options of decision ###
    # "unknown", "unselected", "closed", "withdrawn", "offered"

    to_user = db.relationship("User")
    to_job = db.relationship("Job")
    to_comment = db.relationship("Comment")


class Comment(db.Model):
    """Comment of a job application by a user."""

    __tablename__ = "comments"

    comment_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_job_id = db.Column(db.Integer, db.ForeignKey('user_jobs.user_job_id'), nullable=False, index=True)
    ext_job_id = db.Column(db.Integer, db.ForeignKey('ext_jobs.ext_job_id'), nullable=False, index=True)
    comment = db.Column(db.String(20000), nullable=False)
    comment_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    to_userjob = db.relationship("UserJob")
    to_user = db.relationship("User", secondary="user_jobs")
    to_job = db.relationship("Job", secondary="user_jobs")
    to_extjob = db.relationship("ExtJob")


class Company(db.Model):
    """Additional info of a company."""

    __tablename__ = "companies"

    company_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    company = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=False)
    rating = db.Column(db.Float, nullable=True)

    # to_jobs = db.relationship("Job")
    # Traceback: Can't find any foreign key relationships between 'companies' and 'jobs'


class ExtJob(db.Model):
    """Info of a job which was saved from other job websites by a user."""

    __tablename__ = "ext_jobs"

    ext_job_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False, index=True)
    title = db.Column(db.String(120), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    url = db.Column(db.String(200), nullable=False)
    description = db.Column(db.String(20000),nullable=False)
    status = db.Column(db.String(50), nullable=False)
    decision = db.Column(db.String(50), nullable=False)
    calendar_available = db.Column(db.Boolean, nullable=False, default=False)
    save_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    to_user = db.relationship("User")
    to_comment = db.relationship("Comment")


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


if __name__ == "__main__":
    # Leave a state of being able to work with the soft database,
    # if run this module interactively.

    from server import app

    connect_to_db(app)
    print("Connected to DB.")


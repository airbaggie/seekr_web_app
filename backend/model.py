from flask_sqlalchemy import SQLAlchemy
import datetime

db = SQLAlchemy()


class Job(db.Model):
    """Job on the website."""

    __tablename__ = "jobs"

    job_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    unique_key = db.Column(db.String(20), nullable=True)
    title = db.Column(db.String(120), nullable=False)
    company_id = db.Column(db.Integer, db.ForeignKey('companies.company_id'), nullable=True)
    location = db.Column(db.String(100), nullable=True)
    apply_url = db.Column(db.String(200), nullable=True)
    is_active = db.Column(db.Boolean, default=True)
    description = db.Column(db.String(20000), nullable=True)
    indeed_url = db.Column(db.String(200), nullable=True)
    create_date = db.Column(db.DateTime, default=datetime.datetime.utcnow)

    # Define relationships
    to_user = db.relationship("User", secondary="user_jobs")
    to_tag = db.relationship("JobTag")
    to_userjob = db.relationship("UserJob")
    to_comment = db.relationship("Comment", secondary="user_jobs")
    to_company = db.relationship("Company")


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
    avatar_id = db.Column(db.Integer, db.ForeignKey('avatars.avatar_id'), nullable=False, default=1)

    # Define relationships
    to_tag = db.relationship("UserTag")
    to_job = db.relationship("Job", secondary="user_jobs")
    to_userjob = db.relationship("UserJob")
    to_comment = db.relationship("Comment", secondary="user_jobs")
    to_avatar = db.relationship("Avatar")


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


class JobTag(db.Model):
    """Associate table which connects jobs and tags tables. Tag/keyword of a job."""

    __tablename__ = "job_tags"

    job_tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), nullable=False)

    to_job = db.relationship("Job")
    to_tag = db.relationship("Tag")


class UserTag(db.Model):
    """Associate table which connects users and tags tables. Tag/keyword of a user."""

    __tablename__ = "user_tags"

    user_tag_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    tag_id = db.Column(db.Integer, db.ForeignKey('tags.tag_id'), nullable=False)

    # Define relationships
    to_user = db.relationship("User")
    to_tag = db.relationship("Tag")


class UserJob(db.Model):
    """Tracking info of jobs that saved by a user."""

    __tablename__ = "user_jobs"

    user_job_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.user_id'), nullable=False)
    job_id = db.Column(db.Integer, db.ForeignKey('jobs.job_id'), nullable=False)
    status_id = db.Column(db.Integer, db.ForeignKey('statuses.status_id'), nullable=False, default = 1)
    decision_id = db.Column(db.Integer, db.ForeignKey('decisions.decision_id'), nullable=False, default = 1)
    calendar_available = db.Column(db.Boolean, nullable=False, default=False)
    save_date = db.Column(db.DateTime, nullable=False, default=datetime.datetime.utcnow)

    # Define relationships
    to_user = db.relationship("User")
    to_job = db.relationship("Job")
    to_comment = db.relationship("Comment")
    to_status = db.relationship("Status")
    to_decision = db.relationship("Decision")


class Status(db.Model):
    """List of job statuses."""

    __tablename__ = "statuses"

    status_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    status = db.Column(db.String(50), nullable=False)


class Decision(db.Model):
    """List of job decisions."""

    __tablename__ = "decisions"

    decision_id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    decision = db.Column(db.String(50), nullable=False)


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
    company = db.Column(db.String(100), nullable=False)
    address = db.Column(db.String(200), nullable=True)
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


if __name__ == "__main__":
    # Leave a state of being able to work with the soft database,
    # if run this module interactively.

    from server import app

    connect_to_db(app)
    print("Connected to DB.")

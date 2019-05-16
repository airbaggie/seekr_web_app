from sqlalchemy import func, exists
from model import Job, Tag, JobTag, Company, Status, Decision, connect_to_db, db
from server import app
import json
import datetime


def load_companies():
    """Load companies from jobs.json into database."""
   
    job_dict = json.load(open('seed_data/jobs.json'))

    for j in job_dict:
        comp = job_dict[j]['company']
        # is_exist = db.session.query(exists().where(Company.company == comp))
        is_exist = db.session.query(Company.query.filter(Company.company == comp).exists()).scalar()

        if is_exist:
            continue
        else:
            company = Company(company=comp)
            db.session.add(company)
    
    db.session.commit()

    print("Companies loaded.")


def load_jobs():
    """Load jobs from jobs.json into database."""

    #  Read jobs.json file and insert data
    job_dict = json.load(open('seed_data/jobs.json'))

    for j in job_dict:

        is_exist = db.session.query(Job.query.filter(Job.unique_key == j).exists()).scalar()

        if is_exist:
            continue
        else:
            comp = job_dict[j]['company']
            c_id = db.session.query(Company.company_id).filter(Company.company == comp)
            job = Job(unique_key=j,
                    title=job_dict[j]['title'],
                    company_id=c_id,
                    location=job_dict[j]['location'],
                    apply_url=job_dict[j]['apply_url'],
                    description=job_dict[j]['description'],
                    indeed_url=job_dict[j]['indeed_url'])
            db.session.add(job)

    db.session.commit()

    print("Jobs loaded.")


def load_job_tags():
    """Load job tags from jobs.json into database."""

    job_dict = json.load(open('seed_data/jobs.json'))

    for j in job_dict:
        j_id = db.session.query(Job.job_id).filter(Job.unique_key == j)
        tags_list = job_dict[j]["tags"]
        for t in tags_list:
            t_id = db.session.query(Tag.tag_id).filter(Tag.tag_name == t)
            jobtag = JobTag(job_id=j_id, tag_id=t_id)

            db.session.add(jobtag)

    db.session.commit()

    print("Job tags loaded.")


def load_tags():
    """Load tags from static.tag into database."""

    Tag.query.delete()
    
    for i, row in enumerate(open("seed_data/static.tag")):
        row = row.rstrip()
        tag_id, tag_type, tag_name = row.split("|")

        tag = Tag(tag_id=tag_id,
                  tag_type=tag_type,
                  tag_name=tag_name)

        db.session.add(tag)

    db.session.commit()

    print("Tags loaded.")


def load_statuses():
    """Load statuses from static.status into database."""

    Status.query.delete()

    for i, row in enumerate(open("seed_data/static.status")):
        row = row.rstrip()
        status_id, status = row.split("|")

        status = Status(status_id=status_id, status=status)

        db.session.add(status)

    db.session.commit()

    print("Statuses loaded.")


def load_decisions():
    """Load decisions from static.decision into database."""

    Decision.query.delete()

    for i, row in enumerate(open("seed_data/static.decision")):
        row = row.rstrip()
        decision_id, decision = row.split("|")

        decision = Decision(decision_id=decision_id, decision=decision)

        db.session.add(decision)

    db.session.commit()

    print("Decisions loaded.")


def set_val_job_id():
    """Set value for the next job_id after seeding database"""

    # Get the Max job_id in the database
    result = db.session.query(func.max(Job.job_id)).one()
    max_id = int(result[0])

    # Set the value for the next job_id to be max_id + 1
    query = "SELECT setval('jobs_job_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()


if __name__ == "__main__":
    connect_to_db(app)

    # In case tables haven't been created, create them
    db.create_all()

    # Import different types of data

    load_tags()
    load_statuses()
    load_decisions()
    load_companies()
    load_jobs()
    load_job_tags()
    set_val_job_id()

    
### Seed existing database with more job posts. ###

from sqlalchemy import func, exists
from model import Job, Tag, JobTag, Company, connect_to_db, db
from server import app
import json
import datetime


def add_companies():
    """Load companies from jobs.json into database."""
   
    job_dict = json.load(open('seed_data/jobs.json'))

    for j in job_dict:
        comp = job_dict[j]['company']
        is_exist = db.session.query(Company.query.filter(Company.company_name == comp).exists()).scalar()

        if is_exist:
            continue
        else:
            company = Company(company_name=comp, location=job_dict[j]['location'])
            db.session.add(company)
    
    db.session.commit()

    print("Companies added.")


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
            c_id = db.session.query(Company.company_id).filter(Company.company_name == comp)
            job = Job(unique_key=j,
                    title=job_dict[j]['title'],
                    company_id=c_id,
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


def set_val_job_id():
    """Set value for the next job_id after seeding database"""

    # Get the Max job_id in the database
    result = db.session.query(func.max(Job.job_id)).one()
    max_id = int(result[0])

    # Set the value for the next job_id to be max_id + 1
    query = "SELECT setval('jobs_job_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()


def set_val_company_id():
    """Set value for the next company_id after seeding database"""

    # Get the Max company_id in the database
    result = db.session.query(func.max(Company.company_id)).one()
    max_id = int(result[0])

    # Set the value for the next company_id to be max_id + 1
    query = "SELECT setval('companies_company_id_seq', :new_id)"
    db.session.execute(query, {'new_id': max_id + 1})
    db.session.commit()


if __name__ == "__main__":
    connect_to_db(app)

    # In case tables haven't been created, create them
    db.create_all()

    # Import different types of data

    add_companies()
    load_jobs()
    load_job_tags()
    set_val_job_id()
    set_val_company_id()

    
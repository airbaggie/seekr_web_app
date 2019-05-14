from sqlalchemy import func
from model import Job, Tag, connect_to_db, db
from server import app
import json


def load_jobs():
    """Load jobs from jobs.json into database."""

    # Delete all rows in table, so if we need to run this a second time,
    # we won't be trying to add duplicate jobs
    Job.query.delete()

    #  Read jobs.json file and insert data
    job_dict = json.load(open('seed_data/jobs.json'))

    for j in job_dict:
        job = Job(job_id=j,
                  title=job_dict[j]['title'],
                  company=job_dict[j]['company'],
                  location=job_dict[j]['location'],
                  apply_url=job_dict[j]['apply_url'],
                  description=job_dict[j]['description'],
                  indeed_url=job_dict[j]['indeed_url'])
        db.session.add(job)

    db.session.commit()

    print("Jobs loaded.")


def load_tags():
    """Load tags from static.tag into database."""

    for i, row in enumerate(open("seed_data/static.tag")):
        row = row.rstrip()
        tag_id, tag_type, tag_name = row.split("|")

        tag = Tag(tag_id=tag_id,
                  tag_type=tag_type,
                  tag_name=tag_name)

        db.session.add(tag)

    db.session.commit()

    print("Tags loaded.")


if __name__ == "__main__":
    connect_to_db(app)

    # In case tables haven't been created, create them
    db.create_all()

    # Import different types of data
    load_jobs()
    load_tags()
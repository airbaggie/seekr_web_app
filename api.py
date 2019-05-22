from flask import Flask, jsonify, abort, make_response, request
from model import Job, connect_to_db, db
from flask_restful import Resource, Api
from flask_cors import CORS

app = Flask(__name__)
api = Api(app) 
CORS(app)

class Search_Result(Resource):
    def get(self):
        """Job searching from database."""

        ### TODO: if login user ###

        keyword = request.args.get('keyword')
        search_result = Job.query.filter(Job.description.ilike(f'%{keyword}%')).all()

        results = {}
        for job in search_result:
            job_id = job.get_job_id()
            results[job_id]= job.get_attributes()

        return jsonify(results)

api.add_resource(Search_Result, '/search')


class Job_Detail(Resource):
    def get(self):
        """Job detail from database."""

        key = request.args.get('key')
        job = Job.query.get(key)

        return jsonify(job.get_attributes())

api.add_resource(Job_Detail, '/jobs')


if __name__ == "__main__":
    # We have to set debug=True here, since it has to be True at the point
    # that we invoke the DebugToolbarExtension

    connect_to_db(app)
    app.run(host="0.0.0.0", port=5001)
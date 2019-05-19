from model import Company, connect_to_db, db
import json


def export_companies_json():
    """Export updated companies table from database."""

    companies = Company.query.all()
    tojson = []
    columns = Company.__table__.columns
    print(columns)
    for company in companies:
        tempcompany = {}
        for c in columns:
            tempcompany[c.name] = str(getattr(company ,c.name))

        tojson.append(tempcompany)
    

    with open('seed_data/companies.json', 'w+') as f:
        json.dump(tojson, f, separators=(',',':'), indent=4)

    print("companies.json updated.")

    
if __name__ == "__main__":
    from server import app

    connect_to_db(app)
    export_companies_json()
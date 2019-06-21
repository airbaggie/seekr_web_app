from model import Company, connect_to_db, db
import json
import requests


def get_and_load_company_info():
    """Use Google Places API to get company location info and seed into database."""
    
    # List of companies without address info in database.
    comp_list = Company.query.filter(Company.address == None).all()

    # Send get request to Google Places API.
    URL = "https://maps.googleapis.com/maps/api/place/findplacefromtext/json"

    with open("g.conf") as g:    # Replace "g.conf" with your secrets file where you store the Google API key.
        k = g.read()

        for comp in comp_list:
            comp_name = comp.company_name
            location = comp.location

            PARAMS = {
                'key': k,
                'input': f'{comp_name} {location}',
                'inputtype': 'textquery',
                'fields': 'formatted_address,rating,geometry'
            }

            r = requests.get(url = URL, params = PARAMS)
            data = r.json() 

            # Commit company info update to database.
            if data['candidates']:
                print('')
                print(data['candidates'])
                print('')
                address = data['candidates'][0]['formatted_address']
                lat = data['candidates'][0]['geometry']['location']['lat'] 
                lng = data['candidates'][0]['geometry']['location']['lng']

                if 'rating' in data['candidates'][0]:
                    rating = data['candidates'][0]['rating']
                else:
                    rating = None

                company = Company.query.filter(Company.company_name==comp_name).one()
                company.address = address
                company.lat = lat
                company.lng = lng
                company.rating = rating
                db.session.commit()
    
    print("Company info updated.")



if __name__ == "__main__":
    from server import app

    connect_to_db(app)
    get_and_load_company_info()

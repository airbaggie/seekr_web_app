# Seekr
Seekr is a web app where job seekers can search for open tech positions in the Bay Area and track application process. Features include an automated web scraper with Beautiful Soup, API extensibility with Flask RESTful API, toggleable views implementing Google APIs (Places, Maps), and a draggable/droppable tracking board utilizing React-DnD.

*In order to use the tracking tool feature, user must register with an email and password - the password is stored as a hash in the database.*

## Tech Stack
PostgreSQL, SQLAlchemy  |  Python, Flask, Flask RESTful API  |  JavaScript, ReactJS, React-DnD, CSS, Bootstrap

## Setup
Install the dependencies from requirements.txt using pip install:
```
pip install -r requirements.txt
```
Create Postgre database:
```
createdb soft
```
Create data model:
```
python model.py
```
Seed database:
```
python seed.py
```
Collect company's geolocation and rating info (you would need a Google Places API key):
```
python places.py
```
Start the server:
```
python server.py
```


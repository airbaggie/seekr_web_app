# Seekr

### Table of Contents
1. [The Project](#project)
2. [Technologies](#tech)
3. [Setup](#setup)
4. [Screenshots](#screens)
5. [Developer Notes](#notes)

<a name="project"></a>
### The Project
Seekr is a web app where job seekers can search for open tech positions in the Bay Area and track application process. Features include:
- Toggleable views implementing Google APIs (Places, Maps)
- JIRA-like tracking board using React-DnD
- Automated web scraper with Beautiful Soup and Selenium
- API extensibility with Flask RESTful API

<a name="tech"></a>
### Technologies
- Backend: Python, Flask, Flask RESTful API, PostgreSQL, SQLAlchemy<br />
- Frontend: JavaScript, ReactJS, React-DnD, CSS, Bootstrap<br />
- API: Google Places, Google Maps<br />

<a name="setup"></a>
### Setup
Install the dependencies from requirements.txt using pip install:
```
$ pip install -r requirements.txt
```
Create Postgre database and seed with static data:
```
$ createdb soft
$ python model.py
$ python seed.py
```
Collect company's geolocation and rating info (you would need a Google Places API key):
```
$ python places.py
```
Start the server:
```
$ python server.py
```

<a name="screens"></a>
### Screenshots
![](https://github.com/airbaggie/seekr_web_app/blob/master/static/assets/1.png)
![](https://github.com/airbaggie/seekr_web_app/blob/master/static/assets/2.png)
![](https://github.com/airbaggie/seekr_web_app/blob/master/static/assets/3.png)

<a name="notes"></a>
### Developer Notes
- The web is currently live at http://seekr.link. Notice that I have stopped scraping more job post data, which means the searching results will be out of date. However, I encourage you to sign up and check out the tracking feature. You can still use it to manage your actual interview process by using the “add job” button, which creates your private job instance.
- In order to use the tracking tool feature, user must register with an email and password - the password is stored as a hash in the database.
- Repo of the web scraping script: https://github.com/airbaggie/web_scraper

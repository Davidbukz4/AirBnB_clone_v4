#!/usr/bin/python3
""" Starts a Flash Web Application """
from models import storage
from models.state import State
from models.city import City
from models.amenity import Amenity
from models.place import Place
from os import environ
from flask import Flask, render_template
app = Flask(__name__)
import uuid
# app.jinja_env.trim_blocks = True
# app.jinja_env.lstrip_blocks = True


@app.teardown_appcontext
def close_db(error):
    """ Remove the current SQLAlchemy Session """
    storage.close()


@app.route('/3-hbnb/', strict_slashes=False)
def hbnb():
    """ HBNB is alive! """
    states = storage.all(State).values()
    states = sorted(states, key=lambda k: k.name)
    st_ct = []

    for state in states:
        st_ct.append([state, sorted(state.cities, key=lambda k: k.name)])

    amenities = storage.all(Amenity).values()
    amenities = sorted(amenities, key=lambda k: k.name)

    places = storage.all(Place).values()
    places = sorted(places, key=lambda k: k.name)

    return render_template('3-hbnb.html',
                           states=st_ct,
                           amenities=amenities,
                           places=places,
                           cache_id=uuid.uuid4())


@app_views.route("/places_search", methods=["POST"],
                 strict_slashes=False)
@swag_from('documentation/place/put_place.yml', methods=['PUT'])
def places_search():
    """Retrieves all Place objects depending of the body of the request"""
    body = request.get_json()
    if type(body) != dict:
        abort(400, description="Not a JSON")
    id_states = body.get("states", [])
    id_cities = body.get("cities", [])
    id_amenities = body.get("amenities", [])
    places = []
    if id_states == id_cities == []:
        places = storage.all(Place).values()
    else:
        states = [
            storage.get(State, _id) for _id in id_states
            if storage.get(State, _id)
        ]
        cities = [city for state in states for city in state.cities]
        cities += [
            storage.get(City, _id) for _id in id_cities
            if storage.get(City, _id)
        ]
        cities = list(set(cities))
        places = [place for city in cities for place in city.places]

    amenities = [
        storage.get(Amenity, _id) for _id in id_amenities
        if storage.get(Amenity, _id)
    ]

    res = []
    for place in places:
        res.append(place.to_dict())
        for amenity in amenities:
            if amenity not in place.amenities:
                res.pop()
                break

    return jsonify(res)


if __name__ == "__main__":
    """ Main Function """
    app.run(host='0.0.0.0', port=5000)

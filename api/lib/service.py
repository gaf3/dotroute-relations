"""
Module for the OPenGUI API
"""

# pylint: disable=no-self-use

import flask
import flask_restx

import relations
import relations.unittest
import relations_restx

import dotroute_relations

def build():
    """
    Builds the Flask App
    """

    import service

    app = flask.Flask("dotroute-relations-api")
    api = flask_restx.Api(app)

    app.source = relations.unittest.MockSource("dotroute-relations")


    api.doc(Health, params={"id": "ya"})

    api.add_resource(Health, '/health')

    relations_restx.attach(api, service, relations.models(dotroute_relations, dotroute_relations.Base))

    return app

class Health(flask_restx.Resource):
    """
    Class for Health checks
    """

    def get(self):
        """
        Just return ok
        """
        return {"message": "OK"}

class Person(flask_restx.Resource):

    MODEL = dotroute_relations.Person

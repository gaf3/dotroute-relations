"""
Module for the OPenGUI API
"""

# pylint: disable=no-self-use

import flask
import flask_restful

import relations
import relations.unittest
import relations_restful

import dotroute_relations

def build():
    """
    Builds the Flask App
    """

    import service

    app = flask.Flask("dotroute-relations-api")
    api = flask_restful.Api(app)

    app.source = relations.unittest.MockSource("dotroute-relations")

    api.add_resource(Health, '/health')

    relations_restful.attach(api, service, relations.models(dotroute_relations, dotroute_relations.Base))

    return app

class Health(flask_restful.Resource):
    """
    Class for Health checks
    """

    def get(self):
        """
        Just return ok
        """
        return {"message": "OK"}

class Person(flask_restful.Resource):

    MODEL = dotroute_relations.Person

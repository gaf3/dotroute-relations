"""
Contains the Models for doTRoute example
"""

import time
import relations


class Base(relations.Model):
    """
    Base class for doTRoute models
    """

    SOURCE = "dotroute-relations"


def now():
    """
    Time function so we can freeze
    """
    return time.time()


class Person(Base):
    """
    Person model
    """

    id = int
    name = str
    status = ["active", "inactive"]


class Stuff(Base):
    """
    Stuff model
    """

    ID = None
    person_id = int
    name = str
    items = list

relations.OneToMany(Person, Stuff)


class Thing(Base):
    """
    Thing model
    """

    id = int
    person_id = int
    name = str
    items = dict

relations.OneToMany(Person, Thing)

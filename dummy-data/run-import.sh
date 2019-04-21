#!/bin/sh

mongoimport --db dancer --collection studios --file ./studios.json --jsonArray

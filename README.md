# Equation Finder

## API

The function of this API is very simple, it essentially just pulls from the cache of equations info with very litle processing
otherwise. It is WIP, but the most important challenge here is having a good DB schema that makes it very easy to query off 
of the keys to quickly grab all necessary items without having to do expensive scans.

Future work will be to add endpoints that make it simpler for us to add/delete equations from the DB, and maybe a second DB table
that is the cache we pull from, and that gets generated off of the equations table.

### Infra

Serverless is cool and makes life easy, using a couple plugins to help with that.

Plugins:
* https://github.com/dherault/serverless-offline
* https://github.com/UnitedIncome/serverless-python-requirements


## Frontend

LOL I don't know what Austin is doing.


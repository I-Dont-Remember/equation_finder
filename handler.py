# from flask import jsonify, make_response
class VariableMappingException(Exception):
    pass

class EquationSearchException(Exception):
    pass

def handle(req):
    print(type(req))
    print(req)
    """
    HTTP Cloud Function from Google
    Args:
        request (flask.Request): The request object.
        <http://flask.pocoo.org/docs/1.0/api/#flask.Request>
    Returns:
        The response text, or any set of values that can be turned into a
        Response object using `make_response`
        <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>.
    """

    body = req.get_json()
    equation_variables = body["equation_variables"]

    try:
        mapped_vars = variable_mapper(equation_variables)
        matching_equations = equation_search(mapped_vars)
        resp_data = {
            "possible_equations": matching_equations
        }
        resp_code = 200
    except Exception as e:
        resp_data = {
            "error": e
        }
        resp_code = 400

    # return resp_data, resp_code
    return make_response(jsonify(resp_data), resp_code)

def variable_mapper(input_variables):
    MapDB = {
        "initial velocity": "v0",
        "final velocity": "vF",
        "acceleration": "a",
        "another variable": "aV"
    }

    mapped_variables = []
    for var in input_variables:
        try:
            mapped_variables.append(MapDB[var])
        except KeyError:
            raise VariableMappingException(f"Couldn't map variable '{var}'' to a standardized form.")
    return mapped_variables

def equation_search(variables):
    equations = [
        {
            "name": "does something",
            "variables": ["v0", "vF", "a"]
        }
    ]

    match_list = []

    for e in equations:
        if all(x in e["variables"] for x in variables):
            match_list.append(e)
    
    if len(match_list) < 1:
        raise EquationSearchException(f"No equations found for combination of variables '{variables}'")

    return match_list

if __name__ == "__main__":
    class Request:
        def __init__(self, variables):
            self.j = {
                "equation_variables": variables
            }

        def get_json(self):
            return self.j

    req = Request([
        "initial velocity",
        "final velocity",
        "acceleration"
    ])
    resp = handle(req)
    print("Happy Path", resp)

    req = Request([
        "donk",
        "butts",
        "booty"
    ])
    resp = handle(req)
    print("Sad Path - no matching variable", resp)

    req = Request([
        "initial velocity",
        "final velocity",
        "acceleration",
        "another variable"
    ])
    resp = handle(req)
    print("Sad Path - no matching equations", resp)
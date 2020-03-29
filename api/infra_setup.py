import os

from loguru import logger
import boto3

EQUATIONS_TABLE = "equations"

def create_table(dynamodb, name, primary, secondary=None):
    keyschema = [
        {
            'AttributeName': primary,
            'KeyType': 'HASH'  #Partition key
        },        
    ]
    attribute_defs = [
        {
            'AttributeName': primary,
            'AttributeType': 'S'
        }        
    ]

    if secondary:
        keyschema.append(
        {
            'AttributeName': secondary,
            'KeyType': 'RANGE'  #Sort key
        }            
        )
        attribute_defs.append(
                    {
            'AttributeName': secondary,
            'AttributeType': 'S'
        }
        )

    dynamodb.create_table(
        TableName=name,
        KeySchema=keyschema,
        AttributeDefinitions=attribute_defs
    )

def main():
    os.environ["AWS_PROFILE"] = "kevin"
    dynamodb = boto3.resource("dynamodb", region_name="us-west-1")

    # TODO: all of the work here is in thinking about a good DB schema

    # make it easy to search for keys of the variables you have
    # NO. combined variables doesn't work if they're in different order,
    # only works if they're sorted
    primary = "combined_variables"
    secondary = "equation"
    
    create_table(dynamodb, EQUATIONS_TABLE, primary, secondary=secondary)

if __name__ == "__main__":
    main()
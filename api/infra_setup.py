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

    resp = dynamodb.create_table(
        TableName=name,
        KeySchema=keyschema,
        AttributeDefinitions=attribute_defs,
        ProvisionedThroughput={
        'ReadCapacityUnits': 1,
        'WriteCapacityUnits': 1
    },
    )
    logger.info(resp)

def main():
    # To use locally with Localstack and Serverless offline
    # os.environ['AWS_ACCESS_KEY_ID'] = 'testing'
    # os.environ['AWS_SECRET_ACCESS_KEY'] = 'testing'
    # os.environ['AWS_SECURITY_TOKEN'] = 'testing'
    # os.environ['AWS_SESSION_TOKEN'] = 'testing'
    # dynamodb = boto3.resource("dynamodb", endpoint_url="http://localhost:4569", region_name="us-west-1")

    os.environ["AWS_PROFILE"] = "kevin"
    dynamodb = boto3.resource("dynamodb", region_name="us-west-1")

    # TODO: all of the work here is in thinking about a good DB schema

    # make it easy to search for keys of the variables you have
    # NO. combined variables doesn't work if they're in different order,
    # only works if they're sorted
    primary = "name"
    secondary = None
    
    create_table(dynamodb, EQUATIONS_TABLE, primary, secondary=secondary)

if __name__ == "__main__":
    main()



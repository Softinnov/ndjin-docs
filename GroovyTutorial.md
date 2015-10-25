### Prerequisite ###

We assume that you have created an application site on [ndjin platform](http://ndjin.net) and set an API Key on your user account.

We use [Groovy HTTP Builder Module](http://groovy.codehaus.org/modules/http-builder/) to execute our examples.

### Groovy JSON request sample ###

Here we perform a simple 'getInstance' request to get a list of 10 'Contact' in 'Application' 'contacts' collection.
We print the name of each result 'Contact'.

```
def query = new JsonGroovyBuilder().json{
    start = 0
    count = 10
    ownerFieldName = 'contacts'
}


def http = new HTTPBuilder( 'http://myapplication.ndjin.net/ng/service/InstanceService/getInstances' )

http.request( POST, JSON ) {
	
	url.query = [ requestDataType:'json', responseDataType:'json', data:  query.toString() ]
	response.success = { 
	    resp, json ->
		json.result.instances.each {
		    println( it.name )
		}
	}
	
	response.failure = { resp -> println "Unexpected error: ${resp.statusLine.statusCode} : ${resp.statusLine.reasonPhrase}"  }
}		
```
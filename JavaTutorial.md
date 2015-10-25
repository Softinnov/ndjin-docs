### Prerequisite ###

We assume that you have created an application site on [ndjin platform](http://ndjin.net) and set an API Key on your user account.

We use [Apache HTTP Client](http://hc.apache.org/httpclient-3.x/) and [Gson](http://code.google.com/p/google-gson/) library to compile and execute our examples.

If you use maven2 to build your application you'll need to include those dependency.
```
<dependency>
	<groupId>org.apache.httpcomponents</groupId>
	<artifactId>httpclient</artifactId>
	<version>4.0-beta2</version>
</dependency>
<dependency>
	<groupId>org.apache.httpcomponents</groupId>
	<artifactId>httpmime</artifactId>
	<version>4.0-beta2</version>
</dependency>
```

```
<dependency>
	<groupId>com.google.code.gson</groupId>
	<artifactId>gson</artifactId>
	<version>1.1</version>
</dependency>
```


### Java JSON request sample ###


We assume that we have defined 2 classes, AuthenticateRequest and AuthenticateResponse, having appropriate structure to respectively, serialized in a json request data string, and deserialized from json response string.

```
AuthenticateRequest authenticateRequest = new AuthenticateResponse();
authenticateRequest.apiKey = "anything";

// we serialize our object in a json string
Gson gson = new Gson();
String jsonData = gson.toJson( authenticateRequest ); 

// BASE_URL contain url to our application site something like: "http://myapp.ndjin.net/ng"
HttpClient httpclient = new DefaultHttpClient();
HttpPost httpPost = new HttpPost(BASE_URL+ "/service/AuthenticationService/authenticate" );

// we set the parameters to the http request with UTF-8 encoding
List<NameValuePair> nvps = new ArrayList<NameValuePair>();
nvps.add( new BasicNameValuePair( "requestDataType", "json" ) );
nvps.add( new BasicNameValuePair( "responseDataType", "json" ) );
nvps.add( new BasicNameValuePair( "data", jsonData ) );
httpPost.setEntity( new UrlEncodedFormEntity( nvps, HTTP.UTF_8 ) );

// we get the response as json string
HttpResponse response = httpclient.execute( httpPost );
String jsonResponse = EntityUtils.toString( response.getEntity() );

// we deserialize the response in a new object
AuthenticateResponse authenticateResponse = gson.fromJson( jsonResponse, AuthenticateResponse.class );
String sessionId = authenticateResponse.sessionId;
```
# TODO

      // create a wrapper that will handle all requests to the server
      // it should only require the unique features of each request, url, and body, and parameters
      // in the wrapper it should do the business of saving all requests to SQlite,
      // probably for request for that return data there should be a parameter to specify if the function can be allowed to be stale or not
      // if the data is needed on every render it shouldnt have to save it to the SQlite at all, otherwise it should save to the sqlite and . before everyrequest it should look in to the sqlit and return whats there go on with the request and update the sqlite

console.log('******** TEST DB *********');

function fetchTest(dbName) {
    fetchData('/dbinttest', dbName);
}

function fetchTestFromClient(dbName) {
    fetchData('/dbexttest', dbName);
}

function fetchData(uri,dbName) {
    fetch(uri, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({name: dbName})
      }).then(function(response) {
        var contentType = response.headers.get("content-type");
        if(contentType && contentType.includes("application/json")) {
          return response.json();
        }
        throw new TypeError("Oops, we haven't got JSON!");
      })
      .then(function(json) { 
          /**
           * process JSON
           * {testType:'internal' ,genTime: 1000, conTime: 100, loadTime: 20000}
           *  */
          $('#' + dbName + 'descr').text(
              'TEST TYPE: ' + json.testType + '  ' +
              'Data generation: ' + json.genTime + ' ms ' + 
              'DB Connection: ' + json.conTime + ' ms ' +
              'Put Data: ' + json.loadTime + ' ms '
              );
          console.log(json);
         })
      .catch(function(error) { console.log(error); });    
}
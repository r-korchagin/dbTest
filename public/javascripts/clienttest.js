console.log('******** TEST DB *********');

function fetchTest(dbName) {
    fetchData('/dbinttest', dbName);
    $("body").css("cursor", "progress");
}

function fetchSelectTest(dbName) {
  fetchData('/dbinttest/select', dbName);
  $("body").css("cursor", "progress");
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
              'TEST TYPE: ' + json.testType + '  ;' +
              'Data generation: ' + json.genTime + ' ms ;' + 
              'DB Connection: ' + json.conTime + ' ms ;' +
              'DB Data: ' + json.loadTime + ' ms '
              );
          console.log(json);
          $("body").css("cursor", "default");
         })
      .catch(function(error) { 
        console.log(error);
        $("body").css("cursor", "default");
       });    
}
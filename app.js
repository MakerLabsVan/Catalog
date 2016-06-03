const PORT=3000;

app.get('/', function(request, response){
    response.sendfile('index.html');
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <!-- The center tag is generally frowned upon, but it works for this simple page -->
  <center>
    <form action="/authenticate" method="post">
      <label for="username">Username: </label>
      <input type="text" name="username" id="username">
      <br><br>

      <label for="password">Password: </label>
      <input type="password" name="password" id="password">
      <br><br>

      <input type="submit" value="Login" name="login">
      <input type="submit" value="Register" name="register">
    </form>
    <br>
    <div id="registrationStatus"></div>
  </center>

  <script>
    const params = new URLSearchParams(location.search);
    const $registrationStatus = document.querySelector('#registrationStatus');
    if (params.has('registration')) {
      $registrationStatus.innerText = `Registration ${params.get('registration')}`;
    }
  </script>
</body>
</html>

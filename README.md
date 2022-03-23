# Backend-NodeJs-Assessment
<p> This is a project where the user can provision the status of his targeted URL by calling the corresponding API.</p>
<p> User Recieve Email when the status of URL change from DOWN to UP and vice versa </p>

<h2> Features 🧾 </h2>
<li> User can Signup if it is valid email add-user and send verification email </li>
<li> JWT verfication token for the Authenticated Users </li>
<li> A middleware to add another security layer to the URL routes</li>
<li> A User schema that contains all the user's subscriped URLs </li>
<li> A URL schema that contains all of its subscriped users , number of it being up or down for service , and other information </li>
<li> The ability for the user to check his desired URL , create this desired url without checking, edit his previously visited URLs , delete one of his previously visited URLs , get Full report of his/her URLs</li>
<li> CRUD API Requests for Users and URL Monitoring</li>
</br>

<h2>User Manual 📓 </h2>

<p> This project includes 3 microservices which are [authentication-service, notification-service, url-monitioring-service]</p>
<p> <strong> Make sure you are using node version 12.18.3 , postgresql & redis service status is up </strong> </p>
<h3> To run the project follow the following steps: </h3>
<p> Go to folder shared-libraries and run command ./init.sh </p>
<p> In each folder of the 3 services </p>
<ul>
  <li> sequelize db:create </li>
   <li> sequelize db:migrate </li>
  <li> npm install  </li>
  <li> npm run dev </li>
  <li> npm run test (notification-service) </li>
</ul>

<ol>
  <li> The user register to the system with his email and password through this route <code> /api/users/sign-up </code>  </li>
  <li> The user login to the system with his email, password and username to get access token through this route <code> /api/users/login </code>  </li>
  <li> The user can upadte his/her data to the system <code> /api/users/:id </code>  </li>
  <li> The user can be deleted from the system <code> /api/users/:id </code>  </li>
  <li> The user enter the access token that he/she got from the login API request to add it as authentication Bearer token in all API Requests for Url-Monitoring  </li>
  <li> Verified users can access the <code> url-monitoring-service API Requests </code> by calling its APIs
    <ul> 
      <li> If a user wishes to check or update a URL , he has to call the route<code>PUT api/url-monitor</code> and pass to it the "url" and "name" he wishes to check </li> 
      <li> Deleting a URL can be accomplished by calling <code>api/url-monitor/:id</code> and only pass the targeted URL to it </li> 
      <li> <code>api/url-monitor/report</code> can be used to get a full report for all his subscriped URLs and send email including this info</li> 
      <li> <code>api/url-monitor</code> can be used to get all url-monitoring in the db with paging provide limit and page</li> 
      <li> <code>api/url-monitor/:id</code> can be used to get a specific subscriped URLs by it is ID</li> 
    </ul>
  </li> 
</ol> 
<h4> Hope this helps you to launch the project and run it successfully </h4>

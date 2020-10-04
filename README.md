# Full Stack Developer Challenge

I had one week for this challenge. My goal was to try and finish over the weekend.

## Building this Project

```
$ git clone https://github.com/kion-dgl/FullStackEngineerChallenge.git
$ cd FullStackEngineerChallenge/
$ npm install
$ node index.js 
```

The application will run on port 4000, and use Sqlite3 for the database. 
Live Version: https://code.dashgl.com/

The login information for the admin account is:
Username: admin
Password: admin

Passwords are automatically generated for each user. 
The usernames and password for the employees are listed in the employee list. 

### Screenshots

![image 1](https://i.imgur.com/V8rDbu2.jpg)
![image 2](https://i.imgur.com/jLo7vIL.png)
![image 3](https://i.imgur.com/cPIMbOA.png)


## Mock up Design

![image 4](https://i.imgur.com/rklSKxt.png)

Before getting started this was the image I drew in diagrams.net to plan out the application.
The idea is to have a login to differentiate which user is logged in, and then have two main pages.
One page for the employee list, and the other for reviews. Employees and reviews are added via a modal form.
And comments are implemented in a comment section when viewing a single review.


### Admin view

- [x] Add Employee
- [x] View Employees
- [ ] Update Employee
- [x] Remove Employee

- [x] Add Review
- [x] View Reviews
- [x] Update Review
- [x] Remove Employee

- [ ] Assign employees to participate in another employee's performance review

In the interest of time I trimmed the update employees to be able to write information to the database once, and then not have to worry about it being consistent with subsequent updates. And for assigning employees to participate in other reviews, I cut corners by allowing everyone to see all of the reviews and comment.

### Employee view

- [x] View Reviews
- [x] Add Comments

## Challenge Scope
* High level description of design and technologies used
* Server side API (using a programming language and/or framework of your choice)
  * Implementation of at least 3 API calls
  * Most full stack web developers at PayPay currently use Java, Ruby on Rails, or Node.js on the server(with MySQL for the database), but feel free to use other tech if you prefer
* Web app
  * Implementation of 2-5 web pages using a modern web framework (e.g. React or Angular) that talks to server side
    * This should integrate with your API, but it's fine to use static responses for some of it 
* Document all assumptions made
* Complete solutions aren't required, but what you do submit needs to run.

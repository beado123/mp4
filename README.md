# task_manager
This is a front-end AngularJS task management app that runs on user-chosen back-end(server).
```
API Reference
Endpoints:	
users	
      GET	Respond with a List of users
      POST	Create a new user. Respond with details of new user
users/:id	
      GET	Respond with details of specified user or 404 error
      PUT	Replace entire user with supplied user or 404 error
      DELETE	Delete specified user or 404 error
tasks	
      GET	Respond with a List of tasks
      POST	Create a new task. Respond with details of new task
tasks/:id	
      GET	Respond with details of specified task or 404 error
      PUT	Replace entire task with supplied task or 404 error
      DELETE      Delete specified user or 404 error
```


## Installation
```
Install VirtualBox
Install Vagrant
Boot up the virtual machine: vagrant up
SSH into the virtual machine once it has booted up: vagrant ssh
```

## Setup
Use the following commands in your vagrant development environment to get this up and running
```
git clone https://github.com/beado123/mp4.git
cd mp4
npm install
bower install
grunt
```

You can leave this command running in the background while development for livereloading:

```bash
grunt
```

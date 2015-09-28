MEN: MongoDB, ExpressJS, NodeJS and the freedom of whichever MV* framework you wish to use. I found that MEAN was so tightly coupled with AngularJS that it give you no freedom to switch it up if you wish. If you are married to Angular, you can easily implement it here.

My thinking was to use a simple MV framework (handlebars, etc) so that my main focus can be on Javascript/ECMAScript6 and being able to use the nifty Gulp/Node tools around to transpile beautiful JS6 code into browser readable code.

This is the boilerplate for the project, shout out to @Mick Feller for getting me started and setting most of this up. It seems to be the best way to go when learning these crazy amount of tools.

TO GET STARTED:
1) Open your terminal; if you are using webstorm (recommended), it will be in the project dir already, if not, navigate to the project dir.

2) While in the root of the project, install the node package.json using the following command in your terminal:
"sudo npm install"

This will create a directory 'node_modules' and place all the libraries listed in package.json into that directory.

3) Once the node packages (server side libraries) are installed, then you want to install the front end libraries using the following command in the terminal: 
"bower install"

This will create a directory 'bower_components' and place all the libraries listed in bower.json (jQuery, fontawesome, bootstrap, etc) into that directory.

4) Now that all project files are present, you can run the Gulpfile.js file in the root directory (in Webstorm, you right click on the file and click "Run 'default'"). 
You will notice the public directory that was previously empty is now filled with directory that have been generated from your Gulpfile. Pretty cool huh?

5) After the Gulpfile has compiled all of the code into the public directory, go to the bin directory and run the www file. This will start your server on port 8000 (it will run app.js, essentially).

6) Open up http://localhost:8000 and you should see a start page!
sqlteaching
===========

SQL Teaching is an interactive tutorial for learning SQL.  It is available on http://www.sqlteaching.com

SQL Teaching is MIT licensed - see the LICENSE file for more details.

It's easy to contribute levels to SQL Teaching.

The sqlteaching.js file contains a variable called *levels*.

This variable has the prompts and answers for each level.

It is an array of dictionaries (the order of the levels).  In each dictionary, there are the following keys:
 - name:          name shown on web page
 - short_name:    identifier added to the URL
 - database_type: is passed into the load_database function, in order to determine the tables loaded
 - answer:        the query that the user writes must return data that matches this value
 - prompt:        what is shown to the user in that web page

And the following keys are optional:
 - required:             Extra validation in the form of case-insensitive required strings
 - custom_error_message: If the validation fails, show this error message to the user

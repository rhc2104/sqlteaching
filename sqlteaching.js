var sql = window.SQL;

// Create a database
var db = new sql.Database();

// Return an HTML table as a string, given SQL.js results
var table_from_results = function(res) {
  var table_string = '<table>';
  if (res) {
    table_string += '<tr>';
    for (index in res[0].columns) {
      table_string += '<th>' + res[0].columns[index] + '</th>';
    }
    table_string += '</tr>';
    for (row_index in res[0].values) {
      table_string += '<tr>';
      for (index in res[0].values[row_index]) {
        table_string += '<td>' + res[0].values[row_index][index] + '</td>';
      }
      table_string += '</tr>';
    }
  }
  table_string += '</table>';
  return table_string;
};


var grade_results = function(results, correct_answer) {
  if (!res) {
    return false;
  }

  return JSON.stringify(results[0].columns) == JSON.stringify(correct_answer.columns) &&
    JSON.stringify(results[0].values) == JSON.stringify(correct_answer.values);
}

var show_is_correct = function(is_correct) {
  if (is_correct) {
    is_correct_html = 'Congrats!  That is correct!<br/>';
    if (current_level < levels.length) {
      is_correct_html += '<a href="#!' + (current_level+1) + '">Next Lesson</a>';
    } else {
      is_correct_html += 'That is currently the end of the tutorial.  Please check back later for more!';
    }
    $('#answer-correctness').html(is_correct_html);
  } else {
    $('#answer-correctness').text('That was incorrect.  Please try again.');
  }
  $('#answer-correctness').show();
};

// Onclick handler for when you click "Run SQL"
$('#sql-link').click(function() {
  var answer = levels[current_level - 1]['answer'];
  try {
    var results = db.exec($('#sql-input').val());
    $('#results').html(table_from_results(results));
    show_is_correct(grade_results(results, answer));
  } catch (err) {
    $('#results').html('');
    show_is_correct(false);
  }
  $('.expected-results-container').show();
  $('#expected-results').html(table_from_results([answer]));
  return false;
});

// Stores the prompts and answers for each level number
var levels = [{'name': 'SELECT *',
              'answer': {'columns': ['id', 'name', 'gender', 'species', 'age'],
                          'values': [[1, 'Dave', 'male', 'human', 28],
                                     [2, 'Mary', 'female', 'human', 27],
                                     [3, 'Pickles', 'male', 'dog', 4]]},
               'prompt': 'In SQL, data is usually organized in various tables. For example, a sports team database might have the tables <i>teams</i>, <i>players</i>, and <i>games</i>. A wedding database might have tables <i>guests</i>, <i>vendors</i>, and <i>music_playlist</i>.<br/><br/>Imagine we have a table that stores family members with each member\'s name, age, species, and gender.<br/><br/>Let\'s start by grabbing all of the data in one table.  We have a table called <i>family_members</i> that is shown below.  In order to grab all of that data, please run the following command: <br/><code>SELECT * FROM family_members;</code>'},
              { 'name': 'WHERE ... Equals',
                'answer': {'columns': ['id', 'name', 'gender', 'species', 'age'],
                          'values': [[3, 'Pickles', 'male', 'dog', 4]]},
               'prompt': 'In order to select particular rows from this table, we use the <code>WHERE</code> keyword.  So for example, if we wanted to grab all of the rows that correspond to humans, we would type <br/><code>SELECT * FROM family_members WHERE species = \'human\';</code><br/>  Note that the quotes have to be around the word human.<br/><br/>Can you run a query that returns all of the rows that refer to dogs?'},
              { 'name': 'WHERE ... Greater Than',
                'answer': {'columns': ['id', 'name', 'gender', 'species', 'age'],
                          'values': [[1, 'Dave', 'male', 'human', 28]]},
               'prompt': 'If we want to only select family members based on a numerical field, we can also use the <code>WHERE</code> keyword.  For example, if we wanted to select family members older than 10, we would type <br/><code>SELECT * FROM family_members WHERE age > 10;</code><br/><br/>  Can you run return all rows of members with age greater than 27?'},
              { 'name': 'WHERE ... greater than or equal to',
                'answer': {'columns': ['id', 'name', 'gender', 'species', 'age'],
                          'values': [[2, 'Mary', 'female', 'human', 27],
                                     [3, 'Pickles', 'male', 'dog', 4]]},
               'prompt': 'SQL accepts various inequality symbols, including <br/> >= "greater than or equal to" and <br/> <= "less than or equal to".<br/><br/> Can you return all rows of members with an age less than or equal to 27?'}];


// Create the SQL table
var sqlstr = "CREATE TABLE family_members (id int, name char, gender char, species char, age int);";
sqlstr += "INSERT INTO family_members VALUES (1, 'Dave', 'male', 'human', 28);"
sqlstr += "INSERT INTO family_members VALUES (2, 'Mary', 'female', 'human', 27);"
sqlstr += "INSERT INTO family_members VALUES (3, 'Pickles', 'male', 'dog', 4);"
db.run(sqlstr);

var res = db.exec("SELECT * FROM family_members;");
$('#current-tables').html(table_from_results(res));

var current_level;

var load_level = function() {
  current_level = parseInt(window.location.hash.substr(2), 10) || 1;
  // Set text for current level
  lesson_name = levels[current_level-1]['name']
  $('#lesson-name').text("Lesson " + current_level + ": " + lesson_name);
  $('#prompt').html(levels[current_level-1]['prompt']);

  // Add "next" and "previous" links if it makes sense.
  if (current_level > 1) {
    $('#previous-link').attr('href', '#!' + (current_level - 1));
    $('#previous-link').show();
  } else {
    $('#previous-link').hide();
  }
  if (current_level < levels.length) {
    $('#next-link').attr('href', '#!' + (current_level + 1));
    $('#next-link').show();
  } else {
    $('#next-link').hide();
  }

  // Clear out old data
  $('#answer-correctness').hide();
  $('#sql-input').val('');
  $('#results').html('');
  $('.expected-results-container').hide();
};
load_level();

$(window).bind('hashchange', function() {
  load_level();
  ga('send', 'pageview', {'page': location.pathname + location.search  + location.hash});
});

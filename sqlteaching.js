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
    $('#answer-correctness').text('Congrats!  That is correct!');
  } else {
    $('#answer-correctness').text('Sorry, please try again.');
  }
};

// Onclick handler for when you click "Run SQL"
$('#sql-link').click(function() {
  try {
    var results = db.exec($('#sql-input').val());
    $('#results').html(table_from_results(results));
    show_is_correct(grade_results(results, correct_answer));
  } catch (err) {
    $('#results').html('');
    show_is_correct(false);
  }
  return false;
});

// This is the first "level".  We should change this to use some kind of framework.
var correct_answer = {'columns': ['id', 'name', 'gender', 'species', 'age'],
                      'values': [[1, 'Dave', 'Male', 'Human', 28],
                                 [2, 'Mary', 'Female', 'Human', 27],
                                 [3, 'Pickles', 'Male', 'Dog', 4]]};

// Execute some sql
var sqlstr = "CREATE TABLE family_members (id int, name char, gender char, species char, age int);";
sqlstr += "INSERT INTO family_members VALUES (1, 'Dave', 'Male', 'Human', 28);"
sqlstr += "INSERT INTO family_members VALUES (2, 'Mary', 'Female', 'Human', 27);"
sqlstr += "INSERT INTO family_members VALUES (3, 'Pickles', 'Male', 'Dog', 4);"
db.run(sqlstr);

var res = db.exec("SELECT * FROM family_members;");
$('#current-tables').html(table_from_results(res));

$('#prompt').text('Please run "SELECT * FROM family_members;".');

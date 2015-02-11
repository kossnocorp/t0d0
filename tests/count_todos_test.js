var expect = require('chai').expect;
var countTodos = require('../src/count_todos');

describe('countTodos', function() {
  it('counts reviewed and unreviewed todos', function() {
    var map = {
      'file1': [
        {isReviewed: true},
        {isReviewed: true},
        {isReviewed: false}
      ],
      'file2': [{isReviewed: true}]
    }

    expect(countTodos(map)).to.eql({
      all: 4,
      reviewed: 3,
      files: {
        'file1': {all: 3, reviewed: 2},
        'file2': {all: 1, reviewed: 1}
      }
    });
  });
});

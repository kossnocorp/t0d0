var countTodos = require('../count_todos');

describe('countTodos', function() {
  beforeEach(function() {
    this.clock = sinon.useFakeTimers(
      new Date(2014, 11 /* Dec */, 31).getTime()
    );
  });

  afterEach(function() {
    this.clock.restore();
  });

  it('counts reviewed and unreviewed todos', function() {
    var map = {
      'file1': [
        {isReviewed: true, reviewedAt: new Date(2014, 11, 30)},
        {isReviewed: true, reviewedAt: new Date(2012, 0, 1)},
        {isReviewed: false}
      ],
      'file2': [{isReviewed: true, reviewedAt: new Date(2014, 11, 30)}]
    };

    expect(countTodos(map, {})).to.eql({
      all: 4,
      reviewed: 2,
      reviewedObsolete: 1,
      files: {
        'file1': {all: 3, reviewed: 1, reviewedObsolete: 1},
        'file2': {all: 1, reviewed: 1, reviewedObsolete: 0}
      },
      tags: {}
    });
  });
});

var filterTodos = require('../filter_todos');
var map = {
  'file1': [
    {
      isReviewed: true,
      reviewedAt: new Date(2014, 11, 30),
      tags: ['tag1', 'tag2']
    },
    {
      isReviewed: true,
      reviewedAt: new Date(2014, 11, 7),
      tags: []
    },
    {
      isReviewed: false,
      tags: ['tag2']
    }
  ],
  'file2': [
    {
      isReviewed: true,
      reviewedAt: new Date(2014, 10, 15),
      tags: ['tag1']
    }
  ]
};


describe('filterTodos', function() {
  beforeEach(function() {
    this.clock = sinon.useFakeTimers(
      new Date(2014, 11 /* Dec */, 31).getTime()
    );
  });

  afterEach(function() {
    this.clock.restore();
  });


  context('without options', function() {
    it('skip reviewed recently', function(done) {
      filterTodos(map, {}, function(result) {
        expect(result).to.eql({
          'file1': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 11, 7),
              tags: []
            },
            {
              isReviewed: false,
              tags: ['tag2']
            }
          ],
          'file2': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 10, 15),
              tags: ['tag1']
            }
          ]
        });

        done();
      });
    });
  });

  context('--all', function() {
    it('skip nothing', function(done) {
      filterTodos(map, {all: true}, function(result) {
        expect(result).to.eql(map);
        done();
      });
    });
  });

  context('--reviewed', function() {
    it('skip unreviewed', function(done) {
      filterTodos(map, {reviewed: true}, function(result) {
        expect(result).to.eql({
          'file1': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 11, 30),
              tags: ['tag1', 'tag2']
            },
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 11, 7),
              tags: []
            }
          ],
          'file2': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 10, 15),
              tags: ['tag1']
            }
          ]
        });
        done();
      });
    });
  });

  context('--tagged', function() {
    it('skip untagged', function(done) {
      filterTodos(map, {tagged: true}, function(result) {
        expect(result).to.eql({
          'file1': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 11, 30),
              tags: ['tag1', 'tag2']
            },
            {
              isReviewed: false,
              tags: ['tag2']
            }
          ],
          'file2': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 10, 15),
              tags: ['tag1']
            }
          ]
        });

        done();
      });
    });
  });

  context('--untagged', function() {
    it('skip tagged', function(done) {
      filterTodos(map, {untagged: true}, function(result) {
        expect(result).to.eql({
          'file1': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 11, 7),
              tags: []
            }
          ],
        });

        done();
      });
    });
  });

  context('--tag', function() {
    it('skip untagged', function(done) {
      filterTodos(map, {tag: 'tag2'}, function(result) {
        expect(result).to.eql({
          'file1': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 11, 30),
              tags: ['tag1', 'tag2']
            },
            {
              isReviewed: false,
              tags: ['tag2']
            }
          ]
        });

        done();
      });
    });
  });

  context('--since, --until', function() {
    it('specify review range', function(done) {
      filterTodos(map, {since: '30.days.ago', until: '7 days ago'}, function(result) {
        expect(result).to.eql({
          'file1': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 11, 30),
              tags: ['tag1', 'tag2']
            },
            {
              isReviewed: false,
              tags: ['tag2']
            }
          ],
          'file2': [
            {
              isReviewed: true,
              reviewedAt: new Date(2014, 10, 15),
              tags: ['tag1']
            }
          ]
        });

        done();
      });
    });
  });
});

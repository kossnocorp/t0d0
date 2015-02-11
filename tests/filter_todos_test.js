var expect = require('chai').expect;
var filterTodos = require('../src/filter_todos');
var sinon = require('sinon');
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
    it('skip reviewed recently', function() {
      var result = filterTodos(map, {});

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
    });
  });

  context('--all', function() {
    it('skip nothing', function() {
      var result = filterTodos(map, {all: true});
      expect(result).to.eql(map);
    });
  });

  context('--reviewed', function() {
    it('skip unreviewed', function() {
      var result = filterTodos(map, {reviewed: true});

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
    });
  });

  context('--tagged', function() {
    it('skip untagged', function() {
      var result = filterTodos(map, {tagged: true});

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
    });
  });

  context('--untagged', function() {
    it('skip tagged', function() {
      var result = filterTodos(map, {untagged: true});

      expect(result).to.eql({
        'file1': [
          {
            isReviewed: true,
            reviewedAt: new Date(2014, 11, 7),
            tags: []
          }
        ],
      });
    });
  });

  context('--tag', function() {
    it('skip untagged', function() {
      var result = filterTodos(map, {tag: 'tag2'});

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
    });
  });

  context('--days', function() {
    it.skip('specify review range');
  });
});

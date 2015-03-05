var cli = require('../cli');
var FILENAME = 'src/__tests__/_test_files/file_1.js';
var DIRNAME = 'src/__tests__/_test_files';

var fetchLineNumber = function(todo) {
  return todo.lineNumber;
};

describe('cli', function() {
  beforeEach(function () {
    this.clock = sinon.useFakeTimers(
      new Date('10 Feb 2015').getTime()
    );
  });

  afterEach(function () {
    this.clock.restore();
  });

  it('returns object instead of exit code with test option', function(done) {
    var options = {
      test: true
    };

    cli(options).then(function(result) {
      expect(result).to.be.an('object');
    }).then(done);
  });

  it('run through directory', function(done) {
    var options = {
      test: true,
      args: [DIRNAME]
    };

    cli(options).then(function(result) {
      expect(result).to.be.an('object');
    }).then(done);
  });

  it('run through single file', function(done) {
    var options = {
      test: true,
      args: [FILENAME]
    };

    cli(options).then(function(result) {
      expect(result).to.be.an('object');
    }).then(done);
  });

  context('without options', function() {
    it('does not include TODOs reviewed recently', function(done) {
      var options = {
        test: true,
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        var lineNumbers = result[FILENAME].map(fetchLineNumber);
        expect(lineNumbers).to.eql([1,2,3,5,6]);
      }).then(done);
    });
  });

  context('with --all option', function() {
    it('includes all TODOs', function(done) {
      var options = {
        test: true,
        all: true,
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        var lineNumbers = result[FILENAME].map(fetchLineNumber);
        expect(lineNumbers).to.eql([1,2,3,4,5,6]);
      }).then(done);
    });
  });

  context('with --reviewed option', function() {
    it('includes only reviewed TODOs', function(done) {
      var options = {
        test: true,
        reviewed: true,
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        expect(result[FILENAME]).to.have.length(3);
      }).then(done);
    });
  });

  context('with --tagged option', function() {
    it('includes only tagged TODOs', function(done) {
      var options = {
        test: true,
        tagged: true,
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        var lineNumbers = result[FILENAME].map(fetchLineNumber);
        expect(lineNumbers).to.eql([3,6]);
      }).then(done);
    });
  });

  context('with --untagged option', function() {
    it('includes only untagged TODOs', function(done) {
      var options = {
        test: true,
        untagged: true,
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        var lineNumbers = result[FILENAME].map(fetchLineNumber);
        expect(lineNumbers).to.eql([1,2,4,5]);
      }).then(done);
    });
  });

  context('with --tag option', function() {
    it('filters TODOs by specified tag', function(done) {
      var options = {
        test: true,
        tag: 'galaxy',
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        var lineNumbers = result[FILENAME].map(fetchLineNumber);
        expect(lineNumbers).to.eql([6]);
      }).then(done);

    });
  });

  context('with --stats option', function() {
    it('returns statistics', function(done) {
      var options = {
        test: true,
        stats: true,
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        expect(result).to.be.an('object');
        expect(result.all).to.equal(6);
        expect(result.reviewed).to.equal(1);
        expect(result.reviewedObsolete).to.equal(2);
        expect(result.tags).to.eql({
          unreviewed: 1,
          todo: 1,
          tags: 1,
          galaxy: 1,
          far: 2,
          away: 1
        });
      }).then(done);
    });
  });

  context('with --since and --until options', function() {
    it('allows specify review range', function(done) {
      var options = {
        test: true,
        since: '10 years ago',
        until: '1 year ago',
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        var lineNumbers = result[FILENAME].map(fetchLineNumber);
        expect(lineNumbers).to.eql([1,2,3,4,5]);
      }).then(done);
    });
  });

  context('with --days option', function() {
    it('allows to specify review range', function(done) {
      var options = {
        test: true,
        days: 100,
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        var lineNumbers = result[FILENAME].map(fetchLineNumber);
        expect(lineNumbers).to.eql([1,2,3,6]);
      }).then(done);
    });
  });

  context('with --blame option', function() {
    it('fetches line author from git', function(done) {
      var options = {
        test: true,
        blame: true,
        args: [DIRNAME]
      };

      cli(options).then(function(result) {
        var author = result[FILENAME][0].author;
        expect(author).to.eql('Lesha Koss');
      }).then(done);
    });
  });

  context('with --ack option', function() {
    it('returns same result', function(done) {
      var optionsAck = { test: true, args: [DIRNAME], ack: true };
      var optionsNoAck = { test: true, args: [DIRNAME]};

      cli(optionsNoAck).then(function(resultNoAck) {
        cli(optionsAck).then(function(resultAck) {
          expect(resultAck).to.eql(resultNoAck);
        }).then(done);
      });
    });
  });
});

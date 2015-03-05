var findTodoByID = require('../find_todo_by_id');
var map = {
  'file1': [
    {id: '0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33', source: 'foo'},
    {id: '62cdb7020ff920e5aa642c3d4066950dd1f01f4d', source: 'bar'},
    {id: 'bbe960a25ea311d21d40669e93df2003ba9b90a2', source: 'baz'}
  ],
  'file2': [
    {id: 'b54ba7f5621240d403f06815f7246006ef8c7d43', source: 'qux'}
  ]
};

describe('findTodoByID', function() {
  it('finds by full ID', function(done) {
    var id = '62cdb7020ff920e5aa642c3d4066950dd1f01f4d';
    findTodoByID(map, id, {}, function(err, result) {
      expect(err).to.be.null;
      expect(result).to.eql({id: id, source: 'bar'});
      done();
    });
  });

  it('finds by abbreviated ID', function(done) {
    var id = 'b54ba7f5621240d403f06815f7246006ef8c7d43';
    findTodoByID(map, id.substring(0, 3), {}, function(err, result) {
      expect(err).to.be.null;
      expect(result).to.eql({id: id, source: 'qux'});
      done()
    });
  });

  it('returns error when ID is not found', function(done) {
    var id = '1234567890';
    findTodoByID(map, id, {}, function(err, result) {
      expect(err).to.be.an.instanceof(Error);
      expect(result).to.be.undefined;
      done();
    });

  });

  it('returns error when there is abbreviated ID collision', function(done) {
    var id = 'bbe960a25ea311d21d40669e93df2003ba9b90a2';
    findTodoByID(map, id.substring(0, 1), {}, function(err, result) {
      expect(err).to.be.an.instanceof(Error);
      expect(result).to.be.undefined;
      done();
    });
  });
});

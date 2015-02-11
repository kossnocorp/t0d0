var expect = require('chai').expect;
var findTodoByID = require('../src/find_todo_by_id');
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
  it('finds by full ID', function() {
    var id = '62cdb7020ff920e5aa642c3d4066950dd1f01f4d';
    var result = findTodoByID(map, id);
    expect(result).to.eql({id: id, source: 'bar'});
  });

  it('finds by abbreviated ID', function() {
    var id = 'b54ba7f5621240d403f06815f7246006ef8c7d43';
    var result = findTodoByID(map, id.substring(0, 3));
    expect(result).to.eql({id: id, source: 'qux'});
  });

  it.skip('handles abbreviated ID collision', function() {
    var id = 'bbe960a25ea311d21d40669e93df2003ba9b90a2';
    var result = findTodoByID(map, id.substring(0, 1));
  });
});

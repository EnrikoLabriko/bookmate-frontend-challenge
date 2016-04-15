/* global describe, it */

(function () {
  'use strict';

    describe('Check getBookData logic', function () {
        beforeEach(function() {
            spyOn($, 'ajax').and.callFake(function (req) {
                var d = $.Deferred();
                d.resolve('OUR DATA');
                return d.promise();
            });
        });

        it('should check that getBookData passes data from api request to callback', function () {
          getBookData('v0pjeMxn', function(data) {
              expect(data).toBe('OUR DATA');
          });
        });
    });

    describe('Check jumpToRelatedBook logic', function () {
        beforeEach(function() {
            spyOn($, 'ajax').and.callFake(function (req) {
                expect(req.url.indexOf('related.json') > -1).toBeTruthy();
                var d = $.Deferred();
                d.resolve([{
                    book_uuid: 3
                }, {
                    book_uuid: 2
                }, {
                    book_uuid: 4
                }]);
                return d.promise();
            });
        });

        it('should return the first book_uuid on empty visitedBooks list', function () {
            var visitedBooks = [1];
            jumpToRelatedBook(1, visitedBooks, function(uuid) {
                expect(uuid).toBe(3);
            });
            expect(visitedBooks).toEqual([1, 3]);
        });

        it('should return the first book_uuid on empty visitedBooks list', function () {
            var visitedBooks = [1, 3];
            jumpToRelatedBook(1, visitedBooks, function(uuid) {
                expect(uuid).toBe(2);
            });
            expect(visitedBooks).toEqual([1, 3, 2]);
        });
    });
})();

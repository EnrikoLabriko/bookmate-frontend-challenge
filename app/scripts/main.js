'use strict';

// Отправляем GET запрос, забирающий данные книги по её id
var getBookData = function(bookUuid, callback) {
    $.ajax({
        method: "GET",
        url: "https://bookmate.com/a/4/books/smart_show",
        data: { book_uuid: bookUuid }
    }).done(function(data) {
        callback(data);
    });
};

// Отправляем GET запрос и получаем список похожих книг, переходим к первой непосещённой
var jumpToRelatedBook = function(documentUuid, visitedBooks, callback) {
    $.ajax({
        method: "GET",
        url: "https://bookmate.com/a/4/d/" + documentUuid + "/related.json"
    }).done(function(data) {
        for (var i = 0; i < data.length; i++) {
            var bookUuid = data[i].book_uuid;
            // Проверяем, встречалась ли нам уже эта книга. Если нет, то запрашиваем о ней данные
            if (visitedBooks.indexOf(bookUuid) == -1) {
                visitedBooks.push(bookUuid);
                callback(bookUuid);
                break;
            }
        }
    })
};

$(document).ready(function() {
    var bookUuid = 'v0pjeMxn';
    var documentUuid;
    var visitedBooks = [];

    // Вставляем полученные данные о книге в DOM-дерево
    var insertRetrievedData = function(data) {
        $('.l-container').removeClass('processing');
        $('#book_cover')
            .attr('src', data.cover.url)
            .attr('width', data.cover.width)
            .attr('height', data.cover.height);
        $('#title').text(data.title);
        $('#authors').text(data.authors);
        documentUuid = data.uuid;

        // .one для того, чтобы не реагировать на повторные клики во время загрузки следующей книги
        $('#book_cover').one('click', function() {
            $('.l-container').addClass('processing');
            jumpToRelatedBook(documentUuid, visitedBooks, function(bookUuid) {
                getBookData(bookUuid, insertRetrievedData);
            });
        });
    };

    getBookData(bookUuid, insertRetrievedData);
});

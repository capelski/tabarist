Feature: Paged data

    The paged data is retrieved with a single query, including information about
    next and previous pages. Note that the presence of a next/previous cursor
    indicates the request was made from a previous/next page. Cursors point to documents
    that will not be included in the result of the future page

    Scenario: First page with no further data
        Given a collection of 5 sample documents
        And a paged query with size 10
        When running the query
        Then 11 documents are requested
        And the response contains 5 documents
        And the document 1 has id 1
        And the document 5 has id 5
        And the response doesn't have a next cursor
        And the response doesn't have a previous cursor

    Scenario: First page with further data
        Given a collection of 20 sample documents
        And a paged query with size 10
        When running the query
        Then 11 documents are requested
        And the response contains 10 documents
        And the document 1 has id 1
        And the document 10 has id 10
        And the response has a next cursor pointing at document 10
        And the response doesn't have a previous cursor

    Scenario: Next Nth page with no further data
        Given a collection of 20 sample documents
        And a paged query with size 10
        And a next cursor at document 10
        When running the query
        Then 12 documents are requested
        And the response contains 10 documents
        And the document 1 has id 11
        And the document 10 has id 20
        And the response doesn't have a next cursor
        And the response has a previous cursor pointing at document 11

    Scenario: Next Nth page with further data
        Given a collection of 30 sample documents
        And a paged query with size 10
        And a next cursor at document 10
        When running the query
        Then 12 documents are requested
        And the response contains 10 documents
        And the document 1 has id 11
        And the document 10 has id 20
        And the response has a next cursor pointing at document 20
        And the response has a previous cursor pointing at document 11

    Scenario: Previous Nth page with no further data
        Given a collection of 20 sample documents
        And a paged query with size 10
        And a previous cursor at document 11
        When running the query
        Then 12 documents are requested
        And the response contains 10 documents
        And the document 1 has id 1
        And the document 10 has id 10
        And the response has a next cursor pointing at document 10
        And the response doesn't have a previous cursor

    Scenario: Previous Nth page with further data
        Given a collection of 30 sample documents
        And a paged query with size 10
        And a previous cursor at document 21
        When running the query
        Then 12 documents are requested
        And the response contains 10 documents
        And the document 1 has id 11
        And the document 10 has id 20
        And the response has a next cursor pointing at document 20
        And the response has a previous cursor pointing at document 11


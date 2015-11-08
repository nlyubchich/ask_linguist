{createClass, createElement, createFactory, render, DOM: {div, p, ul, li, button}} = require "react"
$ = require "npm-zepto"
_ = require "lodash"


WordElement = createClass
    displayName: "WordElement"
    editWord: ->
    deleteWord: ->
        $.post "/delete/", {"target_id": @props.id, "csrf_token": document.getElementById("word-csrf_token").value}
    render: ->
        div(null,
            p(null, @props.text),
            p(null, @props.id),
            button(onClick: @deleteWord, "delete")
        )

WordList = createClass
    displayName: "WordList"
    render: ->
        ul(
            null,
            for word in @props.words
                li(
                    null,
                    createElement WordElement,  {text: word.text, id: word.id}
                )
        )


$.get "/list", (result) ->
    render(
        createElement(WordList, words: result.words),
        document.getElementById("list")
    )
#    $.get(
#      "/English-French/",
#      (result) ->
#          React.render(
#            React.createElement(Asker, initialWords: result.words),
#                document.getElementById("test"));
#
#    );
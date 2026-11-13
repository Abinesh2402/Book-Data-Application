$(document).ready(function() {

    // Load Books Button
    $("#loadBooks").click(function() {

        let search = $("#searchBook").val().trim();

        if (search === "") {
            $("#message").text("Please enter a book name.");
            return;
        }

        $("#message").text("Loading books...");
        $("#bookList").empty();

        // AJAX GET Request
        $.ajax({

            url: "https://openlibrary.org/search.json",

            type: "GET",

            dataType: "json",

            data: {
                q: search,
                fields: "title,author_name,first_publish_year,cover_i,key",
                limit: 12
            },

            // Success Function
            success: function(response) {

                let books = response.docs;

                if (!books || books.length === 0) {
                    $("#message").text("No books found.");
                    return;
                }

                $("#message").text(
                    "Books found: " + books.length
                );

                // Display Book Details
                $.each(books, function(index, book) {

                    let card = $("<div>").addClass("book");

                    // Book Cover
                    if (book.cover_i) {

                        let image = $("<img>")
                            .attr(
                                "src",
                                "https://covers.openlibrary.org/b/id/" +
                                book.cover_i + "-M.jpg"
                            )
                            .attr("alt", "Book Cover");

                        image.on("error", function() {
                            $(this).replaceWith(
                                $("<div>")
                                .addClass("no-cover")
                                .text("📚")
                            );
                        });

                        card.append(image);

                    } else {

                        card.append(
                            $("<div>")
                            .addClass("no-cover")
                            .text("📚")
                        );

                    }

                    // Book Title
                    card.append(
                        $("<h3>").text(book.title || "Unknown Title")
                    );

                    // Author Name
                    card.append(
                        $("<p>").text(
                            "Author: " +
                            ((book.author_name || []).slice(0, 2).join(", ") ||
                            "Unknown")
                        )
                    );

                    // Published Year
                    card.append(
                        $("<p>").text(
                            "Year: " +
                            (book.first_publish_year || "Not Available")
                        )
                    );

                    // View Book Link
                    if (book.key) {
                        let link = $("<a>")
                            .attr("href", "https://openlibrary.org" + book.key)
                            .attr("target", "_blank")
                            .attr("rel", "noopener noreferrer")
                            .text("View Book");

                        card.append(link);
                    }

                    $("#bookList").append(card);

                });

            },

            // Error Function
            error: function() {

                $("#message").text(
                    "Error loading books. Check your internet connection."
                );

            }

        });

    });

});
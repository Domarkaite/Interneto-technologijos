$(document).ready(function () {
    const boardUrl = "https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuBoard/1"; // Requirement 4.a
    const solutionUrl = "https://6550e0cc7d203ab6626e476a.mockapi.io/api/v1/SudokuSolutions/1"; // Requirement 4.a
    let initialBoard = [];
    let solution = [];

    // Requirement 4.a: Fetching Sudoku board data from server
    function loadBoard() {
        $.get(boardUrl, function (data) {
            const boardString = data.board;
            initialBoard = boardString.split("").map(cell => (cell === "x" ? 0 : Number(cell)));
            renderBoard(initialBoard); // Requirement 4.b: Render board dynamically
        });
    }

    // Requirement 4.a: Fetching Sudoku solution from server
    function loadSolution() {
        $.get(solutionUrl, function (data) {
            solution = data.solution.split("").map(Number);
        });
    }

    // Requirement 4.b: Rendering board dynamically
    function renderBoard(board) {
        const $board = $("#sudoku-board");
        $board.empty(); // Clear previous board
        
        board.forEach((cell, index) => {
            const $cell = $("<input>")
                .attr("type", "text")
                .addClass("cell")
                .val(cell === 0 ? "" : cell) // Empty for 0
                .prop("readonly", cell !== 0) // Make fixed numbers readonly
                .data("index", index)
                .on("input", function () {
                    const value = $(this).val();
                    if (!/^[1-9]?$/.test(value)) {
                        $(this).val(""); // Clear invalid input
                    }
                });
    
            $board.append($cell); // Add cells dynamically
        });
    }

    // Requirement 4.b: Show correct answer
    function showCorrectAnswer() {
        $(".cell").each(function (index) {
            const value = solution[index];
            $(this).val(value); // Update cells with correct answer
        });
    }

    // Requirement 1.a & 1.b: Validate solution inputs
    $("#check-solution").click(function () {
        const userSolution = [];
        let missingFields = false; // Check for empty fields
        let invalidInputs = false; // Check for invalid inputs

        $(".cell").each(function () {
            const value = $(this).val().trim();

            if (!value) missingFields = true; // Requirement 1.b
            if (value && (isNaN(value) || value < 1 || value > 9)) invalidInputs = true; // Requirement 1.a

            userSolution.push(value ? Number(value) : 0);
        });

        $("#message").css("color", "red"); // Requirement 3.b: Style update dynamically

        let errorMessages = [];
        if (missingFields) errorMessages.push("Visi laukeliai turi būti užpildyti!"); // Requirement 2
        if (invalidInputs) errorMessages.push("Įveskite tik teigiamus skaičius nuo 1 iki 9!"); // Requirement 2

        if (errorMessages.length > 0) {
            $("#message").html(errorMessages.join("<br>")).show(); // Requirement 2
            return;
        }

        $("#message").hide();

        if (JSON.stringify(userSolution) === JSON.stringify(solution)) {
            $("#message").text("Sveikiname! Sprendimas teisingas!").show().css("color", "green"); // Requirement 3.a
        } else {
            $("#message").text("Klaida! Sprendimas neteisingas.").show().css("color", "red"); // Requirement 3.a
        }
    });

    // Requirement 3: Reset the board
    $("#reset-board").click(function () {
        renderBoard(initialBoard);
        $("#message").hide(); // Clear error messages
    });

    // Requirement 4.b: Show correct answer
    $("#show-correct-answer").click(function () {
        showCorrectAnswer();
    });

    // Initialization
    loadBoard(); // Requirement 4.a
    loadSolution(); // Requirement 4.a
});

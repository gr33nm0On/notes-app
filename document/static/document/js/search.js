document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("search-input");
    const dateFrom = document.getElementById("search-date-from");
    const dateTo = document.getElementById("search-date-to");
    const searchBtn = document.getElementById("search-submit");

    function buildUrl() {
        const params = new URLSearchParams();

        const searchValue = searchInput.value.trim();
        const fromValue = dateFrom.value;
        const toValue = dateTo.value;

        if (searchValue) {
            params.append("search", searchValue);
        }

        if (fromValue) {
            params.append("from", fromValue);
        }

        if (toValue) {
            params.append("to", toValue);
        }

        return `/notes/?${params.toString()}`;
    }

    function performSearch() {
        window.location.href = buildUrl();
    }

    searchBtn.addEventListener("click", function (e) {
        e.preventDefault();
        performSearch();
    });

    searchInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            e.preventDefault();
            performSearch();
        }
    });
});
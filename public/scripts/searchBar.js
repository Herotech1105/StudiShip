const searchBar = document.getElementById("searchBar");
searchBar.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {
        const query = location.origin + "/search";
        const form = document.createElement("form");
        form.setAttribute("action", query);
        form.setAttribute("method", "POST");

        const subject = document.createElement("input");
        subject.name = "roomSubject";
        subject.value = "any";
        form.appendChild(searchBar);
        form.appendChild(subject);
        document.body.appendChild(form);
        form.submit();
    }
})
/* Opens the visitor's email app. Nothing is uploaded and no form service is called. */
(function () {
  var zone = document.querySelector(".dropzone");
  if (zone) {
    ["dragenter", "dragover", "drop"].forEach(function (name) {
      zone.addEventListener(name, function (event) {
        event.preventDefault();
      });
    });
  }

  var form = document.getElementById("rfq-form");
  if (!form) return;

  form.addEventListener("submit", function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var name = String(data.get("name") || "").trim();
    var company = String(data.get("company") || "").trim();
    var email = String(data.get("email") || "").trim();
    var program = String(data.get("program") || "").trim();
    var body = [
      "Name: " + name,
      "Company: " + company,
      "Email: " + email,
      "Program / Part: " + program,
      "",
      "Please attach CAD files to this email (STEP, STP, IGES, PDF, or a ZIP of the package)."
    ].join("\n");
    var subject = program ? "RFQ: " + program : "RFQ";
    window.location.href = "mailto:bm@easyrollinc.com?subject=" +
      encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
  });
})();

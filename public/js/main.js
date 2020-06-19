$(document).ready(function () {
  /************* Submit Action ADD MICROSITE METADATA *************/
  $("#mainForm").on("submit", function (ev) {
    valid = checkRequiredFields(this);
    if (!valid) {
      $("#alert").addClass("alert-danger");
      $("#alert").show();
      $("html, body").animate({ scrollTop: 0 }, "slow");
      return false;
    } else {
    }

    var valid_data = {};
    $(".notempty").each(function () {
      valid_data[$(this).attr("name")] = $(this).val();
    });
    valid_data["selection_value_text"] = $(
      "#inlineFormCustomSelect option:selected"
    ).text();

    //console.log(JSON.stringify(valid_data));
    $("#alert").hide();

    //form submit
    $.ajax({
      type: $(this).attr("method"),
      url: "/submit",
      dataType: "json",
      data: { valid_data },
      success: function (data) {
        $("html, body").animate({ scrollTop: 0 }, "slow");
        if (data.errors === false) {
          $("#mainForm").slideUp("fast", function () {
            // Animation complete.
            $("#SuccessMessage").show().addClass("alert-success");
            $("#urlGen").show();
            let newUrl = "http://fun.smart5.co.uk/challenge/" + data.id;
            $("#urlGen a").attr("href", newUrl);
            $("#urlGen a").text(newUrl);
          });
        } else {
          $("#alert").show().addClass("alert-danger");
        }
      },
    });
    ev.preventDefault();
  });

  /**** Validate the form when fields are entered ****/

  $(".notempty").blur(function () {
    var fieldvalue = $(this).val();
    var allfieldsarevalid = false;
    if ($.trim(fieldvalue).length == 0 && $.trim(fieldvalue) !== "None") {
      //Field can't be empty
      $(this).addClass("is-invalid");
      $(this).removeClass("is-valid");
      $(this).attr("title", $(this).data("empty"));
      $(this).attr("placeholder", $(this).data("empty"));
    } else {
      if ($(this).attr("id") == "InputEmail1") {
        /*Validate Email*/
        if (validateEmail(fieldvalue)) {
          allfieldsarevalid = true;
        } else {
          $(this).addClass("is-invalid");
          $(this).removeClass("is-valid");
          $(this).attr("title", $(this).data("invalid"));
          $(this).attr("placeholder", $(this).data("invalid"));
        }
      } else {
        /*Validate HTML*/
        if (
          $(this)
            .val()
            .match(
              /<(\w+)((?:\s+\w+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/
            )
        ) {
          allfieldsarevalid = false;
        } else {
          allfieldsarevalid = true;
        }
      }

      if (!allfieldsarevalid) {
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
        $(this).parent("div").find("label").addClass("rfgAsteriskerror");
        $(this).attr("title", $(this).data("invalid"));
        $(this).attr("placeholder", $(this).data("invalid"));
      } else {
        $(this).removeClass("is-invalid");
        $(this).parent("div").find("label").removeClass("rfgAsteriskerror");
        $(this).attr("title", "");
        $(this).addClass("is-valid");
      }
    }
  });
});

function validateEmail(sEmail) {
  var filter = /^([\w-\.]+)@((\[[0-9]{1,5}\.[0-9]{1,5}\.[0-9]{1,5}\.)|(([\w-]+\.)+))([a-zA-Z]{2,5}|[0-9]{1,5})(\]?)$/;
  return filter.test(sEmail) ? true : false;
}

function checkRequiredFields(selector) {
  //Checks and alerts if any field is empty
  var fieldsSelectors = "#" + selector.id + " .notempty";
  valid = true; //Assuming all the fields are filled in.

  //Check if all required fields are not empty
  $(fieldsSelectors)
    .not(".notMandatory")
    .each(function () {
      if ($(this).val().length == 0) {
        $(this).addClass("is-invalid");
        $(this).attr("title", $(this).data("empty"));
        $(this).attr("placeholder", $(this).data("empty"));
        valid = false;
      } else {
        //All fields are valid
        $(this).removeClass("is-invalid");
      }
    });

  return valid;
}

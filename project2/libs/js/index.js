$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

const tBody = document.getElementById("tbody");
const search = document.getElementById("button-addon1");
const searchForm = document.getElementById("search");
const containerContactIcon = document.getElementById("container-contact_icon");
const infoDesktop = document.getElementById("infoDesktop");
const datalistSearch = document.getElementById("datalistSearch");
const selectLocation = document.getElementById("selectLocation");
const selectDepartment = document.getElementById("selectDepartment");
const selectChooseLocationForPrint = document.getElementById(
  "selectChooseLocationForPrint"
);
const tbodyTableDeparments = document.getElementById("tbodyTableDeparments");
const tbodyDeparmentsForEditAndDelete = document.getElementById("tbodyDeparmentsForEditAndDelete");
const selectDepartmentForDeleteAndEdit = document.getElementById("selectDepartmentForDeleteAndEdit");
const selectLocationForAddDepartment = document.getElementById("selectLocationForAddDepartment");
const inputEditDepartmentModal = document.getElementById("inputEditDepartmentModal");
const selectEditDepartmentModal = document.getElementById("selectEditDepartmentModal");
const firstNameProfileInputDesktop = document.getElementById("firstNameProfileInputDesktop");
const lastNameProfileInputDesktop = document.getElementById("lastNameProfileInputDesktop");
const emailProfileInputDesktop = document.getElementById("emailProfileInputDesktop");
const selectEditDepartmentPersonDesktop = document.getElementById("selectEditDepartmentPersonDesktop");
const selectEditDepartmentPersonPhone = document.getElementById("selectEditDepartmentPersonPhone");
const departmentInputAddID = document.getElementById("departmentInputAddID");
const locationInputAddID = document.getElementById("locationInputAddID");

let trId;
let person;
let viewMobil = false;
let arrayContacts = [];
let datalistMobilDisplay = false;

let displayFilter = false;
let locationParameter;
let departmentParameter;
let nameLocation;
let nameDepartment;

let locationChanged = "all";
let departmentChanged = "all";

let locationID;
let locationName;

let locationIDforAddDepartment;

let departmentIDForEditDepartment;
let locationIDForEditDepartment;
let departmentNameForEditDepartment;
let idDeleteDepartment;

let selectDepartmentForProfile;
let idPerson;

let idDepartmentForAddEmployee;

let newArrayDepartment = [];

//----------------- PRINT CONTACTS ----------------------------//
$.ajax({
  url: "libs/php/getAll.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    printViews(result.data);
    datalistMobil();
  },
});

// Prints Selects Filter
$.ajax({
  url: "libs/php/getAllLocations.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    let s = result.data.sort((x,y) => {
      if (x.name < y.name) {return -1;}
      if (x.name > y.name) {return 1;}
      return 0;
    });
    s.map((v) => {
      selectLocation.innerHTML += `
      <option value=${v.id}>${v.name}</option>
      `;
    });

    s.map((v) => {
      selectChooseLocationForPrint.innerHTML += `
      <option value=${v.id}>${v.name}</option>
      `;
      selectLocationForAddDepartment.innerHTML += `
      <option value=${v.id}>${v.name}</option>
      `
    });
  },
});

$.ajax({
  url: "libs/php/getAllDepartments.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    let s = result.data.sort((x,y) => {
      if (x.name < y.name) {return -1;}
      if (x.name > y.name) {return 1;}
      return 0;
    });
    let groupedDepartment = s.reduce(function (acc, obj) {
      let key = obj['name']
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, {});

    Object.entries(groupedDepartment).map((v) => {
      selectDepartment.innerHTML += `
      <option value=${v[1][0].id}>${v[1][0].name}</option>
      `;
      selectDepartmentForDeleteAndEdit.innerHTML += `
      <option value=${v[0].split(" ").join("")}>${v[0]}</option>
      `
      departmentInputAddID.innerHTML += `
      <option value=${v[1][0].id}>${v[1][0].name}</option>
      `
    });
  },
});
$.ajax({
  url: "libs/php/getAll.php",
  type: "GET",
  dataType: "json",
  success: function (result) {
    let arrayDeparmentsWithOutLocation = [];
    result.data.map(v => {
      if (v.location == null) {
        arrayDeparmentsWithOutLocation.push(v)
      }
    })
    let groupedDepartment = arrayDeparmentsWithOutLocation.reduce(function (acc, obj) {
      let key = obj['department']
      if (!acc[key]) {
        acc[key] = []
      }
      acc[key].push(obj)
      return acc
    }, {});
    Object.entries(groupedDepartment).map(v => {
      tbodyTableDeparments.innerHTML += `
      <tr>
      <td>${v[1][0].department}</td>
      <td>${v[1].length}</td>
      </tr>
      `;  
    });
    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        let array = [];
          for (let rd = 0; rd < result.data.length; rd++) {
            if (result.data[rd].locationID == 0) {
              array.push(result.data[rd])
              
            }
          }    
          let array2 = [];
          array.map(v => {
            if (!groupedDepartment[v.name]) {
              array2.push(v)
            }
          })
          array2.map(v => {
            tbodyTableDeparments.innerHTML += `
            <tr>
            <td>${v.name}</td>
            <td>${0}</td>
            </tr>
      `;  
        })
      }});

  }})

infoDesktop.style.display = "none";
$(".containerButton").css("display", "none");
$(".areyouSure").css("display", "none");
$(".delete").css("display", "none");
$(".editBox").css("display", "none");
$(".containerButtonMobilEdit").css("display", "none");
$("#okNotDeleteLocation").css("display", "none");
$(".body-profile_box").css("display", "none");



//-----------------------------  EVENTS ------------------------------------//
$(".buttonLocationII").on("click" , () => {
  if ($("#selectChooseLocationForPrint").val() == "null") {
    tbodyTableDeparments.innerHTML = ""; 
  }
})

$(".cancelModalDepartment").on("click", () => {
 
   $(".buttonDepartmentII").trigger("click")
})

$(".noSaveEdit").on("click", () => {
  $(".inputsEdit").css("display", "none");
  $(".inputsEditMobil").css("display", "block");
  $(".btn-close-edit_mobil").css("display", "block");
  $(".fa-file-pen_button").css("display", "block");
  $(".fa-trash-can_button").css("display", "block");
  $(".data-profile").css("display", "block");
  $(".areyouSure").css("display", "none");
  $(".containerButton").css("display", "block");
  $(".containerButton").css("display", "none");
  edit()
})




$(".buttonDeleteLocation").on("click", buttonDeleteLocationWithID)
departmentInputAddID.addEventListener("change", (e) => {
  idDepartmentForAddEmployee = e.target.value;
  if(idDepartmentForAddEmployee  == "null") {
    locationInputAddID.innerHTML = `<option></option>`
    return
  }
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      let findLocationId = result.data.find(v => v.id == idDepartmentForAddEmployee).locationID;
      $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
            let findLocationName = result.data.find(v => v.id == findLocationId);
            locationInputAddID.innerHTML = `<option value=${findLocationName.id}>${findLocationName.name}</option>`
        }})
    }}) 
})
$(".fa-filter_button").on("click", () =>
  $(".filterBox").css("display", "block")
);
$(".closeSearch").on("click", () => $(".filterBox").css("display", "none"));
document.addEventListener("keydown", ifPushTab);
document
  .getElementById("searchNav")
  .addEventListener("keypress", typeSearchNav);
document.addEventListener("keypress", keypressFuntion);
document.getElementById("button-addon1").addEventListener("click", (e) => {
  e.preventDefault();
  searching();
});
tBody.addEventListener("click", chooseContact);
tBody.addEventListener("mouseover", mouseOver);
window.addEventListener("resize", resize);
$(".cancelInfoEdit").on("click", () => { 
  cancelEdit();
});
$(".saveInfo").on("click", areYouSureEdit);
$(".fa-file-pen_button").on("click", () => { 
  defaultContact()
  edit()
});
$(".fa-trash-can_button").on("click", deleteUser);
$(".cancelInfoDelete").on("click", cancelDelete);
$(".cancelInfo").on("click", cancelDelete);
$(".cancelDelete").on("click", cancelDelete);
$(".close-addLocation").on("click", () => {
  $('.buttonLocation').trigger("click")
});
$("#inputAddLocationInLocation").on("click", () =>{
  $(".label-addLocationInLocation").html("")
})
$("#submitNewLocation").on("click", submitNewLocation);
$(".cancel-deleteLocation").on("click", () => {
  $("#deleteRecord").html("Do you want to delete this record?");
  $("#deleteLocation").css("display", "inline");
  $("#okNotDeleteLocation").css("display", "none")
  $("#notDeleteLocation").css("display", "inline")
  $(".buttonLocation").trigger("click")
});
$("#deleteLocation").on("click", deleteLocationWithID);
$("#editLocationAdd").on("click", editLocationAdd);
$("#inputEditLocationInLocation").on("click", () => {
  $(".label-editLocationInLocation").html('')
});
$(".cancelEditInLocation").on("click" , () => {
  $(".label-editLocationInLocation").html('');
  $(".form-editLocation").css("display", "flex");
  $(".editBox").css("display", "none");
  $(".modal-footer_edit").css("display", "flex")
})
$(".locationEdited").on("click", editLocationWithID);
$("#editDeparmentButton").on("click", (e) => {
   e.preventDefault()
   editDeparmentButtonFunction(e)
   
})
$("#selectEditDepartmentModal").on("change", (e) => locationIDForEditDepartment = e.target.value);
selectDepartmentForDeleteAndEdit.addEventListener('change', selectDepartmentForEditAndDeleteFunction);
document.addEventListener('click', chooseDepartmentForEditOrDelete);
selectLocationForAddDepartment.addEventListener('change', selectLocationForAddDepartmentFunction);
$("#submitAddDepartment").on("click", submitAddDepartmentFunction);
$("#inputLocationForAddDepartment").on("click", () => {
  $(".spanForAddDepartment").html(``)
});
selectLocationForAddDepartment.addEventListener("click", () => {
  $(".spanForAddDepartment").html(``)
})
$(".closeAddDeparmentModal").on("click" , () => {
  $(".spanForAddDepartment").html(``);
  $("#inputLocationForAddDepartment").val("");
  $("#selectLocationForAddDepartment").val("null")
})
$(".closeEditDepartment").on("click", () => {
  $(".spanForEditDepartment").html("")
})
$("#yesDeleteDepartment").on("click", yesDeleteDepartmentFunction);
$(".editPopUpDepartment").css("display", "none");
$(".cancelEditDepartment").on("click", ()=> {
  $(".editPopUpDepartment").css("display", "none");
  $(".form-editDepartment").css("display", "flex");
});
$(".noDeleteDepartment").on("click", () => {
  //$("#questionDeleteDepartment").html("Do you want to delete this record?")
  $("#noDeleteDepartmentID").html('No');
  $("#noDeleteDepartmentID").css("width", "50px");
  $("#noDeleteDepartmentID").css("margin-left", "0px")
  $("#yesDeleteDepartment").css("display", "inline");
  $("#departmentButtonModal").trigger("click");
});
$("#yesDeleteDepartment").on("click", yesDeleteDepartmentFunction)
$("#yesEditDepartmentModal").on("click", yesEditDepartment)

$(".firstNameProfileInput").on("click", () =>{
  $(".spanFirstNameProfileInput").html("");
})
$(".lastNameProfileInput").on("click", () => {
  $(".spanLastNameProfileInput").html("");
})
$(".emailProfileInput").on("click", () => {
  $(".spanEmailProfileInput").html("");
})
selectDepartment.addEventListener("change", changeDepartment);
selectLocation.addEventListener("change", changeLocation);
$(".buttonSearch").on("click", (e) => {
  e.preventDefault();
  filterSearch(locationChanged, departmentChanged);
});
$(".closeFilter").on("click", closeFilterFunction);
$(".addContact").on("click", () => {
  viewMobil = false;
});
$(".areyouSureMobil").on("click", areYouSureEdit);
$(".noEditMobil").on("click", cancelEdit);
$(".fa-file-pen_button-mobile").on("click", () => {
  defaultContact()  
  $(document).ready(function () {
    $("#modalContactMobilEdit").trigger("click");
  });
});
$(".areyouSureCancelMobil").on("click", () => {
  $("#modalContactMobilProfile").trigger("click");
});
$(".fa-circle-xmark_button-mobile").on("click", () => { 
  $("#modalContactMobilDelete").trigger("click");
});
$(".cancelDeleteMobil").on("click", () => {
  $("#modalContactMobilProfile").trigger("click");
});
document
  .getElementById("selectEditDepartmentPersonDesktop")
  .addEventListener("change", changeLocationForEdit);
document
  .getElementById("selectEditDepartmentPersonPhone")
  .addEventListener("change", changeLocationForEdit)
selectChooseLocationForPrint.addEventListener(
  "change",
  chooseLocationWithSelectForPrintModal
);
selectEditDepartmentPersonDesktop.addEventListener("change", (e) => {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      selectDepartmentForProfile = result.data.find(v => v.name == e.target.value).id;
    }
   })  
}) 
selectEditDepartmentPersonPhone.addEventListener("change", (e) => {
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      selectDepartmentForProfile = result.data.find(v => v.name == e.target.value).id;
      
    }
   })
})

//----- Back-End
$(".fnameInputAdd").on("click", () => {
  $(".spanAddEmployeeFn").html("")
}) 
$(".lnameInputAdd").on("click", () => {
  $(".spanAddEmployeeLn").html("")
}) 
$(".departmentInputAdd").on("click", () => {
  $(".spanAddEmployeeDepartment").html("")
})
$(".emailInputAdd").on("click", () => {
  $(".spanAddEmployeeEmail").html("");
})

$(".clearAddEmployeeModal").on("click", () => {
  $(".spanAddEmployeeFn").html("");
  $(".spanAddEmployeeLn").html("");
  $(".spanAddEmployeeDepartment").html("");
  $(".spanAddEmployeeEmail").html("");
})

$(".yesAdd").on("click", (e) => {
  e.preventDefault();
   
   $.ajax({
     url: "libs/php/getAllPersonnels.php",
     type: "GET",
     dataType: "json",
     success: function (result) {
    let findPerson = result.data.find(v => v.email == $(".emailInputAdd").val().trim());

      if($(".fnameInputAdd").val().trim() == "") {
      $(".spanAddEmployeeFn").html("Please complete this field");
      return
      }  

      if(/^[a-zA-z\s\ñ\Ñ]+$/.test($(".fnameInputAdd").val()[0]) == false )
      {
        $(".spanAddEmployeeFn").html("The first character must be a letter");
        return  
      }

      if ($(".lnameInputAdd").val().trim() == "") {
        $(".spanAddEmployeeLn").html("Please complete this field");
        return
      }
    
      if(/^[a-zA-z\s\ñ\Ñ]+$/.test($(".lnameInputAdd").val()[0]) == false ) 
      {   
        $(".spanAddEmployeeLn").html("The first character must be a letter");
        return 
      }

      if ($(".emailInputAdd").val().trim() == "")  
      {
     $(".spanAddEmployeeEmail").html("Please complete this field");
     return
      }
    
      if (/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test($(".emailInputAdd").val().trim()) == false) 
         {
        $(".spanAddEmployeeEmail").html("Must be a valid email");
        return
       }

      if (findPerson) {
        $(".spanAddEmployeeEmail").html("this email address already exists") 
        return
      }

      if($(".departmentInputAdd").val() == "null") {
        $(".spanAddEmployeeDepartment").html("Please choose a department");
        return
      }
    
      if(idDepartmentForAddEmployee == "null") {
        $(".spanAddEmployeeDepartment").html("Please choose a department")
      }
      
      else {
        $.ajax({
          url: "libs/php/insertPersonnel.php",
          type: "POST",
          dataType: "json",
          data: {
            firstName: $(".fnameInputAdd").val().trim().charAt(0).toUpperCase() +  $(".fnameInputAdd").val().trim().slice(1),
            lastName: $(".lnameInputAdd").val().trim().charAt(0).toUpperCase() + $(".lnameInputAdd").val().trim().slice(1),
            jobTitle: "",
            email: $(".emailInputAdd").val().trim(),
            departmentID: idDepartmentForAddEmployee
          },
          success: function (result) {
            window.location.reload()
          }
        })

      }
   }})
  return

});

$(".yesEdit").on("click", () => {
if (window.innerWidth >= 830) {

  $.ajax({
    url: "libs/php/updatePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: firstNameProfileInputDesktop.value.trim().charAt(0).toUpperCase() + firstNameProfileInputDesktop.value.trim().slice(1),
      lastName: lastNameProfileInputDesktop.value.trim().charAt(0).toUpperCase() + lastNameProfileInputDesktop.value.trim().slice(1),
      jobTitle: "",
      email: emailProfileInputDesktop.value.trim(),
      departmentID: Number(selectDepartmentForProfile),
      id: idPerson,
    },
    success: function (result) {
     window.location.reload()
    }
  
  })
}
if (window.innerWidth < 830) {
  $.ajax({
    url: "libs/php/updatePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      firstName: $(".firstNameProfileInput").val().trim().charAt(0).toUpperCase() + $(".firstNameProfileInput").val().trim().slice(1),
      lastName: $(".lastNameProfileInput").val().trim().charAt(0).toUpperCase() + $(".lastNameProfileInput").val().trim().slice(1),
      jobTitle: "",
      email: $(".emailProfileInput").val().trim(),
      departmentID: Number(selectDepartmentForProfile),
      id: idPerson,
    },
    success: function (result) {
     window.location.reload()
    }
  
  })
 }
})

$(".yesDelete").on("click", () => {
  $.ajax({
    url: "libs/php/deletePersonnelByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: idPerson,
    },
    success: function (result) {
     window.location.reload()
    }})
});

//----------------------------- FUNCTIONS ----------------------------------//
function changeLocation(e) {
  locationChanged = e.target.value;
}
function changeDepartment(e) {
  departmentChanged = e.target.value;
}
function datalistMobil() {
  if (window.innerWidth < 830) {
    let jsonFuzzy = [];
    arrayContacts.map((v) => {
      let userObj = {
        user: `${v.lastName} ${v.firstName}`,
      };
      jsonFuzzy.push(userObj);
    });
    $(document).ready(function () {
      $("#searchNav").fuzzyComplete(jsonFuzzy);
      $("#searchNav").on("keyup blur", function () {
        $(this)
          .parent()
          .find(".output")
          .html($(this).parent().find("select").val());
      });
    });
    datalistMobilDisplay = true;
  }
}

let classLastsearch;
function searching(e) {
  if (document.getElementById("searchNav").value.trim() == "") {
    return;
  }

  if (
    document.getElementById("searchNav").value.includes("\\"[0]) ||
    document.getElementById("searchNav").value.includes("*") ||
    document.getElementById("searchNav").value.includes("(") ||
    document.getElementById("searchNav").value.includes(")") ||
    document.getElementById("searchNav").value.includes("[") ||
    document.getElementById("searchNav").value.includes("]")
  ) {
    return;
  }

  let valueInput = [];
  let persons = [];

  arrayContacts.map((v, i) => {
    var str = v.lastName.split(" ").join("") + v.firstName.split(" ").join("");
    var patt = new RegExp(
      document.getElementById("searchNav").value.split(" ").join(""),
      "i"
    );
    var res = patt.exec(str);
    if (res) {
      valueInput.push(v.email.split("@")[0].split(".").join("") + v.email.split("@")[1].split(".").join("") );
      persons.push(v);
      if (classLastsearch) {
        $(`.${classLastsearch}`).css("background", "white");
        $(`.${classLastsearch}`).css("border", "solid 1px white");
      }

      $(`.${valueInput[0]}`).css("background", "lightblue");
      //$(`.${valueInput[0]}`).css("border", "solid 1px violet");
      $(`.${valueInput[0]}`).css("width", "100%");
      $(document).ready(function () {
        $("html, body").animate(
          {
            scrollTop: $(`.${valueInput[0]}`).offset().top - 260,
          },
          0
        );
      });
      classLastsearch = valueInput[0];
    }
  });
  if (persons[0] != undefined && window.innerWidth >= 830) {
    person = persons[0];
    defaultContact();
  }
  if (persons[0] == undefined) {
    tBody.innerHTML = `Full name: ${
      document.getElementById("searchNav").value
    } <br>
                       Department: ${
                         selectDepartment.value == "all"
                           ? "All"
                           : nameDepartment
                       } <br>
                       Location: ${
                         selectLocation.value == "all"
                           ? "All"
                           : nameLocation
                       } <br>
                       <b>Not Found</b>
                       
    `;
    setTimeout(() => {
      filterSearch(selectLocation.value, selectDepartment.value);
    }, 2000);

    return;
  }
  return;
}

function defaultContact() {
  $(".spanEmailProfileInput").html("");
  $(".spanLastNameProfileInput").html("");
  $(".spanFirstNameProfileInput").html("");
  $("#deletePersonContactPhone").html(`Are you sure that you want to delete the entry for ${person.firstName} ${person.lastName}`);
  $("#deletePersonContactDesktop").html(`Are you sure that you want to delete the entry for ${person.firstName} ${person.lastName}`);
  // selectDepartmentForProfile = person.department;
  // personId
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      selectDepartmentForProfile = result.data.find(v => v.name == person.department).id;
    }});

  $.ajax({
    url: "libs/php/getAllPersonnels.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      idPerson = result.data.find(v => v.email == person.email).id;
    }})
 
  $(".firstNameProfile").html(`<b>First name: </b>${person.firstName}`);
  $(".lastNameProfile").html(`<b>Last name: </b>${person.lastName}`);
  $(".emailProfile").html(
    `<b>Email: </b><a href ="mailto:${person.email}"><p>${person.email}</p></a>`
  );
  $(".departmentProfile").html(
    `<b>Department: </b>${
      person.department == null ? "None" : person.department
    }</p>`
  );
  $(".locationProfile").html(
    `<p><b>Location: </b>${
      person.location == null ? "None" : person.location
    }</p>`
  );
  $(".containerButton").css("display", "none");
  $(".inputsEdit").css("display", "none");
  $(".areyouSure").css("display", "none");
  $(".data-profile").css("display", "block");
  $(".fa-file-pen_button").css("display", "block");
  $(".fa-trash-can_button").css("display", "block");
  $(".delete").css("display", "none");
  $(".body-profile_box").css("display", "block");
  $(".inputsEditMobil").css("display", "block");

  $(".firstNameProfileInput").val(person.firstName);
  $(".lastNameProfileInput").val(person.lastName);
  $(".emailProfileInput").val(person.email);
  //$(".departmentProfileInput").val(person.department);

  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
    
      document.getElementById("selectEditDepartmentPersonDesktop").innerHTML = "";
      document.getElementById("selectEditDepartmentPersonPhone").innerHTML = "";
     
        let groupedDepartment = result.data.reduce(function (acc, obj) {
          let key = obj['name']
          if (!acc[key]) {
            acc[key] = []
          }
          acc[key].push(obj)
          return acc
        }, {});

        let s = Object.entries(groupedDepartment).sort((x,y) => {
          if (x[1][0].name < y[1][0].name) {return -1;}
          if (x[1][0].name > y[1][0].name) {return 1;}
          return 0;
        });
    
        s.map((v) => {
          document.getElementById("selectEditDepartmentPersonDesktop").innerHTML += `
          <option ${v[1][0].name == person.department && "selected"}>${v[1][0].name}</option>
          `;
          document.getElementById("selectEditDepartmentPersonPhone").innerHTML +=  `
          <option ${v[1][0].name == person.department && "selected"}>${v[1][0].name}</option>
          `
        });

       

        //document.getElementById("selectEditLocationPersonDesktop").innerHTML = "";
        //document.getElementById("selectEditLocationPersonPhone").innerHTML = "";


        // $.ajax({
        // url: "libs/php/getAllLocations.php",
        // type: "GET",
        // dataType: "json",
        // success: function (result) {
        //   result.data.map(v => {
        //     groupedDepartment[person.department].map(j => {
        //       if(v.id == j.locationID) {
        //         document.getElementById("selectEditLocationPersonDesktop").innerHTML += `
        //         <option ${v.name == person.location && "selected"}>${v.name}</option>
        //         `;
        //         document.getElementById("selectEditLocationPersonPhone").innerHTML += `
        //         <option ${v.name == person.location && "selected"}>${v.name}</option>
        //         `
        //       }
        //     })
        //   })
        // }})    
    }})
 
  $(".locationProfileInput").val(person.location);

  viewMobil = true;

  if (window.innerWidth >= 830) {
    containerContactIcon.style.display = "none";
    infoDesktop.style.display = "block";
  }
  if (window.innerWidth < 830) {
    $(document).ready(function () {
      $("#modalContactMobilProfile").trigger("click");
    });
  }
}

function chooseContact(e) {
  if (
    e.target.parentNode.attributes.key == undefined ||
    e.target.parentNode.attributes.key == undefined
  ) {
    return;
  }
  if (e.target.parentNode.attributes.key.value.split(";;")[0]) {
    person =
      arrayContacts[e.target.parentNode.attributes.key.value.split(";;")[1]];
    defaultContact();
  }

  if (datalistMobilDisplay) {
    $(`.${classLastsearch}`).css("background", "white");
    $(`.${classLastsearch}`).css("border", "solid 1px white");
  }
}

function mouseOver(e) {
  if (e.target.parentNode.attributes.key == undefined) {
    return;
  }
  if (e.target.parentNode.attributes.key.value.split("%")[0]) {
    if (trId) {
      trId.style.background = "white";
      trId.style.border = "solid 1px white";
    }
    trId = document.getElementById(e.target.parentNode.attributes.key.value);
    trId.style.background = "rgb(221 235 236)";
    return;
  }
}

function resize() {
  if (window.innerWidth >= 830) {
    $(document).ready(function () {
      $("#cancelModalContactMovil").trigger("click");
    });
  }
  if (window.innerWidth < 830 && viewMobil == true) {
    $(document).ready(function () {
      $(".data-profile_mobil").css("display", "block");
    });
  }
}

function edit() {
  $(".containerButton").css("display", "flex");
  $(".data-profile").css("display", "none");
  $(".inputsEdit").css("display", "block");
}

function cancelEdit() {
  $(".inputsEdit").css("display", "none");
  $(".inputsEditMobil").css("display", "block");
  $(".btn-close-edit_mobil").css("display", "block");
  $(".fa-file-pen_button").css("display", "block");
  $(".fa-trash-can_button").css("display", "block");
  $(".data-profile").css("display", "block");
  $(".areyouSure").css("display", "none");
  $(".containerButton").css("display", "block");
  $(".containerButton").css("display", "none");
  //$(".data-profile_mobil").css("display", "block")
}

function areYouSureEdit(e) {
  e.preventDefault();
  if (
      $(".firstNameProfileInput").val().trim() == "" ||
      firstNameProfileInputDesktop.value.trim() == ""
     ) 
     {
      $(".spanFirstNameProfileInput").html("Please complete this field");
      return
     }

  if(/^[a-zA-z\s\ñ\Ñ]+$/.test($(".firstNameProfileInput").val()[0]) == false ||
     /^[a-zA-z\s\ñ\Ñ]+$/.test(firstNameProfileInputDesktop.value[0]) == false
     )
     {
       $(".spanFirstNameProfileInput").html("The first character must be a letter");
       return
     }

  if (
      $(".lastNameProfileInput").val().trim() == "" ||
      lastNameProfileInputDesktop.value.trim() == ""
     )
     {
      $(".spanLastNameProfileInput").html("Please complete this field");
      return
     }

  if(/^[a-zA-z\s\ñ\Ñ]+$/.test($(".lastNameProfileInput").val()[0]) == false ||
     /^[a-zA-z\s\ñ\Ñ]+$/.test(lastNameProfileInputDesktop.value[0]) == false 
    ) 
    {   
    $(".spanLastNameProfileInput").html("The first character must be a letter");
    return
    }

    if ($(".emailProfileInput").val().trim() == "" ||
         emailProfileInputDesktop.value.trim() == ""
     ) 
   {
    $(".spanEmailProfileInput").html("Please complete this field");
    return
   }

  if (/^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test($(".emailProfileInput").val().trim()) == false ||
      /^([\da-z_\.-]+)@([\da-z\.-]+)\.([a-z\.]{2,6})$/.test(emailProfileInputDesktop.value.trim()) == false
     ) 
     {
    $(".spanEmailProfileInput").html("Must be a valid email");
    return
     }

   $.ajax({
     url: "libs/php/getAllPersonnels.php",
     type: "GET",
     dataType: "json",
     success: function (result) {
    let pass = true;
    let newArrayPersons = [];
    let findPerson = result.data.find(v => v.email == person.email);
    for (let index = 0; index < result.data.length; index++) {
       if (result.data[index].email == findPerson.email) {
        continue
       }
       newArrayPersons.push(result.data[index]);
    }
    newArrayPersons.map(v => {
      if (v.email == $(".emailProfileInput").val().trim() ||
          v.email == emailProfileInputDesktop.value.trim()
         ) 
      {
        $(".spanEmailProfileInput").html("This email address already exists");
        pass = false
        return
      }
    })
    if (pass) {
    $(".btn-close-edit_mobil").css("display", "none");
    $(".inputsEdit").css("display", "none");
    $(".inputsEditMobil").css("display", "none");
    $(".data-profile").css("display", "none");
    $(".containerButton").css("display", "none");
    $(".fa-file-pen_button").css("display", "none");
    $(".fa-trash-can_button").css("display", "none");
    $(".areyouSure").css("display", "block");
    $(".spanEmailProfileInput").html("");
    $(".spanLastNameProfileInput").html("");
    $(".spanFirstNameProfileInput").html("");
   }
   }})
  return
}

function deleteUser() {
  $(".inputsEdit").css("display", "none");
  $(".body-profile_box").css("display", "none");
  $(".delete").css("display", "block");
  $(".fa-file-pen_button").css("display", "none");
  $(".fa-trash-can_button").css("display", "none");
  $("#deleteConfirmDesktop").html(`Are you sure that you want to delete the entry for ${person.firstName} ${person.lastName}`);
 
}

function cancelDelete() {
  $(".data-profile").css("display", "block");
  $(".body-profile_box").css("display", "block");
  $(".delete").css("display", "none");
  $(".fa-file-pen_button").css("display", "block");
  $(".fa-trash-can_button").css("display", "block");
}

function typeSearchNav(e) {
  document.getElementById("searchNav").addEventListener("keydown", (e) => {
    if (e.key == "Backspace" && datalistMobilDisplay == false) {
      datalistSearch.innerHTML = "";
    }
  });
  if (e.target.value.length == 1 && datalistMobilDisplay == false) {
    arrayContacts.map((v) => {
      datalistSearch.innerHTML += `
      <option>${v.lastName} ${v.firstName}</option>
    `;
    });
  }
}

function keypressFuntion(e) {
  if (!e.target.getAttribute("id2")) {
    return;
  }
  person = arrayContacts.find((v) => v.email == e.target.getAttribute("id2"));
  defaultContact();
  return;
}

function ifPushTab(e) {
  if (e.key == "Enter" && datalistMobilDisplay == true) {
    searching();
  }
  if (e.key == "Tab") {
    document.getElementById("searchNav").value = "";
    $(`.${classLastsearch}`).css("background", "white");
    $(`.${classLastsearch}`).css("border", "solid 1px white");
  }
}

// FILTER
function filterSearch(location, department) {
  
  displayFilter = true;
  locationParameter = location;
  departmentParameter = department;
  $(".containerProfile").css("display", "flex")
  containerContactIcon.style.display = "flex";
  infoDesktop.style.display = "none";
  $(".inputsEdit").css("display", "none");
  $(".data-profile").css("display", "none")


  if (location == "all" && department == "all") {
    $.ajax({
      url: "libs/php/getAll.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        printViews(result.data);
        datalistMobil();
      },
    });
  
  }

  if (location == "all" && department != "all") {
    $.ajax({
      url: "libs/php/getDepartmentByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: department
      },
      success: function (result) {
       nameDepartment = result.data[0].name;
        
      $.ajax({
      url: "libs/php/getAll.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        let newArray = [];
        result.data.forEach((element) => {
          if (element.department == nameDepartment) {
            newArray.push(element);
          }
        });
        printViews(newArray);

        if(!newArray[0]) {
          tBody.innerHTML = `Employees in ${nameDepartment} not found`;
          $(".fa-filter_button").css("display", "none");
          setTimeout(() => {
            filterSearch("all", "all");
            selectLocation.value = "all";
            selectDepartment.value = "all";
            departmentChanged = "all";
            locationChanged = "all";
            $(".fa-filter_button").css("display", "block");
          }, 3000);
        }  
      },
      });
      },
    });
  }

  if (location != "all" && department == "all") {
    infoDesktop.style.display = "none";
    $.ajax({
      url: "libs/php/getLocationByID.php",
      type: "POST",
      dataType: "json",
      data: {
        id: location
      },
      success: function (result) {
       nameLocation = result.data[0].name;
       $.ajax({
        url: "libs/php/getAll.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
          let newArray = [];
          result.data.forEach((element) => {
            if (element.location == nameLocation) {
              newArray.push(element);
            }
          });
          printViews(newArray);

          if(!newArray[0]) {
            tBody.innerHTML = `Employees in ${nameLocation} not found`;
            $(".fa-filter_button").css("display", "none");
            setTimeout(() => {
              filterSearch("all", "all");
              selectLocation.value = "all";
              selectDepartment.value = "all";
              departmentChanged = "all";
              locationChanged = "all";
              $(".fa-filter_button").css("display", "block");
            }, 3000);
          }     
        },
      });    
      
      },
    });

  }

  if (location != "all" && department != "all") {
    $.ajax({
      url: "libs/php/getAllLocations.php",
      type: "GET",
      dataType: "json",   
      success: function (result) {
       nameLocation = result.data.find(v => v.id == location).name;

       $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
         nameDepartment = result.data.find(v => v.id == department).name;
         $.ajax({
          url: "libs/php/getAll.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
            let newArray = [];
            let newArrayII = [];
            result.data.forEach((element) => {
              if (element.location == nameLocation) {
                newArray.push(element);
              }
            });
            newArray.forEach((elementII) => {
               if(elementII.department == nameDepartment) {
                  newArrayII.push(elementII)
               }
            });
    
            if (newArrayII[0] == undefined) {
              tBody.innerHTML = `${nameDepartment} in ${nameLocation} not found`
              $("#modalContactFilter").css("display", "none");
              setTimeout(() => {
                filterSearch('all' , 'all');
                selectLocation.value = 'all';
                selectDepartment.value = 'all';
                departmentChanged = "all";
                locationChanged = "all";
                $("#modalContactFilter").css("display", "block");               
              }, 3000);
            
            }
            if(newArrayII[0] != undefined) {           
            printViews(newArrayII);  
            }  
          },
        });
        },
      });
      
      },
    });
    
  }
  
  $(".closeFilter").trigger("click")
  return;
}

function printViews(result) {
  tBody.innerHTML = "";
  if (arrayContacts) {
    arrayContacts.splice(0, arrayContacts.length);
  }

  result.map((v) => arrayContacts.push(v));
  let arrayLetter = [];
  let keyValue;
  arrayContacts.map((element, i) => {
    keyValue = element.lastName[0] + i;
    arrayLetter.push(element.lastName[0] + i);
    let newArrayLetter = [];
    arrayLetter.map((v) => {
      if (v[0] == keyValue[0]) {
        newArrayLetter.push(v);
      }
    });

    tBody.innerHTML += `
    ${
      newArrayLetter[0] == keyValue
        ? ` <tr class="th-th0" key="">
       <td scope="row" >${keyValue[0]}</td>
       <td></td>
       <td class=""></td>
       </tr>`
        : "<div key=''></div>"
    }
      <tr id=${"person" + ";;" + i} key=${
      "person" + ";;" + i
    } class=${element.email.split("@")[0].split(".").join("") + element.email.split("@")[1].split(".").join("")} 
      tabindex="0" id2=${element.email}>

      <td scope="row" class="td-fullname">${element.lastName}, ${
      element.firstName
    }</td>
      <td class="td-department">${
        element.department == null ? "None" : element.department
      }</td>
      <td class="td-email">${element.email}</td>

      </tr> 
      `;
  });

  return;
}

function closeFilterFunction() {
  if (displayFilter == false) {
    selectDepartment.value = "all";
    selectLocation.value = "all";
    return;
  }
  selectDepartment.value = departmentParameter;
  selectLocation.value = locationParameter;
}

function changeLocationForEdit(e) {
  //document.getElementById("selectEditLocationPersonDesktop").innerHTML = ""; 
  //document.getElementById("selectEditLocationPersonPhone").innerHTML = ""; 

  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      let arrayforLocationsInDeparment = [];
      result.data.map((v) => {
        if (v.name == e.target.value) {
          arrayforLocationsInDeparment.push(v);
        }
      });
      $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
          
          let newArraySort = [];
          result.data.sort().map((v) => {
            arrayforLocationsInDeparment.map((value) => {
              if (v.id == value.locationID) {
                newArraySort.push(v.name);
              }
            });
          });
          newArraySort.sort();
          // newArraySort.map((v) => {
          //   document.getElementById(
          //     "selectEditLocationPersonDesktop"
          //   ).innerHTML += `<option ${
          //     v == person.location && "selected"
          //   } >${v}</option>`;
          //   document.getElementById(
          //     "selectEditLocationPersonPhone"
          //   ).innerHTML += `<option ${
          //     v == person.location && "selected"
          //   }>${v}</option>`;
          // });
        },
      });
    },
  });
}

function chooseLocationWithSelectForPrintModal(e) {
  if(e.target.value == "null") {
    $("#thDeparmentsTable").html(`Deparments`);
    tbodyTableDeparments.innerHTML = "";
    $(".containerButtonMobilEdit").css("display", "none");
    return
  }

  locationID = e.target.value;
  $(".containerButtonMobilEdit").css("display", "flex");
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      locationName = result.data.find((v) => v.id == e.target.value).name;
      $("#inputEditLocationInLocation").val(locationName);
      $("#thDeparmentsTable").html(`Deparments in ${locationName}`);
      let arrayDeparments = [];
      $.ajax({
        url: "libs/php/getAllDepartments.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
          result.data.map((v) => {
            if (v.locationID == e.target.value) {
              arrayDeparments.push(v.name);
            }
          });
          arrayDeparments.sort();
          tbodyTableDeparments.innerHTML = "";
          let arrayAllForlocation = [];

          $.ajax({
            url: "libs/php/getAll.php",
            type: "GET",
            dataType: "json",
            success: function (result) {
              result.data.map((v) => {
                if (v.location == locationName) {
                  arrayAllForlocation.push(v);
                }
              });

              let groupedDepartment = arrayAllForlocation.reduce(function (acc, obj) {
                  let key = obj['department']
                  if (!acc[key]) {
                    acc[key] = []
                  }
                  acc[key].push(obj)
                  return acc
                }, {});

                for (let index = 0; index < arrayDeparments.length; index++) {
                   if (groupedDepartment[arrayDeparments[index]] == undefined) {
                    tbodyTableDeparments.innerHTML += `
                    <tr>
                    <td>${arrayDeparments[index]}</td>
                    <td>${0}</td>
                    </tr>
                    `
                    continue
                   }

                   tbodyTableDeparments.innerHTML += `
                   <tr>
                   <td>${groupedDepartment[arrayDeparments[index]][0].department}</td>
                   <td>${groupedDepartment[arrayDeparments[index]].length}</td>
                   </tr>
                   `;  
                }
              
            },
          });
        },
      });
    },
  });
}

function submitNewLocation (e) {
  e.preventDefault();

  if( $("#inputAddLocationInLocation").val().trim() == "") {
    $(".label-addLocationInLocation").html(`Please complete this field`)
    return
  }

  $(".label-addLocationInLocation").html("")
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      let findSame = result.data.find(v => v.name == $("#inputAddLocationInLocation").val().trim())
      if (findSame) {
        $(".label-addLocationInLocation").html(`This location already exists`)
        return
      }
      $.ajax({
        url: "libs/php/insertLocation.php",
        type: "POST",
        dataType: "json",
        data: {
          name: $("#inputAddLocationInLocation").val().trim()
        },
        success: function (result) {
          window.location.reload();
        }})
    }     
  })
}

function buttonDeleteLocationWithID () {
  $.ajax({
    url: "libs/php/getDepartmentsForDeleteLocation.php",
    type: "POST",
    dataType: "json",
    data:{
      locationID: locationID
    },
    success: function (result) { 
        if (result.data[0].pc > 0) {
          $("#deleteRecord").html("You can't delete this record, it's already in use");
          $("#deleteLocation").css("display", "none");
          $("#notDeleteLocation").css("display", "none");
          $("#okNotDeleteLocation").css("display", "inline")
          $("#okNotDeleteLocation").css("width", "100px");
          $("#okNotDeleteLocation").css("margin-left", "50px");
          $("#modalDeleteLocationButton").trigger("click")
          return
        }

        $.ajax({
          url: "libs/php/getAllLocations.php",
          type: "GET",
          dataType: "json",
          success: function (result) {
            let findLocationNameWithID = result.data.find(v => v.id == locationID).name;
            $("#deleteRecord").html(`Are you sure that you want to delete the entry for ${findLocationNameWithID}`);
            $("#modalDeleteLocationButton").trigger("click")
          }})
    }})
}

function deleteLocationWithID () {
  
 
          $.ajax({
            url: "libs/php/deleteLocationByID.php",
            type: "POST",
            dataType: "json",
            data: {
            id: locationID
            },
            success: function (result) {
              window.location.reload();
            }})
        
   

}

function editLocationAdd (e) {
  e.preventDefault();
  if ($("#inputEditLocationInLocation").val().trim() == "") {
    $(".label-editLocationInLocation").html(`Please, complete this field`);
    return
  }
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      let findSame = result.data.find(v => v.name == $("#inputEditLocationInLocation").val().trim()) 
      if(findSame && findSame.name !== locationName) {
          $(".label-editLocationInLocation").html(`This location already exists`);
          return
      }
      $(".form-editLocation").css("display", "none");
      $(".editBox").css("display", "block");
      $(".modal-footer_edit").css("display", "none")

    } 
  })

}

function editLocationWithID (e) {
  e.preventDefault();
  $.ajax({
    url: "libs/php/updateLocationByID.php",
    type: "POST",
    dataType: "json",
    data: {
      id: locationID,
      name:$("#inputEditLocationInLocation").val().trim()
    },
    success: function (result) {
      window.location.reload();
    } 
  })
}

function selectDepartmentForEditAndDeleteFunction (e) {
   if(e.target.value == "null") {
    tbodyDeparmentsForEditAndDelete.innerHTML = '';
    return
   }
  $.ajax({
    url: "libs/php/getAllLocations.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
     let newArrayLocation = [];
     result.data.map(v => newArrayLocation.push(v));

    $.ajax({
      url: "libs/php/getAllDepartments.php",
      type: "GET",
      dataType: "json",
      success: function (result) {
        let newArray = [];
        result.data.map(v => {
          if (v.name.split(" ").join("")  == e.target.value) {
            newArray.push(v)
          } 
        });
        tbodyDeparmentsForEditAndDelete.innerHTML = '';
        newArray.map(v => {
        tbodyDeparmentsForEditAndDelete.innerHTML += `
        <tr key=${v.id}>
        <td>
           <p>${v.name}</p>  
        </td>
        <td>
          <p>${newArrayLocation.find(j => j.id == v.locationID) == undefined ? "None" : newArrayLocation.find(j => j.id == v.locationID).name }</p>       
        </td>
        <td class="">
          <button class="buttonEditDeparmentmin">
            <i class="fa-solid fa-file-pen text-muted" id=${`editDepartment%${v.id}`}></i>
          </button>
          &nbsp;
          &nbsp;
          <button class="buttonDeleteDeparmentmin">
            <i class="fa-solid fa-trash-can text-muted" id=${`deleteDepartment%${v.id}`}></i>
          </button> 
         </td>
      </tr>
      `
      })
      }})
      
    }, 
    });

}

function chooseDepartmentForEditOrDelete(e) {
  
  if (e.target.id.split('%')[0] == "editDepartment") {
    departmentIDForEditDepartment = e.target.id.split('%')[1]
    
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) {
      let find = result.data.find(v => v.id == e.target.id.split("%")[1])
      inputEditDepartmentModal.value = find.name;
      for (let index = 0; index < result.data.length; index++) {
      if ( result.data[index].name == find.name &&
      result.data[index].locationID == find.locationID) {
      continue
      }
        newArrayDepartment.push(result.data[index])
      }
      console.log(newArrayDepartment)

      $.ajax({
        url: "libs/php/getAllLocations.php",
        type: "GET",
        dataType: "json",
        success: function (result) {
          let findLocationId = result.data.find(v => v.id == find.locationID);
          locationIDForEditDepartment = findLocationId;   
          selectEditDepartmentModal.innerHTML = "";
          if (locationIDForEditDepartment != undefined) {
            let s = result.data.sort((x,y) => {
              if (x.name < y.name) {return -1;}
              if (x.name > y.name) {return 1;}
              return 0;
            });
            s.map(v => {
              selectEditDepartmentModal.innerHTML += `
              <option value=${v.id} ${v.id == findLocationId.id && "selected"}>${v.name}</option>
             `
            })
            $("#editDepartmentModalButton").trigger("click")
          }
        }})
     }})
    return
  }
  if (e.target.id.split('%')[0] == "deleteDepartment") {
    idDeleteDepartment = e.target.id.split('%')[1] ;
    $.ajax({
      url: "libs/php/getPersonnelByID.php",
      type: "POST",
      dataType: "json",
      data: {
        departmentID: idDeleteDepartment
      },
      success: function (result) { 
        let departmentName = result.data.department.find(v => v.id == idDeleteDepartment).name
        if (result.data.personnel[0].pc > 0) {
         $("#yesDeleteDepartment").css("display", "none");
         $("#questionDeleteDepartment").html("You can't delete this record, it's already in use")
         $("#noDeleteDepartmentID").html('ok');
         $("#noDeleteDepartmentID").css("width", "100px");
         $("#noDeleteDepartmentID").css("margin-left", "20px");
         $("#deleteDepartmentButton").trigger("click")
         return
        }
        $("#deleteDepartmentButton").trigger("click")
        $("#questionDeleteDepartment").html(`Are you sure that you want to delete the entry for ${departmentName}`)
       
      }
    })
    
  } 
 
  return
}

function selectLocationForAddDepartmentFunction (e) {
  locationIDforAddDepartment = e.target.value;
}

function submitAddDepartmentFunction (e) {
  e.preventDefault();
  if($("#inputLocationForAddDepartment").val().trim() == "") {
    $(".spanForAddDepartment").html(`Please complete this field`);
    return
  }



  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) { 
      let foundSame;
      result.data.map(v => {
        if (v.name == $("#inputLocationForAddDepartment").val().trim()
            //&& v.locationID == locationIDforAddDepartment 
           ) 
        {
          foundSame = v
        
        }
      })

      if(foundSame) {
        $(".spanForAddDepartment").html(`This department already exists`)
        return
      }

      if(selectLocationForAddDepartment.value == 'null' 
      || locationIDforAddDepartment == "null") {
        $(".spanForAddDepartment").html(`Choose a location`);
        return
      }

      $.ajax({
        url: "libs/php/insertDepartment.php",
        type: "POST",
        dataType: "json",
        data: {
          name: $("#inputLocationForAddDepartment").val().trim(),
          locationID: locationIDforAddDepartment
        },
        success: function (result) { 
          window.location.reload()
          
        }})
    }})
}

function editDeparmentButtonFunction (e) {
  e.preventDefault();
  if (inputEditDepartmentModal.value.trim() == '') {
    $(".spanForEditDepartment").html("Please complete this field")
    return
  }
  let location = typeof locationIDForEditDepartment == "object" ? locationIDForEditDepartment.id : locationIDForEditDepartment
  $.ajax({
    url: "libs/php/getAllDepartments.php",
    type: "GET",
    dataType: "json",
    success: function (result) { 
      let pass = true; 
      newArrayDepartment.map(v => {
        if(
          v.name == inputEditDepartmentModal.value.trim() &&
          v.locationID == location
          ) {
            $(".spanForEditDepartment").html("This department and location already exists")
            pass = false
            return
          }
        
        if (v.name == inputEditDepartmentModal.value.trim()) {
          $(".spanForEditDepartment").html("This department already exists")
          pass = false;
          return
        }
 
      })
      
      if (pass) {
        $(".editPopUpDepartment").css("display", "block");
        $(".form-editDepartment").css("display", "none");
      }

    }}) 
}

function yesEditDepartment () {
  let location = typeof locationIDForEditDepartment == "object" ? locationIDForEditDepartment.id : locationIDForEditDepartment  
  $.ajax({
    url: "libs/php/updateDepartmentByID.php",
    type: "POST",
    dataType: "json",
    data: {
      name: inputEditDepartmentModal.value,
      locationID: location,
      id: departmentIDForEditDepartment
    },
    success: function (result) {
      window.location.reload()
    }})
}

function yesDeleteDepartmentFunction () {

      $.ajax({
        url: "libs/php/deleteDepartmentByID.php",
        type: "POST",
        dataType: "json",
        data: {
          id: idDeleteDepartment
        },
        success: function (result) {
            window.location.reload()
        }}) 
  
}



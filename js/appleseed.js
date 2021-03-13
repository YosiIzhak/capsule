// localStorage.setItem('user', JSON.stringify(user));
// var user = JSON.parse(localStorage.getItem('user'));
const baseUserData = 'https://appleseed-wa.herokuapp.com/api/users/';
const proxy = 'https://api.codetabs.com/v1/proxy/?quest=';
const weather = 'https://api.openweathermap.org/data/2.5/weather?q='
const weather2 = '&units=metric&APPID=e27c7e3d10aab67d7d802ace2485a4fc';
const deleteBtn = document.querySelectorAll("#deleteBbtn")
const editBtn = document.querySelectorAll("#editBbtn")
const categories = document.querySelector('#categories');
let userData = [], tHeadArr = ["id", "firstName", "lastName", "capsule", "age", "city", "gender", "hobby"];
tHeadContentArr = [];
let data;
function debounce(func, wait, immediate) {
	var timeout;
	return function() {
		var context = this, args = arguments;
		var later = function() {
			timeout = null;
			if (!immediate) func.apply(context, args);
		};
		var callNow = immediate && !timeout;
		clearTimeout(timeout);
		timeout = setTimeout(later, wait);
		if (callNow) func.apply(context, args);
	};
};
function createTable() {
    let table = document.getElementById("table");
    let header = table.createTHead();
    let newrow = header.insertRow(0);
    for (let i = 0; i < tHeadArr.length; i++) {
        tHeadContentArr[i] = newrow.insertCell(i);
        tHeadContentArr[i].innerHTML = tHeadArr[i];

    }
}
const allStudents = JSON.parse(localStorage.getItem('students'))
createTable()
const insertDataToTable = async () => {
    if (allStudents === null) {
        let response = await fetch(`${proxy}${baseUserData}`);
        data = await response.json();
        localStorage.setItem('students', JSON.stringify(data))
    }
    else {
        data = allStudents;
    }
    let table = document.getElementById("table")
    let tbody = document.createElement("TBODY");
    table.appendChild(tbody);
    let i = 0;
    while (i < data.length) {
        let moreData = await fetch(`${proxy}${baseUserData}/${i}`);
        let newData = await moreData.json();
        let newRow = tbody.insertRow(tbody.length);
        cell0 = newRow.insertCell(0);
        cell0.innerHTML = data[i].id
        cell1 = newRow.insertCell(1);
        cell1.innerHTML = data[i].firstName;
        cell2 = newRow.insertCell(2);
        cell2.innerHTML = data[i].lastName;
        cell3 = newRow.insertCell(3);
        cell3.innerHTML = data[i].capsule;
        cell4 = newRow.insertCell(4);
        cell4.innerHTML = newData.age;
        cell5 = newRow.insertCell(5);
        const cityCellContents = document.createElement("span");
        const cityCellMain = document.createElement("span");
        const cityCellTooltip = document.createElement("span");
        cityCellContents.appendChild(cityCellMain);
        cityCellMain.setAttribute("class", "tooltip");
        cityCellMain.innerHTML = newData.city;
        cityCellMain.appendChild(cityCellTooltip);
        cityCellTooltip.setAttribute("class","tooltiptext");
        cell5.appendChild(cityCellContents)
        cityCellMain.addEventListener("mouseover", debounce(tooltip, 250))
        cell6 = newRow.insertCell(6);
        cell6.innerHTML = newData.gender;
        cell7 = newRow.insertCell(7);
        cell7.innerHTML = newData.hobby;
        cell8 = newRow.insertCell(8);
        cell8.innerHTML = `<input type="button" id="deleteBbtn" onClick="onDelete(this)" value="Delete"/>
                             <input type="button" id="editBbtn" onClick="onEdit(this)" value="Edit"/>`
        i++;
    }
}
async function tooltip(td) {
    cityCell = td.target
    city = cityCell.childNodes[0].textContent;
    cityTooltipCell = cityCell.querySelector(".tooltiptext");
    try {
        cityTooltipCell.innerHTML = await weatherData(city)
    } catch (error) {

    }


}
const weatherData = async (td) => {
    try {
        let response = await fetch(`${proxy}${weather}${td}${weather2}`);
        let weatherData = await response.json();
        let x = weatherData.main.temp;
        console.log(x);
        return x;
    } catch (err) {
        throw "no data received"
    }
}
function createDropDown() {
    var catArr = [];
    for (let i = 1; i < tHeadArr.length; i++) {
        catArr.push(`<option value="${tHeadArr[i]}">${tHeadArr[i]}</option>`)
    }
    categories.innerHTML = catArr
}
createDropDown()
function onDelete(td) {
    if (confirm('Are you sure to delete this user ?')) {
        row = td.parentElement.parentElement;
        console.log(row)
        document.getElementById("table").deleteRow(row.rowIndex);
    }
}
function searchFuncion() {
    let x = categories.selectedIndex;
    var y = categories.options;
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("search");
    filter = input.value.toUpperCase();
    table = document.getElementById("table");
    tr = table.getElementsByTagName("tr");
    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td")[y[x].index + 1];
        if (td) {
            txtValue = td.textContent || td.innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
function onEdit(td) {
    selectedRow = td.parentElement.parentElement;
    let x = document.getElementById("table").rows[selectedRow.rowIndex].cells;
    for (let i = 1; i < 8; i++) {
        userData[i] = x[i].innerHTML;

    }

    x[8].innerHTML = `<input type="button" id="confirmBbtn" onClick="onConfirm(this)" value="Confirm"/>
    <input type="button" id="cancelBbtn" onClick="onCancel(this)" value="Cancel"/>`
    tempCell = x[1].innerHTML;
    x[1].innerHTML = `<input type="text" id="firstNameCell"></input>`
    document.getElementById("firstNameCell").value = tempCell;
    tempCell = x[2].innerHTML;
    x[2].innerHTML = `<input type="text" id="lastNameCell"></input>`
    document.getElementById("lastNameCell").value = tempCell;
    tempCell = x[3].innerHTML;
    x[3].innerHTML = `<input type="number" id="capsulaCell" min="1" max="5"></input>`
    document.getElementById("capsulaCell").value = tempCell;
    tempCell = x[4].innerHTML;
    x[4].innerHTML = `<input type="number" id="ageCell"></input>`
    document.getElementById("ageCell").value = tempCell;
    tempCell = x[5].innerHTML;
    x[5].innerHTML = `<input type="text" id="cityCell"></input>`
    document.getElementById("cityCell").value = tempCell;
    tempCell = x[6].innerHTML;
    x[6].innerHTML = `<input type="text" id="genderCell"></input>`
    document.getElementById("genderCell").value = tempCell;
    tempCell = x[7].innerHTML;
    x[7].innerHTML = `<input type="text" id="hobbyCell"></input>`
    document.getElementById("hobbyCell").value = tempCell;
    //}
}
function onCancel(td) {
    selectedRow = td.parentElement.parentElement;
    let x = document.getElementById("table").rows[selectedRow.rowIndex].cells;
    for (let i = 1; i < 8; i++) {
        selectedRow.cells[i].innerHTML = userData[i]
    }
    x[8].innerHTML = `<input type="button" id="deleteBbtn" onClick="onDelete(this)" value="Delete"/>
    <input type="button" id="editBbtn" onClick="onEdit(this)" value="Edit"/>`
}
function onConfirm(td) {
    selectedRow = td.parentElement.parentElement;
    selectedRow.cells[1].innerHTML = document.getElementById("firstNameCell").value
    selectedRow.cells[2].innerHTML = document.getElementById("lastNameCell").value
    selectedRow.cells[3].innerHTML = document.getElementById("capsulaCell").value
    selectedRow.cells[4].innerHTML = document.getElementById("ageCell").value
    selectedRow.cells[5].innerHTML = document.getElementById("cityCell").value
    selectedRow.cells[6].innerHTML = document.getElementById("genderCell").value
    selectedRow.cells[7].innerHTML = document.getElementById("hobbyCell").value
    selectedRow = td.parentElement.parentElement;
    selectedCell = td.parentElement;
    let x = document.getElementById("table").rows[selectedRow.rowIndex].cells;
    x[8].innerHTML = `<input type="button" id="deleteBbtn" onClick="onDelete(this)" value="Delete"/>
    <input type="button" id="editBbtn" onClick="onEdit(this)" value="Edit"/>`
}
insertDataToTable()
//})()



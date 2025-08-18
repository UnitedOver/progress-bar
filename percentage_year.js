const express = require('express')
const app = express()
// Use env PORT for Docker/Coolify, fallback to 4567
const port = process.env.PORT || 4567

app.get('/', (req, res) => {
  var percentage = 0;
  var {dob, age, startdate, enddate} = req.query;
  var today = new Date();
  var oneDay = 1000 * 60 * 60 * 24;
  var firstDate = dob || startdate;
  if (firstDate && (age || enddate)) {
    var date = firstDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
    var dobDate = new Date(date);
    var fullYear = dobDate.getFullYear();
    var ageTime = Math.abs(today - dobDate);
    var ageInDays = Math.ceil(ageTime / oneDay);
    var futureAge;
    if (age) {
      var yearAtAge = fullYear + parseInt(age);
      futureAge = new Date(date);
      futureAge.setYear(yearAtAge);
    } else {
      var enddateFormat = enddate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
      futureAge = new Date(enddateFormat);
    }
    var diffInTime = futureAge - dobDate;
    var daysForAge = diffInTime/ oneDay;

    percentage = (ageInDays/daysForAge) * 100;
  } else {
    var currentYear = today.getFullYear();
    var start = new Date(currentYear, 0, 0);
    var diff = today - start;
    var day = Math.floor(diff / oneDay);

    var numberOfDaysInCurrentYear = days_of_a_year(currentYear);
    var percentage = (day/numberOfDaysInCurrentYear) * 100;

    var html = `<h1 class="current-year">Current  Year: ${currentYear} </h1>
      <h2 class="percent"> Year Progress :  ${percentage.toFixed(4)}<h2>
      <h2 class="progressbar"> ${getAsciiProgress(percentage)}<h2>
    `;
    res.send(html);
    return;
  }
  var html2 = `
    <h2 class="percent"> Progress Percentage :  ${percentage.toFixed(4)}<h2>
    <h2 class="progressbar"> ${getAsciiProgress(percentage)}<h2>
  `;
  res.send(html2);
});

app.get('/json', (req, res) => {
  var percentage = 0;
  var {dob, age, startdate, enddate} = req.query;
  var today = new Date();
  var oneDay = 1000 * 60 * 60 * 24;
  var firstDate = dob || startdate;
  if (firstDate && (age || enddate)) {
    var date = firstDate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
    var dobDate = new Date(date);
    var fullYear = dobDate.getFullYear();
    var ageTime = Math.abs(today - dobDate);
    var ageInDays = Math.ceil(ageTime / oneDay);

    var futureAge = new Date();
    if (age) {
      var yearAtAge = fullYear + parseInt(age);
      futureAge = new Date(date);
      futureAge.setYear(yearAtAge);
    } else {
      var enddateFormat = enddate.replace(/^(\d{2})(\d{2})(\d{4})$/, '$1/$2/$3');
      futureAge = new Date(enddateFormat);
    }
    var diffInTime = futureAge - dobDate;
    var daysForAge = diffInTime/ oneDay;
    percentage = (ageInDays/daysForAge) * 100;
  } else {
    var currentYear = today.getFullYear();
    var start = new Date(currentYear, 0, 0);
    var diff = today - start;
    var day = Math.floor(diff / oneDay);

    var numberOfDaysInCurrentYear = days_of_a_year(currentYear);
    var percentage = (day/numberOfDaysInCurrentYear) * 100;

    res.send({
      year: currentYear,
      percentage: percentage.toFixed(4) + "%",
      progress: getAsciiProgress(percentage)
    });
    return;
  }
  res.send({
    percentage: percentage.toFixed(4) + "%",
    progress: getAsciiProgress(percentage)
  });
});

function days_of_a_year(year)
{
  return isLeapYear(year) ? 366 : 365;
}

function isLeapYear(year) {
     return year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0);
}

function getAsciiProgress (percentage) {
  var progress = "[";
  for (n = 0; n < 20; n++) {
    if (percentage < (n+1)*5) {
      if (percentage > n * 5) {
      var difference = Math.floor(percentage - n*5);
      switch (difference) {
        case 0:
          progress += "⣀";
          break;
        case 1:
          progress += "⣄";
          break;
        case 2:
          progress += "⣤";
          break;
        case 3:
          progress += "⣦";
          break;
        case 4:
          progress += "⣶";
          break;
        case 4.5:
          progress += "⣷";
          break;
        case 5:
          progress += "⣿";
          break;
      }
    } else {
      progress += "⣀";
    }
    } else {
      progress += "⣿";
    }
  }
  return progress + "]";
}

// Healthcheck endpoint for Coolify
app.get('/health', (req, res) => {
  res.status(200).json({ status: "ok" })
})

// Bind to all interfaces for Docker
app.listen(port, '0.0.0.0', () => {
  console.log(`Year in  percentage app listening at http://0.0.0.0:${port}`)
})

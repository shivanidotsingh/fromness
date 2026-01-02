window.onload = function() {
  // Data array to hold city information and colors
  const timelineData = [
    // Updated: Lucknow is now from July 1992 to May 1993
    { name: "Lucknow, India", country: "India", startYear: 1992, startMonth: 7, endYear: 1993, endMonth: 5, color: "#0000FF" },
    // Updated: Doha starts in June 1993
    { name: "Doha, Qatar", country: "Gulf (Qatar and UAE)", startYear: 1993, startMonth: 6, endYear: 1997, endMonth: 6, color: "#008080" },
    { name: "Abu Dhabi, UAE", country: "Gulf (Qatar and UAE)", startYear: 1997, startMonth: 7, endYear: 2002, endMonth: 3, color: "#00CED1" },
    { name: "Lucknow, India", country: "India", startYear: 2002, startMonth: 4, endYear: 2003, endMonth: 3, color: "#0000FF" },
    { name: "Dehradun, India", country: "India", startYear: 2003, startMonth: 4, endYear: 2010, endMonth: 3, color: "#4B0082" },
    { name: "Ahmedabad, India", country: "India", startYear: 2010, startMonth: 6, endYear: 2014, endMonth: 6, color: "#800080" },
    { name: "Mumbai, India", country: "India", startYear: 2014, startMonth: 7, endYear: 2015, endMonth: 6, color: "#FF00FF" },
    { name: "Bangalore, India", country: "India", startYear: 2015, startMonth: 10, endYear: 2019, endMonth: 7, color: "#FF1493" },
    { name: "San Francisco, USA", country: "USA", startYear: 2019, startMonth: 8, endYear: 2023, endMonth: 3, color: "#8B0000" },
    { name: "Stockholm, Sweden", country: "Sweden", startYear: 2023, startMonth: 4, endYear: 2026, endMonth: 03, color: "#FF0000" },

    // Vacation and Internship data
    { name: "Lucknow, India (Vacation)", country: "India", isVacation: true, color: "#0000FF" },
    { name: "Abu Dhabi, UAE (Vacation)", country: "Gulf (Qatar and UAE)", isVacation: true, color: "#00CED1" },
    { name: "Goa, India (Internship)", country: "India", color: "#FFA500", isInternship: true, internshipYear: 2012, internshipMonths: [5, 6, 7] }, // May, Jun, Jul
    { name: "Dubai, UAE (Internship)", country: "Gulf (Qatar and UAE)", color: "#2E8B57", isInternship: true, internshipYear: 2015, internshipMonths: [7, 8, 9] } // Jul, Aug, Sep
  ];

  // Keep the start at July 1992 to yield 400 tiles through Oct 2025
  const startYear = 1992;
  const startMonth = 7;
  const endYear = 2026;
  const endMonth = 03; // 

  const gridContainer = document.getElementById('timeline-grid');
  const scorecardGrid = document.getElementById('scorecard-grid');
  const sortButton = document.getElementById('sort-button');
  const countryBar = document.getElementById('country-bar');

  let isSortedByTime = false;

  // Helper function to find city data by name
  const findCity = (name) => timelineData.find(d => d.name.startsWith(name));

  // Get specific city data for easy access
  const dohaData = findCity("Doha, Qatar");
  const abuDhabiData = findCity("Abu Dhabi, UAE");
  const lucknowDataEarly = timelineData.find(d => d.startYear === 1992 && d.name.startsWith("Lucknow"));
  const lucknowDataMain = timelineData.find(d => d.startYear === 2002 && d.name.startsWith("Lucknow"));
  const dehradunData = findCity("Dehradun, India");
  const ahmedabadData = findCity("Ahmedabad, India");
  const mumbaiData = findCity("Mumbai, India");
  const bangaloreData = findCity("Bangalore, India");
  const sanFranciscoData = findCity("San Francisco, USA");
  const stockholmData = findCity("Stockholm, Sweden");
  const lucknowVacationData = findCity("Lucknow, India (Vacation)");
  const abuDhabiVacationData = findCity("Abu Dhabi, UAE (Vacation)");
  const goaInternshipData = findCity("Goa, India (Internship)");
  const dubaiInternshipData = findCity("Dubai, UAE (Internship)");

  // --- Robust Timeline Generation Logic ---
  const chronologicalTimelineArray = [];
  const finalCityMonths = {};
  const cityColors = {};
  const countryMonths = {};
  const cityFirstYear = {};

  let currentYear = startYear;
  let currentMonth = startMonth;

  const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1; // 400

  // ✅ Fix #1: isWithinPeriod uses the provided (year, month)
  function isWithinPeriod(data, year, month) {
    const startTotal = data.startYear * 12 + data.startMonth;
    const endTotal   = data.endYear   * 12 + data.endMonth;
    const curTotal   = year * 12 + month;
    return curTotal >= startTotal && curTotal <= endTotal;
  }

  // ✅ Fix #2: getCityForMonth uses (year, month) everywhere
  function getCityForMonth(year, month) {
    // Priority 1: specific internships
    if (year === goaInternshipData.internshipYear && goaInternshipData.internshipMonths.includes(month)) {
      return goaInternshipData;
    }
    if (year === dubaiInternshipData.internshipYear && dubaiInternshipData.internshipMonths.includes(month)) {
      return dubaiInternshipData;
    }

    // Priority 2: vacations
    if (isWithinPeriod(stockholmData, year, month) && month === 1) { // Jan vacation during Stockholm
      return lucknowVacationData;
    }
    if (isWithinPeriod(dehradunData, year, month)) { // Vacations during Dehradun
      if (month === 6 || month === 12) return abuDhabiVacationData;
      if (month === 7 || month === 1)  return lucknowVacationData;
    }
    // Lucknow vacation in May during the Ahmedabad period
    if (isWithinPeriod(ahmedabadData, year, month) && month === 5) {
      return lucknowVacationData;
    }
    // July vacations during Abu Dhabi / Doha
    if (isWithinPeriod(abuDhabiData, year, month) && month === 7) {
      return lucknowVacationData;
    }
    if (isWithinPeriod(dohaData, year, month) && month === 7) {
      return lucknowVacationData;
    }

    // Fill gap between Dehradun and Ahmedabad (Apr–May 2010)
    if (year === 2010 && (month === 4 || month === 5)) {
      return lucknowDataMain;
    }

    // Priority 3: main cities
    if (isWithinPeriod(stockholmData, year, month))   return stockholmData;
    if (isWithinPeriod(sanFranciscoData, year, month))return sanFranciscoData;
    if (isWithinPeriod(bangaloreData, year, month))   return bangaloreData;
    if (isWithinPeriod(mumbaiData, year, month))      return mumbaiData;
    if (isWithinPeriod(ahmedabadData, year, month))   return ahmedabadData;
    if (isWithinPeriod(dehradunData, year, month))    return dehradunData;
    if (isWithinPeriod(lucknowDataMain, year, month)) return lucknowDataMain;
    if (isWithinPeriod(abuDhabiData, year, month))    return abuDhabiData;
    if (isWithinPeriod(dohaData, year, month))        return dohaData;
    if (isWithinPeriod(lucknowDataEarly, year, month))return lucknowDataEarly;

    // Fallback
    return { name: "Unknown", color: "#ccc" };
  }

  // Build the chronological month array
  for (let i = 0; i < totalMonths; i++) {
    const city = getCityForMonth(currentYear, currentMonth);
    chronologicalTimelineArray.push(city);

    // Count months for scorecard and country bar
    const baseCityName = city.name.replace(' (Vacation)', '').replace(' (Internship)', '');
    finalCityMonths[baseCityName] = (finalCityMonths[baseCityName] || 0) + 1;
    cityColors[baseCityName] = timelineData.find(d => d.name.startsWith(baseCityName))?.color || city.color;
    if (city.country) {
      countryMonths[city.country] = (countryMonths[city.country] || 0) + 1;
    }
    if (!cityFirstYear[baseCityName]) {
      const originalData = timelineData.find(d => d.name.startsWith(baseCityName));
      cityFirstYear[baseCityName] = originalData?.startYear || originalData?.internshipYear || currentYear;
    }

    // advance month
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
  }

  // Duration-sorted month array (same behavior, just a clearer name)
  function getDurationSortedTimeline() {
    const durationSortedCities = Object.entries(finalCityMonths)
      .map(([name, months]) => ({ name, months, color: cityColors[name] }));
    durationSortedCities.sort((a, b) => b.months - a.months);

    const sortedTimeline = [];
    durationSortedCities.forEach(city => {
      for (let i = 0; i < city.months; i++) {
        sortedTimeline.push({ name: city.name, color: city.color });
      }
    });
    return sortedTimeline;
  }

  const durationTimelineArray = getDurationSortedTimeline();

  // Renderers (unchanged)
  function renderTimeline(data) {
    gridContainer.innerHTML = '';
    const totalStartMonths = (startYear * 12) + startMonth;

    data.forEach((city, index) => {
      const monthDiv = document.createElement('div');
      monthDiv.className = `month-cell`;
      monthDiv.style.backgroundColor = city.color;

      const tooltipName = city.name.replace(' (Vacation)', '').replace(' (Internship)', '');
      monthDiv.innerHTML += `<span class="tooltip-text">${tooltipName}</span>`;

      // Keep the June 2010 marker behavior (index 215 with current start)
      if (index === 215) {
        monthDiv.style.cursor = 'pointer';
        monthDiv.addEventListener('click', () => {
          monthDiv.classList.add('circle-cell');
          monthDiv.innerHTML = `<span class="age-text">18</span>`;
          monthDiv.style.cursor = 'default';
        });
      }

      gridContainer.appendChild(monthDiv);
    });
  }

  function renderScorecard() {
    scorecardGrid.innerHTML = '';
    let cityYearTotals = Object.entries(finalCityMonths).map(([name, months]) => ({
      name: name,
      months: months,
      color: cityColors[name]
    }));

    if (!isSortedByTime) {
      cityYearTotals.sort((a, b) => cityFirstYear[a.name] - cityFirstYear[b.name]);
    } else {
      cityYearTotals.sort((a, b) => b.months - a.months);
    }

    cityYearTotals.forEach(item => {
      const scorecardItem = document.createElement('div');
      scorecardItem.className = 'scorecard-item';
      let displayTime;
      if (item.months < 12) {
        displayTime = `${item.months} month${item.months > 1 ? 's' : ''}`;
      } else {
        const years = item.months / 12;
        displayTime = `${years.toFixed(2)} years`;
      }
      const baseCityName = item.name.replace(' (Vacation)', '').replace(' (Internship)', '');
      scorecardItem.innerHTML = `<span style="color: ${item.color};">${baseCityName.split(',')[0]}</span>: ${displayTime}`;
      scorecardGrid.appendChild(scorecardItem);
    });
  }

  function renderCountryBar() {
    countryBar.innerHTML = '';
    const countries = Object.keys(countryMonths);
    const countryBarColors = {
      "Gulf (Qatar and UAE)": "linear-gradient(to right, #008080, #00CED1, #2E8B57)",
      "India": "linear-gradient(to right, #0000FF, #4B0082, #800080, #FF00FF, #FF1493, #FFA500)",
      "USA": "#8B0000",
      "Sweden": "#FF0000"
    };
    const totalMonthsAll = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

    countries.forEach(country => {
      const segmentDiv = document.createElement('div');
      const months = countryMonths[country];
      const percentage = (months / totalMonthsAll) * 100;

      segmentDiv.className = 'country-segment';
      segmentDiv.style.width = `${percentage}%`;
      segmentDiv.style.background = countryBarColors[country] || "#ccc";
      const years = months / 12;
      segmentDiv.innerHTML = `<span class="tooltip-text">${country}: ${years.toFixed(2)} years</span>`;
      countryBar.appendChild(segmentDiv);
    });
  }

  // Sort toggle
  sortButton.addEventListener('click', () => {
    isSortedByTime = !isSortedByTime;
    if (isSortedByTime) {
      sortButton.textContent = "Sort Chronologically";
      renderTimeline(durationTimelineArray);
    } else {
      sortButton.textContent = "Sort by Duration";
      renderTimeline(chronologicalTimelineArray);
    }
    renderScorecard();
  });

  // Initial render
  renderTimeline(chronologicalTimelineArray);
  renderScorecard();
  renderCountryBar();
};

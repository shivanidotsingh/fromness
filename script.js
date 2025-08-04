window.onload = function() {
    // Data array to hold city information and colors
    const timelineData = [
        { name: "Doha, Qatar", country: "Gulf (Qatar and UAE)", startYear: 1992, startMonth: 6, endYear: 1996, endMonth: 12, color: "#008080" },
        { name: "Abu Dhabi, UAE", country: "Gulf (Qatar and UAE)", startYear: 1997, startMonth: 1, endYear: 2002, endMonth: 3, color: "#00CED1" },
        { name: "Lucknow, India", country: "India", startYear: 2002, startMonth: 4, endYear: 2003, endMonth: 3, color: "#0000FF" },
        { name: "Dehradun, India", country: "India", startYear: 2003, startMonth: 4, endYear: 2010, endMonth: 3, color: "#4B0082" },
        { name: "Ahmedabad, India", country: "India", startYear: 2010, startMonth: 6, endYear: 2014, endMonth: 6, color: "#800080" },
        { name: "Mumbai, India", country: "India", startYear: 2014, startMonth: 7, endYear: 2015, endMonth: 6, color: "#FF00FF" },
        { name: "Bangalore, India", country: "India", startYear: 2015, startMonth: 10, endYear: 2019, endMonth: 7, color: "#FF1493" },
        { name: "San Francisco, USA", country: "USA", startYear: 2019, startMonth: 8, endYear: 2023, endMonth: 1, color: "#8B0000" }, 
        { name: "Stockholm, Sweden", country: "Sweden", startYear: 2023, startMonth: 2, endYear: 2025, endMonth: 7, color: "#FF0000" },
        // Vacation and Internship data
        { name: "Lucknow, India (Vacation)", country: "India", isVacation: true, color: "#0000FF" },
        { name: "Abu Dhabi, UAE (Vacation)", country: "Gulf (Qatar and UAE)", isVacation: true, color: "#00CED1" },
        { name: "Goa, India (Internship)", country: "India", color: "#FFA500", isInternship: true, internshipYear: 2012, internshipMonths: [5, 6, 7] }, // May, June, July
        { name: "Dubai, UAE (Internship)", country: "Gulf (Qatar and UAE)", color: "#2E8B57", isInternship: true, internshipYear: 2015, internshipMonths: [7, 8, 9] } // July, Aug, Sep
    ];

    // The timeline begins in June 1992.
    const startYear = 1992;
    const startMonth = 6;
    
    // Set the end date dynamically, with a cap at March 2026.
    const today = new Date();
    const capYear = 2026;
    const capMonth = 3; // March
    
    let endYear = today.getFullYear();
    let endMonth = today.getMonth() + 1; // getMonth() is 0-indexed

    if (endYear > capYear || (endYear === capYear && endMonth > capMonth)) {
        endYear = capYear;
        endMonth = capMonth;
    }

    const gridContainer = document.getElementById('timeline-grid');
    const scorecardGrid = document.getElementById('scorecard-grid');
    const sortButton = document.getElementById('sort-button');
    const countryBar = document.getElementById('country-bar');
    
    let isSortedByTime = false;

    // Helper function to find city data objects for easy access
    const findCity = (name) => timelineData.find(d => d.name === name);

    // Get specific city data objects
    const dohaData = findCity("Doha, Qatar");
    const abuDhabiData = findCity("Abu Dhabi, UAE");
    const lucknowData = findCity("Lucknow, India");
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
    
    // --- Timeline Generation Logic ---
    const chronologicalTimelineArray = [];
    const finalCityMonths = {};
    const cityColors = {};
    const countryMonths = {};
    const cityFirstYear = {};

    let currentYear = startYear;
    let currentMonth = startMonth;

    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    
    for (let i = 0; i < totalMonths; i++) {
        let city = null;

        // Force the very first tile to be Lucknow
        if (i === 0) {
            city = lucknowData;
        } 
        // Handle internships first as they have the highest priority
        else if (currentYear === goaInternshipData.internshipYear && goaInternshipData.internshipMonths.includes(currentMonth)) {
            city = goaInternshipData;
        } else if (currentYear === dubaiInternshipData.internshipYear && dubaiInternshipData.internshipMonths.includes(currentMonth)) {
            city = dubaiInternshipData;
        }
        // Handle special vacation breaks
        else if (
            // Lucknow vacation in Doha period (July)
            (currentYear >= dohaData.startYear && (currentYear < dohaData.endYear || (currentYear === dohaData.endYear && currentMonth <= dohaData.endMonth)) && currentMonth === 7) ||
            // Lucknow vacation in Abu Dhabi period (July)
            (currentYear >= abuDhabiData.startYear && (currentYear < abuDhabiData.endYear || (currentYear === abuDhabiData.endYear && currentMonth <= abuDhabiData.endMonth)) && currentMonth === 7) ||
            // Lucknow vacation in Ahmedabad period (July)
            (currentYear >= ahmedabadData.startYear && (currentYear < ahmedabadData.endYear || (currentYear === ahmedabadData.endYear && currentMonth <= ahmedabadData.endMonth)) && currentMonth === 7) ||
            // Lucknow vacation in Stockholm period (July 2024, after 11 months)
            (currentYear === 2024 && currentMonth === 7)
        ) {
            city = lucknowVacationData;
        } else if (
            // Lucknow vacation during the gap between Dehradun and Ahmedabad (April 2010)
            (currentYear === 2010 && currentMonth === 4) ||
            // Abu Dhabi vacation during the gap between Dehradun and Ahmedabad (May 2010)
            (currentYear === 2010 && currentMonth === 5)
        ) {
            city = currentMonth === 4 ? lucknowVacationData : abuDhabiVacationData;
        } else if (
            // Dehradun cycle breaks (Lucknow and Abu Dhabi every 6 months)
            (currentYear >= dehradunData.startYear && (currentYear < dehradunData.endYear || (currentYear === dehradunData.endYear && currentMonth <= dehradunData.endMonth)))
        ) {
            const dehradunMonthsPassed = (currentYear - dehradunData.startYear) * 12 + (currentMonth - dehradunData.startMonth);
            if (dehradunMonthsPassed > 0) { // Cycle starts after the first month
                 const cycleIndex = dehradunMonthsPassed % 6;
                 if (cycleIndex === 4) { // The 5th month of the cycle (index 4)
                     city = lucknowVacationData;
                 } else if (cycleIndex === 5) { // The 6th month of the cycle (index 5)
                     city = abuDhabiVacationData;
                 } else {
                     city = dehradunData;
                 }
            } else {
                 city = dehradunData;
            }
        }
        
        // Handle main city periods (lowest priority)
        if (!city) {
            if (currentYear >= dohaData.startYear && (currentYear < dohaData.endYear || (currentYear === dohaData.endYear && currentMonth <= dohaData.endMonth))) {
                city = dohaData;
            } else if (currentYear >= abuDhabiData.startYear && (currentYear < abuDhabiData.endYear || (currentYear === abuDhabiData.endYear && currentMonth <= abuDhabiData.endMonth))) {
                city = abuDhabiData;
            } else if (currentYear >= lucknowData.startYear && (currentYear < lucknowData.endYear || (currentYear === lucknowData.endYear && currentMonth <= lucknowData.endMonth))) {
                city = lucknowData;
            } else if (currentYear >= ahmedabadData.startYear && (currentYear < ahmedabadData.endYear || (currentYear === ahmedabadData.endYear && currentMonth <= ahmedabadData.endMonth))) {
                city = ahmedabadData;
            } else if (currentYear >= mumbaiData.startYear && (currentYear < mumbaiData.endYear || (currentYear === mumbaiData.endYear && currentMonth <= mumbaiData.endMonth))) {
                city = mumbaiData;
            } else if (currentYear >= bangaloreData.startYear && (currentYear < bangaloreData.endYear || (currentYear === bangaloreData.endYear && currentMonth <= bangaloreData.endMonth))) {
                city = bangaloreData;
            } else if (currentYear >= sanFranciscoData.startYear && (currentYear < sanFranciscoData.endYear || (currentYear === sanFranciscoData.endYear && currentMonth <= sanFranciscoData.endMonth))) {
                city = sanFranciscoData;
            } else if (currentYear >= stockholmData.startYear && (currentYear < stockholmData.endYear || (currentYear === stockholmData.endYear && currentMonth <= stockholmData.endMonth))) {
                city = stockholmData;
            }
        }

        // Push the determined city to the timeline array
        chronologicalTimelineArray.push(city);
        
        // Count months for scorecard and country bar
        const baseCityName = city.name.replace(' (Vacation)', '').replace(' (Internship)', '');
        
        finalCityMonths[baseCityName] = (finalCityMonths[baseCityName] || 0) + 1;
        cityColors[baseCityName] = timelineData.find(d => d.name.startsWith(baseCityName))?.color || city.color;
        
        if (city.country) {
             countryMonths[city.country] = (countryMonths[city.country] || 0) + 1;
        }

        // Keep track of the first appearance year for chronological sorting
        if (!cityFirstYear[baseCityName]) {
            const originalData = timelineData.find(d => d.name.startsWith(baseCityName));
            cityFirstYear[baseCityName] = originalData?.startYear || originalData?.internshipYear || currentYear;
        }

        // Increment month and year
        currentMonth++;
        if (currentMonth > 12) {
            currentMonth = 1;
            currentYear++;
        }
    }

    // Function to create a duration-sorted timeline array
    function getDurationSortedTimeline() {
        const durationSortedCities = Object.entries(finalCityMonths)
            .map(([name, months]) => ({ name, months, color: cityColors[name] }));
        
        durationSortedCities.sort((a, b) => b.months - a.months);
        
        const sortedTimeline = [];
        durationSortedCities.forEach(city => {
            const originalCity = timelineData.find(d => d.name.startsWith(city.name));
            for (let i = 0; i < city.months; i++) {
                sortedTimeline.push({ name: city.name, color: originalCity.color });
            }
        });
        return sortedTimeline;
    }
    
    const durationTimelineArray = getDurationSortedTimeline();

    // Function to render the timeline grid
    function renderTimeline(data) {
        gridContainer.innerHTML = '';
        data.forEach((city, index) => {
            const monthDiv = document.createElement('div');
            monthDiv.className = `month-cell`;
            monthDiv.style.backgroundColor = city.color;
            
            // Remove the vacation/internship suffixes from the tooltip
            const tooltipName = city.name.replace(' (Vacation)', '').replace(' (Internship)', '');
            monthDiv.innerHTML = `<span class="tooltip-text">${tooltipName}</span>`;

            // Identify the 217th tile (index 216) and make it clickable
            if (index === 216) {
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
    
    // Function to render the scorecard based on sort type
    function renderScorecard() {
        scorecardGrid.innerHTML = '';
        
        let cityYearTotals = Object.entries(finalCityMonths).map(([name, months]) => ({
            name: name,
            months: months,
            color: cityColors[name]
        }));

        if (!isSortedByTime) { // Chronological
            cityYearTotals.sort((a, b) => cityFirstYear[a.name] - cityFirstYear[b.name]);
        } else { // By time spent
            cityYearTotals.sort((a, b) => b.months - a.months);
        }

        cityYearTotals.forEach(item => {
            const scorecardItem = document.createElement('div');
            scorecardItem.className = 'scorecard-item';
            
            let displayTime;
            // Correctly display months for stays less than a year
            if (item.months < 12) {
                displayTime = `${item.months} month${item.months > 1 ? 's' : ''}`;
            } else {
                const years = item.months / 12;
                displayTime = `${years.toFixed(2)} years`;
            }
            
            scorecardItem.innerHTML = `<span style="color: ${item.color};">${item.name}</span>: ${displayTime}`;
            scorecardGrid.appendChild(scorecardItem);
        });
    }
    
    // Function to render the country bar
    function renderCountryBar() {
        countryBar.innerHTML = '';
        const countries = Object.keys(countryMonths);
        
        const countryBarColors = {
            "Gulf (Qatar and UAE)": "linear-gradient(to right, #008080, #00CED1, #2E8B57)",
            "India": "linear-gradient(to right, #0000FF, #4B0082, #800080, #FF00FF, #FF1493, #FFA500)",
            "USA": "#8B0000",
            "Sweden": "#FF0000"
        };
        const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;

        countries.forEach(country => {
            const segmentDiv = document.createElement('div');
            const months = countryMonths[country];
            const percentage = (months / totalMonths) * 100;

            segmentDiv.className = 'country-segment';
            segmentDiv.style.width = `${percentage}%`;
            segmentDiv.style.background = countryBarColors[country] || "#ccc";
            
            let displayTime;
            const years = months / 12;
            displayTime = `${years.toFixed(2)} years`;
            segmentDiv.innerHTML = `<span class="tooltip-text">${country}: ${displayTime}</span>`;
            countryBar.appendChild(segmentDiv);
        });
    }

    // Event listener for the sort button
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

    // Initial render of the timeline (chronological), scorecard, and country bar
    renderTimeline(chronologicalTimelineArray);
    renderScorecard();
    renderCountryBar();
};

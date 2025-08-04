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

    // The timeline begins in June 1992 and ends in August 2025.
    const startYear = 1992;
    const startMonth = 6;
    const endYear = 2025;
    const endMonth = 8;
    
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
    
    // --- New Timeline Generation Logic ---
    const chronologicalTimelineArray = [];
    const finalCityMonths = {};
    const cityColors = {};
    const countryMonths = {};
    
    let currentYear = startYear;
    let currentMonth = startMonth;

    const totalMonths = (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    
    // The index of the month when the Dehradun period starts.
    const dehradunStartIndex = (2003 - startYear) * 12 + (4 - startMonth);

    for (let i = 0; i < totalMonths; i++) {
        let city = null;

        // Check for internships first, as they have the highest priority
        const internship = timelineData.find(d => d.isInternship && d.internshipYear === currentYear && d.internshipMonths.includes(currentMonth));
        if (internship) {
            city = internship;
        } else {
            // Determine the main city or vacation based on the current year and month
            if (currentYear >= 1992 && (currentYear < 1997 || (currentYear === 1996 && currentMonth <= 12))) {
                // Doha period, with a July break to Lucknow
                city = (currentMonth === 7 && currentYear < 1997) ? lucknowVacationData : dohaData;
            } else if (currentYear >= 1997 && (currentYear < 2002 || (currentYear === 2002 && currentMonth <= 3))) {
                // Abu Dhabi period, with a July break to Lucknow
                city = (currentMonth === 7 && currentYear < 2002) ? lucknowVacationData : abuDhabiData;
            } else if (currentYear >= 2002 && (currentYear < 2003 || (currentYear === 2003 && currentMonth <= 3))) {
                city = lucknowData;
            } else if (currentYear >= 2003 && (currentYear < 2010 || (currentYear === 2010 && currentMonth <= 3))) {
                // Corrected Dehradun logic: a repeating cycle of 4 Dehradun, 1 Lucknow, 1 Abu Dhabi
                const monthIndexInDehradun = i - dehradunStartIndex;
                const cycleIndex = monthIndexInDehradun % 6;
                if (cycleIndex <= 3) {
                    city = dehradunData;
                } else if (cycleIndex === 4) {
                    city = lucknowVacationData;
                } else { // cycleIndex === 5
                    city = abuDhabiVacationData;
                }
            } else if (currentYear === 2010) {
                // The gap between Dehradun and Ahmedabad
                if (currentMonth === 4) city = lucknowVacationData;
                else if (currentMonth === 5) city = abuDhabiVacationData;
                else if (currentMonth >= 6) city = ahmedabadData;
                else city = dehradunData;
            } else if (currentYear >= 2010 && (currentYear < 2014 || (currentYear === 2014 && currentMonth <= 6))) {
                // Ahmedabad period, with a July break to Lucknow
                city = (currentYear < 2014 && currentMonth === 7) ? lucknowVacationData : ahmedabadData;
            } else if (currentYear >= 2014 && (currentYear < 2015 || (currentYear === 2015 && currentMonth <= 6))) {
                city = mumbaiData;
            } else if (currentYear >= 2015 && (currentYear < 2019 || (currentYear === 2019 && currentMonth <= 7))) {
                city = bangaloreData;
            } else if (currentYear >= 2019 && (currentYear < 2023 || (currentYear === 2023 && currentMonth <= 1))) {
                city = sanFranciscoData;
            } else if (currentYear >= 2023 && (currentYear < 2025 || (currentYear === 2025 && currentMonth <= 8))) {
                // Stockholm period, with a July break to Lucknow
                city = (currentYear < 2025 && currentMonth === 7) ? lucknowVacationData : stockholmData;
            }
        }
        
        // Push the determined city to the timeline array
        chronologicalTimelineArray.push(city);
        
        // Count months for scorecard and country bar. We now use the full name as the key.
        const cityNameWithSuffix = city.name;
        if (!finalCityMonths[cityNameWithSuffix]) {
            finalCityMonths[cityNameWithSuffix] = 0;
            cityColors[cityNameWithSuffix] = city.color;
        }
        finalCityMonths[cityNameWithSuffix]++;

        if (city.country) {
             countryMonths[city.country] = (countryMonths[city.country] || 0) + 1;
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
            for (let i = 0; i < city.months; i++) {
                // Find the original city data object to get the color
                const originalCity = timelineData.find(d => d.name === city.name);
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
                
                // Add a click listener to the tile
                monthDiv.addEventListener('click', () => {
                    // Change the class to apply the circular style and add the number
                    monthDiv.classList.add('circle-cell');
                    monthDiv.innerHTML = `<span class="age-text">18</span>`;
                    monthDiv.style.cursor = 'default';
                });
            }
            
            gridContainer.appendChild(monthDiv);
        });
    }
    
    // Function to get the first year for sorting chronologically
    function getFirstYear(name) {
        const item = timelineData.find(d => d.name === name);
        return item ? (item.startYear || item.internshipYear) : Infinity;
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
            cityYearTotals.sort((a, b) => {
                const yearA = getFirstYear(a.name);
                const yearB = getFirstYear(b.name);
                return yearA - yearB;
            });
        } else { // By time spent
            cityYearTotals.sort((a, b) => b.months - a.months);
        }

        cityYearTotals.forEach(item => {
            const scorecardItem = document.createElement('div');
            scorecardItem.className = 'scorecard-item';
            
            let displayTime;
            // The check is now based on whether the name includes the internship or vacation suffix.
            if (item.name.includes("(Internship)") || item.name.includes("(Vacation)")) {
                displayTime = `${item.months} months`;
            } else {
                const years = item.months / 12;
                displayTime = `${years.toFixed(2)} years`;
            }
            
            // To get a cleaner name for display, we remove the suffixes.
            const displayName = item.name.replace(' (Vacation)', '').replace(' (Internship)', '').split(',')[0];
            scorecardItem.innerHTML = `<span style="color: ${item.color};">${displayName}</span>: ${displayTime}`;
            scorecardGrid.appendChild(scorecardItem);
        });
    }
    
    // Function to render the country bar
    function renderCountryBar() {
        countryBar.innerHTML = '';
        const countries = Object.keys(countryMonths);
        
        const countryBarColors = {
            "Gulf (Qatar and UAE)": "linear-gradient(to right, #008080, #00CED1)",
            "India": "linear-gradient(to right, #4B0082, #800080, #0000FF, #FF00FF, #FF1493, #FFA500)",
            "USA": "#8B0000",
            "Sweden": "#FF0000"
        };

        countries.forEach(country => {
            const segmentDiv = document.createElement('div');
            const months = countryMonths[country];
            const percentage = (months / totalMonths) * 100;

            segmentDiv.className = 'country-segment';
            segmentDiv.style.width = `${percentage}%`;
            
            if (country === "Gulf (Qatar and UAE)") {
                segmentDiv.style.background = countryBarColors[country];
            } else if (country === "India") {
                segmentDiv.style.background = countryBarColors[country];
            } else {
                segmentDiv.style.backgroundColor = countryBarColors[country];
            }

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

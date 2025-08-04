window.onload = function() {
    // Data array to hold city information and colors
    const timelineData = [
        // Combined Qatar and UAE into a single 'Gulf' country category
        { name: "Doha, Qatar", country: "Gulf (Qatar and UAE)", startYear: 1992, startMonth: 5, endYear: 1996, endMonth: 12, color: "#008080" },
        { name: "Abu Dhabi, UAE", country: "Gulf (Qatar and UAE)", startYear: 1997, startMonth: 1, endYear: 2002, endMonth: 3, color: "#00CED1" },
        { name: "Lucknow, India", country: "India", startYear: 2002, startMonth: 4, endYear: 2003, endMonth: 3, color: "#0000FF" },
        { name: "Dehradun, India", country: "India", startYear: 2003, startMonth: 4, endYear: 2010, endMonth: 3, color: "#4B0082" },
        { name: "Ahmedabad, India", country: "India", startYear: 2010, startMonth: 6, endYear: 2014, endMonth: 6, color: "#800080" },
        // Corrected Mumbai data to reflect July 2014 to June 2015 (12 months)
        { name: "Mumbai, India", country: "India", startYear: 2014, startMonth: 7, endYear: 2015, endMonth: 6, color: "#FF00FF" },
        { name: "Bangalore, India", country: "India", startYear: 2015, startMonth: 10, endYear: 2019, endMonth: 7, color: "#FF1493" },
        // Corrected San Francisco to be 3.5 years (42 months), from Aug 2019 to Jan 2023.
        { name: "San Francisco, USA", country: "USA", startYear: 2019, startMonth: 8, endYear: 2023, endMonth: 1, color: "#8B0000" }, 
        { name: "Stockholm, Sweden", country: "Sweden", startYear: 2023, startMonth: 2, endYear: 2025, endMonth: 7, color: "#FF0000" },
        { name: "Goa, India (Internship)", country: "India", color: "#FFA500", isInternship: true, internshipYear: 2012, internshipMonths: [5, 6, 7] },
        { name: "Dubai, UAE (Internship)", country: "Gulf (Qatar and UAE)", color: "#2E8B57", isInternship: true, internshipYear: 2015, internshipMonths: [7, 8, 9] }
    ];

    // The timeline begins in June 1992 and ends in August 2025.
    const startYear = 1992;
    const startMonthIndex = 5; // June is the 6th month, 0-indexed is 5
    const endYear = 2025;
    const endMonthIndex = 7; // August is the 8th month, 0-indexed is 7
    
    const gridContainer = document.getElementById('timeline-grid');
    const scorecardGrid = document.getElementById('scorecard-grid');
    const sortButton = document.getElementById('sort-button');
    const countryBar = document.getElementById('country-bar');
    
    let isSortedByTime = false; // Initial state is chronological

    // Function to calculate the number of months between two dates, inclusive
    function getMonthCount(startYear, startMonth, endYear, endMonth) {
        return (endYear - startYear) * 12 + (endMonth - startMonth) + 1;
    }
    
    const totalMonths = getMonthCount(startYear, startMonthIndex + 1, endYear, endMonthIndex + 1);
    
    // Function to get the first year for sorting chronologically
    function getFirstYear(name) {
        const item = timelineData.find(d => d.name.replace(' (Internship)', '') === name);
        return item ? (item.startYear || item.internshipYear) : Infinity;
    }

    // Get specific city data objects for easy access in the grid rendering loop
    const lucknowData = timelineData.find(d => d.name.includes("Lucknow") && d.startYear === 2002);
    const abuDhabiData = timelineData.find(d => d.name.includes("Abu Dhabi") && !d.isInternship);
    const dohaData = timelineData.find(d => d.name.includes("Doha"));
    const dehradunData = timelineData.find(d => d.name.includes("Dehradun"));
    const stockholmData = timelineData.find(d => d.name.includes("Stockholm"));
    const ahmedabadData = timelineData.find(d => d.name.includes("Ahmedabad"));
    const mumbaiData = timelineData.find(d => d.name.includes("Mumbai"));
    const bangaloreData = timelineData.find(d => d.name.includes("Bangalore"));
    const sanFranciscoData = timelineData.find(d => d.name.includes("San Francisco"));
    const dubaiData = timelineData.find(d => d.name.includes("Dubai"));
    const goaData = timelineData.find(d => d.name.includes("Goa"));
    
    const finalCityMonths = {};
    const cityColors = {};
    const countryMonths = {};
    
    // --- New Timeline Rendering Logic ---
    const chronologicalTimelineArray = [];
    
    // Generate the chronological timeline once
    for (let i = 0; i < totalMonths; i++) {
        const city = getCityForMonth(i);
        chronologicalTimelineArray.push(city);
        
        const displayName = city.name.replace(' (Internship)', '');
        if (!finalCityMonths[displayName]) {
            finalCityMonths[displayName] = 0;
            cityColors[displayName] = city.color;
        }
        finalCityMonths[displayName]++;

        if (city.country) {
             countryMonths[city.country] = (countryMonths[city.country] || 0) + 1;
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
                sortedTimeline.push({ name: city.name, color: city.color });
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
            
            monthDiv.innerHTML = `<span class="tooltip-text">${city.name}</span>`;

            // Identify the 217th tile (index 216) and make it clickable
            if (index === 216) {
                monthDiv.style.cursor = 'pointer';
                
                // Add a click listener to the tile
                monthDiv.addEventListener('click', () => {
                    // Change the class to apply the circular style and add the number
                    monthDiv.classList.add('circle-cell');
                    monthDiv.innerHTML = `<span class="age-text">18</span>`;
                    monthDiv.style.cursor = 'default'; // Make it non-clickable after the first click
                });
            }
            
            gridContainer.appendChild(monthDiv);
        });
    }

    // Function to determine which city tile should be displayed for a given month index
    function getCityForMonth(monthIndex) {
        const totalMonthCountFromStart = monthIndex + startMonthIndex;
        const currentYear = startYear + Math.floor(totalMonthCountFromStart / 12);
        const currentMonth = totalMonthCountFromStart % 12; // 0-indexed month

        // Check for internships first as they override
        const internship = timelineData.find(d => d.isInternship && d.internshipYear === currentYear && d.internshipMonths.includes(currentMonth + 1));
        if (internship) return internship;

        // Check for each city chronologically
        
        // Stockholm (Feb 2023 - Jul 2025)
        if ((currentYear === 2023 && currentMonth >= 1) || (currentYear > 2023 && currentYear < 2025) || (currentYear === 2025 && currentMonth <= 6)) {
            return stockholmData;
        }

        // San Francisco (Aug 2019 - Jan 2023)
        if ((currentYear === 2019 && currentMonth >= 7) || (currentYear > 2019 && currentYear < 2023) || (currentYear === 2023 && currentMonth === 0)) {
            return sanFranciscoData;
        }

        // Bangalore (Oct 2015 - Jul 2019)
        if ((currentYear === 2015 && currentMonth >= 9) || (currentYear > 2015 && currentYear < 2019) || (currentYear === 2019 && currentMonth <= 6)) {
            return bangaloreData;
        }

        // Mumbai (July 2014 - June 2015)
        if ((currentYear === 2014 && currentMonth >= 6) || (currentYear === 2015 && currentMonth <= 5)) {
            return mumbaiData;
        }

        // Ahmedabad (June 2010 - June 2014)
        if ((currentYear === 2010 && currentMonth >= 5) || (currentYear > 2010 && currentYear < 2014) || (currentYear === 2014 && currentMonth <= 5)) {
            return ahmedabadData;
        }
        
        // Corrected gap: April 2010 is Lucknow, May 2010 is Abu Dhabi
        if (currentYear === 2010) {
            if (currentMonth === 3) return lucknowData;
            if (currentMonth === 4) return abuDhabiData;
        }

        // Dehradun (April 2003 - March 2010)
        if (currentYear >= 2003 && (currentYear < 2010 || (currentYear === 2010 && currentMonth <= 2))) {
            return dehradunData;
        }

        // Lucknow (April 2002 - March 2003)
        if (currentYear === 2002 && currentMonth >= 3 || currentYear === 2003 && currentMonth <= 2) {
            return lucknowData;
        }
        
        // Abu Dhabi (Jan 1997 - March 2002)
        if (currentYear >= 1997 && (currentYear < 2002 || (currentYear === 2002 && currentMonth <= 2))) {
            return abuDhabiData;
        }

        // Doha (June 1992 - Dec 1996)
        if (currentYear >= 1992 && (currentYear < 1997 || (currentYear === 1996 && currentMonth <= 11))) {
            return dohaData;
        }

        return { name: "Unknown", color: "#ccc" };
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
            // Check if the item is an internship to display in months
            if (item.name.includes("(Internship)")) {
                displayTime = `${item.months} months`;
            } else {
                const years = item.months / 12;
                displayTime = `${years.toFixed(2)} years`;
            }
            
            const cityName = item.name.split(',')[0];
            scorecardItem.innerHTML = `<span style="color: ${item.color};">${cityName}</span>: ${displayTime}`;
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

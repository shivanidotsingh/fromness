window.onload = function() {
    // Data array to hold city information and colors
    const timelineData = [
        { name: "Doha, Qatar", country: "Gulf (Qatar and UAE)", startYear: 1992, startMonth: 5, endYear: 1996, endMonth: 12, color: "#008080" },
        { name: "Abu Dhabi, UAE", country: "Gulf (Qatar and UAE)", startYear: 1997, startMonth: 1, endYear: 2002, endMonth: 3, color: "#00CED1" },
        { name: "Lucknow, India", country: "India", startYear: 2002, startMonth: 4, endYear: 2003, endMonth: 3, color: "#0000FF" },
        { name: "Dehradun, India", country: "India", startYear: 2003, startMonth: 4, endYear: 2010, endMonth: 3, color: "#4B0082" },
        { name: "Ahmedabad, India", country: "India", startYear: 2010, startMonth: 6, endYear: 2014, endMonth: 6, color: "#800080" },
        { name: "Mumbai, India", country: "India", startYear: 2014, startMonth: 7, endYear: 2015, endMonth: 6, color: "#FF00FF" },
        { name: "Bangalore, India", country: "India", startYear: 2015, startMonth: 10, endYear: 2019, endMonth: 7, color: "#FF1493" },
        { name: "San Francisco, USA", country: "USA", startYear: 2019, startMonth: 8, endYear: 2023, endMonth: 1, color: "#8B0000" },
        { name: "Stockholm, Sweden", country: "Sweden", startYear: 2023, startMonth: 2, endYear: 2025, endMonth: 7, color: "#FF0000" },
        { name: "Goa, India (Internship)", country: "India", color: "#FFA500", isInternship: true, internshipYear: 2012, internshipMonths: [5, 6, 7] },
        { name: "Dubai, UAE (Internship)", country: "Gulf (Qatar and UAE)", color: "#2E8B57", isInternship: true, internshipYear: 2015, internshipMonths: [7, 8, 9] }
    ];

    // The timeline begins in June 1992 and ends in August 2025.
    const startYear = 1992;
    const startMonthIndex = 5;
    const endYear = 2025;
    const endMonthIndex = 7;

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

    // Definitions for city data objects (lucknowData, abuDhabiData, etc.) ...
    // (same as you provided, no changes here for brevity)

    // (getCityForMonth function and other timeline logic is unchanged)

    // Generating timelines, rendering functions, scorecard, country bar...
    // (unchanged, omitted here for brevity)

    // Initial renders
    renderTimeline(chronologicalTimelineArray);
    renderScorecard();
    renderCountryBar();

    // Gravity stacking trigger linked to visible button
    document.getElementById("gravity-trigger").addEventListener("click", function() {
        gridContainer.classList.add("gravity-mode");

        let columns = window.innerWidth < 768 ? 10 : 6;

        const cells = Array.from(gridContainer.children);
        const cellWidth = cells[0].offsetWidth;
        const cellHeight = cells[0].offsetHeight;
        let stacks = Array(columns).fill(0);

        cells.forEach((cell, i) => {
            let col = i % columns;
            let row = Math.floor(i / columns);

            cell.style.position = 'absolute';
            cell.style.left = (col * (cellWidth + 1)) + 'px';
            cell.style.top = (row * (cellHeight + 1)) + 'px';
            cell.style.transition = 'top 1s cubic-bezier(.18,.89,.32,1.28), left 1s cubic-bezier(.18,.89,.32,1.28)';
            cell.style.zIndex = 2;
            cell.setAttribute('data-col', col);
        });

        setTimeout(() => {
            cells.reverse().forEach(cell => {
                const col = parseInt(cell.getAttribute('data-col'));
                const stackHeight = stacks[col];
                cell.style.top = (gridContainer.offsetHeight - cellHeight * (stackHeight + 1)) + 'px';
                stacks[col]++;
            });
        }, 100);
    });

    // Assign the 5th cell in 5th row as the secret clickable tile, with pointer cursor for testing
    const monthCells = document.querySelectorAll('#timeline-grid .month-cell');
    const row = 4; // zero-indexed
    const col = 4;
    const columns = window.innerWidth < 768 ? 10 : 6;
    const triggerIndex = row * columns + col;

    if (monthCells[triggerIndex]) {
        const secretCell = monthCells[triggerIndex];
        secretCell.classList.add('secret-trigger'); // Add pointer cursor via CSS

        secretCell.addEventListener('click', () => {
            console.log("Secret cell clicked!");
            document.getElementById("gravity-trigger").click();
        });
    }
};

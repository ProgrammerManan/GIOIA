document.getElementById("giftForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Prevent form submission
    const description = document.getElementById("description").value;
    const submitBtn = document.getElementById("submitBtn");
    const giftResults = document.getElementById("giftResults");

    // Clear previous results
    giftResults.innerHTML = '';

    // Disable button to prevent multiple submissions
    submitBtn.disabled = true;
    submitBtn.textContent = "Searching...";

    try {
        // Send description to backend
        const response = await fetch("http://localhost:3000/scrape-gifts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ description }),
        });

        const gifts = await response.json();

        // Render the results dynamically
        if (gifts.length > 0) {
            gifts.forEach(gift => {
                const card = document.createElement("div");
                card.classList.add("gift-card");
                card.innerHTML = `<a href="${gift.url}" target="_blank" rel="noopener noreferrer">${gift.name}</a>`;
                giftResults.appendChild(card);
            });
        } else {
            giftResults.innerHTML = "<p>No gifts found. Try a different description.</p>";
        }
    } catch (error) {
        console.error("Error fetching gift suggestions:", error);
        giftResults.innerHTML = "<p>Something went wrong. Please try again later.</p>";
    }

    // Re-enable the button
    submitBtn.disabled = false;
    submitBtn.textContent = "Find Gifts";
});

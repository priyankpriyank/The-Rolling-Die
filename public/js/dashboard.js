document.addEventListener("DOMContentLoaded", function() {

    // Connect to Socket.IO server
    const socket = io();

    // Activity container
    const activityList = document.getElementById("activity-list");

    // Connection status
    const connectionStatus = document.getElementById("connection-status");

    // Connected
    socket.on("connect", function() {

        console.log("Connected to live activity server");

        connectionStatus.textContent = "Live - Connected";

        connectionStatus.className = "connection-online";

    });

    // Disconnected
    socket.on("disconnect", function() {

        console.log("Disconnected from live activity server");

        connectionStatus.textContent = "Disconnected";

        connectionStatus.className = "connection-offline";

    });

    // Authentication or connection errors
    socket.on("connect_error", function(error) {

        console.error("Socket connection error:", error.message);

        connectionStatus.textContent = "Connection Error";

        connectionStatus.className = "connection-offline";

    });

    // Receive Discord bot activity
    socket.on("botactivity", function(data) {

        console.log("New bot activity:", data);

        // Remove placeholder message
        const placeholder = document.getElementById("no-activity");

        if (placeholder) {
            placeholder.remove();
        }

        // Create activity item
        const activityItem = document.createElement("div");

        activityItem.className = "activity-item";

        const time = document.createElement("span");
        time.className = "activity-time";
        time.textContent = data.time;

        const command = document.createElement("span");
        command.className = "activity-command";
        command.textContent = "/" + data.command;

        const title = document.createElement("span");
        title.className = "activity-title";
        title.textContent = data.title;

        const status = document.createElement("span");
        status.className = "activity-status";
        status.textContent = data.status;

        // Add elements
        activityItem.appendChild(time);
        activityItem.appendChild(command);
        activityItem.appendChild(title);
        activityItem.appendChild(status);

        // Newest activity first
        activityList.prepend(activityItem);

        // Keep only the latest 10 activities
        while (activityList.children.length > 10) {

            activityList.removeChild(activityList.lastChild);

        }

    });

});
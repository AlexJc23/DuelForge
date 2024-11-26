export function getGreeting() {
    const now = new Date();
    const hour = now.getHours(); // Get the current hour (0-23)

    if (hour < 12) {
      return "Good Morning,";
    } else if (hour < 18) {
      return "Good Afternoon,";
    } else {
      return "Good Evening,";
    }
  }

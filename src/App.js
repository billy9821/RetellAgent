import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [phoneNumber, setPhoneNumber] = useState("");

  const handleNumberClick = (number) => {
    // Only allow up to 10 digits for US phone numbers
    if (phoneNumber.length < 10) {
      setPhoneNumber((prev) => prev + number);
    }
  };

  const handleDelete = () => {
    setPhoneNumber((prev) => prev.slice(0, -1));
  };

  const handleCall = async () => {
    // Validate phone number format (10 digits for US numbers)
    if (phoneNumber.length !== 10) {
      const notification = document.createElement("div");
      notification.textContent =
        "Please enter a valid 10-digit US phone number";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ef4444;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out`;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => notification.remove(), 300);
      }, 3000);
      return;
    }

    try {
      await axios.post("http://52.202.249.155:5001/api/call", {
        phoneNumber: `1${phoneNumber}`,
      });
      console.log("Calling:", phoneNumber);
      // Using a more styled notification approach
      const notification = document.createElement("div");
      notification.textContent = "Call initiated successfully!";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #4CAF50;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out`;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    } catch (error) {
      console.error("Error making call:", error);
      const notification = document.createElement("div");
      notification.textContent = "Failed to initiate call. Please try again.";
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background-color: #ef4444;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        animation: slideIn 0.3s ease-out`;
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.style.animation = "slideOut 0.3s ease-in";
        setTimeout(() => notification.remove(), 300);
      }, 3000);
    }
  };

  // Handle keyboard input
  useEffect(() => {
    const handleKeyPress = (event) => {
      const key = event.key;

      // Check if the pressed key is a number, * or #
      if (/^[0-9*#]$/.test(key)) {
        // Only handle number keys if phone number length is less than 10
        if (phoneNumber.length < 10) {
          handleNumberClick(key);
        }
      }
      // Handle backspace/delete key
      else if (key === "Backspace" || key === "Delete") {
        handleDelete();
      }
      // Handle enter key for call
      else if (key === "Enter" && phoneNumber) {
        handleCall();
      }
    };

    // Add event listener
    window.addEventListener("keydown", handleKeyPress);

    // Cleanup
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [phoneNumber]); // Include phoneNumber in dependencies

  // Format phone number for display
  const formattedPhoneNumber = phoneNumber
    ? `(${phoneNumber.slice(0, 3)})${
        phoneNumber.length > 3 ? " " + phoneNumber.slice(3, 6) : ""
      }${phoneNumber.length > 6 ? "-" + phoneNumber.slice(6) : ""}`
    : "(123) 456-7890";

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="flex gap-8">
        {/* Description Panel */}

        <div className="bg-white rounded-3xl shadow-2xl p-8 w-96">
          <h2 className="text-2xl text-center font-bold text-gray-800 mb-4">
            Radiance Aesthetic Clinic
          </h2>
          <div className="space-y-4 text-gray-600">
            <div>
              <h3 className="font-semibold mb-2">1. Enter Phone Number</h3>
              <p>
                Click the number buttons or use your keyboard to input a
                10-digit phone number.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">2. Make Corrections</h3>
              <p>
                Use the delete button or backspace key to correct any mistakes.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">3. Start the Call</h3>
              <p>
                Once you've entered all 10 digits, click the "Call" button or
                press Enter to initiate the call.
              </p>
            </div>
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-blue-600 font-medium">
                Note: This dialer only accepts 10-digit phone numbers and will
                automatically format them for better readability.
              </p>
            </div>
          </div>
        </div>

        {/* Dial Pad */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 w-96">
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <input
              type="text"
              className="w-full text-3xl font-semibold text-gray-700 text-center focus:outline-none bg-transparent"
              value={formattedPhoneNumber}
              readOnly
            />
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, "*", 0, "#"].map((number) => (
              <button
                key={number}
                className="h-14 rounded-lg bg-gray-50 hover:bg-gray-100 text-2xl font-medium text-gray-700 transition-colors duration-200 flex items-center justify-center"
                onClick={() => handleNumberClick(number)}
                disabled={phoneNumber.length >= 10}
              >
                {number}
              </button>
            ))}
          </div>

          <div className="flex gap-4">
            <button
              className={`flex-1 py-4 rounded-xl text-white font-semibold transition-colors duration-200 ${
                phoneNumber.length === 10
                  ? "bg-green-500 hover:bg-green-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleCall}
              disabled={phoneNumber.length !== 10}
            >
              Call
            </button>
            <button
              className={`flex-1 py-4 rounded-xl text-white font-semibold transition-colors duration-200 ${
                phoneNumber
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleDelete}
              disabled={!phoneNumber}
            >
              <span className="sr-only">Delete</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6 mx-auto"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

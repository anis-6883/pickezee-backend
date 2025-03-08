export const otpTemplate = (verificationCode: string, companyName: string, address: string) => {
  return `<!doctype html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>OTP Verify Email</title>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@100..900&display=swap');
  
        body {
          font-family: "Outfit", sans-serif;
          background-color: #f3f4f6;
          padding: 0;
          margin: 0;
        }
        table {
          width: 100%;
          border-spacing: 0;
        }
        .relative {
          position: relative;
        }
        .container {
          width: 100%;
          max-width: 860px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
        }
        .invoice {
          font-weight: bold;
          font-size: x-large;
        }
  
        .bg-gray-100 {
          background-color: #f3f4f6;
        }
  
        .bg-white {
          background-color: white; /* bg-white */
        }
  
        .shadow-lg {
          box-shadow:
            0 10px 15px rgba(0, 0, 0, 0.1),
            0 4px 6px rgba(0, 0, 0, 0.1); /* shadow-lg */
        }
  
        .mx-auto {
          margin-left: auto; /* mx-auto */
          margin-right: auto; /* mx-auto */
        }
  
        .my-8 {
          margin-top: 2rem; /* my-8 */
          margin-bottom: 2rem; /* my-8 */
        }
  
        .p-6 {
          padding: 1.5rem; /* p-6 */
        }
  
        .rounded-lg {
          border-radius: 0.5rem; /* rounded-lg */
        }
  
        .p-4 {
          padding: 1rem; /* p-4 */
        }
  
        .pl-2 {
          padding-left: 2rem;
        }
  
        .text-center {
          text-align: center; /* text-center */
        }
  
        .text-end {
          text-align: end; /* text-center */
        }
  
        .bg-blue-500 {
          background-color: #3b82f6; /* bg-blue-500 */
        }
  
        .rounded-t-lg {
          border-top-left-radius: 0.5rem; /* rounded-t-lg */
          border-top-right-radius: 0.5rem; /* rounded-t-lg */
        }
  
        .text-2xl {
          font-size: 1.5rem; /* text-2xl (24px) */
          line-height: 2rem; /* default Tailwind line height for 2xl */
        }
  
        .text-white {
          color: white; /* text-white */
        }
  
        .font-bold {
          font-weight: 700; /* font-bold */
        }
  
        .text-gray-700 {
          color: #374151; /* text-gray-700 */
        }
  
        .text-lg {
          font-size: 1.125rem; /* text-lg (18px) */
          line-height: 1.75rem; /* default Tailwind line height for lg */
        }
  
        .text-gray-600 {
          color: #4b5563; /* text-gray-600 */
        }
  
        .mt-4 {
          margin-top: 1rem; /* mt-4 (16px) */
        }
  
        .min-w-full {
          min-width: 100%; /* min-w-full */
        }
  
        .mt-6 {
          margin-top: 1.5rem; /* mt-6 (24px) */
        }
  
        .bg-gray-200 {
          background-color: #e5e7eb; /* bg-gray-200 */
        }
  
        .text-left {
          text-align: left; /* text-left */
        }
  
        .p-2 {
          padding: 0.5rem; /* p-2 (8px) */
        }
  
        .text-gray-600 {
          color: #4b5563; /* text-gray-600 */
        }
  
        .border-t {
          border-top-width: 1px; /* border-t */
          border-top-style: solid; /* border-t default style */
          border-top-color: currentColor; /* Uses current text color */
        }
  
        .bg-gray-200 {
          background-color: #e5e7eb; /* bg-gray-200 */
        }
  
        .p-2 {
          padding: 0.5rem; /* p-2 (8px) */
        }
  
        .text-gray-700 {
          color: #374151; /* text-gray-700 */
        }
  
        .font-bold {
          font-weight: 700; /* font-bold */
        }
  
        .text-right {
          text-align: right; /* text-right */
        }
  
        .bg-gray-100 {
          background-color: #f3f4f6; /* bg-gray-100 */
        }
  
        .text-center {
          text-align: center; /* text-center */
        }
  
        .p-4 {
          padding: 1rem; /* p-4 (16px) */
        }
  
        .rounded-b-lg {
          border-bottom-left-radius: 0.5rem; /* rounded-b-lg */
          border-bottom-right-radius: 0.5rem; /* rounded-b-lg */
        }
  
        .text-gray-500 {
          color: #6b7280; /* text-gray-500 */
        }
  
        .text-sm {
          font-size: 0.875rem; /* text-sm (14px) */
          line-height: 1.25rem; /* default line height for sm */
        }
  
        .bg-red-500 {
          background-color: #ef4444; /* bg-red-500 */
        }
  
        .font-semibold {
          font-weight: 600; /* font-semibold */
        }
  
        .relative {
          position: relative; /* relative */
        }
  
        .overflow-x-auto {
          overflow-x: auto; /* overflow-x-auto */
        }
  
        .w-full {
          width: 100%; /* w-full */
        }
  
        .text-sm {
          font-size: 0.875rem; /* text-sm (14px) */
          line-height: 1.25rem; /* default line height for sm */
        }
  
        .text-left {
          text-align: left; /* text-left */
        }
  
        .text-right {
          text-align: right; /* text-right */
        }
  
        .text-gray-500 {
          color: #6b7280; /* text-gray-500 */
        }
  
        .text-xs {
          font-size: 0.75rem; /* text-xs (12px) */
          line-height: 1rem; /* default line height for xs */
        }
  
        .text-gray-700 {
          color: #374151; /* text-gray-700 */
        }
  
        .uppercase {
          text-transform: uppercase; /* uppercase */
        }
  
        .bg-gray-50 {
          background-color: #f9fafb; /* bg-gray-50 */
        }
  
        .bg-white {
          background-color: white; /* bg-white */
        }
  
        .px-6 {
          padding-left: 1.5rem; /* padding-left (24px) */
          padding-right: 1.5rem; /* padding-right (24px) */
        }
  
        .py-3 {
          padding-top: 0.75rem; /* padding-top (12px) */
          padding-bottom: 0.75rem; /* padding-bottom (12px) */
        }
  
        .py-4 {
          padding-top: 1rem; /* padding-top (16px) */
          padding-bottom: 1rem; /* padding-bottom (16px) */
        }
  
        .font-medium {
          font-weight: 500; /* font-medium */
        }
  
        .text-gray-900 {
          color: #111827; /* text-gray-900 */
        }
  
        .whitespace-nowrap {
          white-space: nowrap; /* whitespace-nowrap */
        }
  
        .shadow-md {
          box-shadow:
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 1px 3px rgba(0, 0, 0, 0.1); /* shadow-md */
        }
  
        .bg-gray-800 {
          background-color: #1f2937; /* bg-gray-800 */
        }
  
        .leading-0-6 {
          line-height: 0.6; /* leading-[0.6] */
        }
  
        .mb-10 {
          margin-bottom: 2.5rem; /* mb-10 (40px) */
        }
  
        .mb-5 {
          margin-bottom: 1.25rem; /* mb-5 (20px) */
        }
  
        .whitespace-nowrap {
          white-space: nowrap;
        }
  
        tbody td {
          padding: 8px;
        }
  
        .footer-section {
          margin-top: 40px;
        }
  
        .payment-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
  
        .thank-you h1 {
          font-family: "Cursive", sans-serif;
          font-size: 48px;
          margin: 0;
        }
  
        .payment-info {
          max-width: 205px;
        }
  
        .payment-info h2 {
          font-weight: bold;
          font-size: 18px;
          margin-bottom: 5px;
        }
  
        .payment-info p {
          margin: 5px 0;
        }
  
        .company-info .company-title {
          font-weight: bold;
          font-size: 17px;
          text-align: end;
        }
  
        .company-info p {
          font-size: 16px;
          margin-top: 5px;
          text-align: end;
        }
  
        .text-base {
          font-size: 1rem;
          line-height: 1.5rem; /* Default line-height */
        }
  
        .text-xl {
          font-size: 1.25rem;
          line-height: 1.75rem; /* Default line-height */
        }
  
        .m-auto {
          margin: auto;
        }
  
        .inline-block {
          display: inline-block;
        }
  
        .border-none {
          border-style: none;
        }
  
        /* Responsive Design */
        @media (max-width: 768px) {
          .footer-section {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
  
          .thank-you,
          .payment-info,
          .company-info {
            margin-bottom: 20px;
          }
        }
        .overflow-hidden {
          overflow: hidden;
        }
      </style>
    </head>
    <body class="bg-gray-100 p-4">
      <!-- Main Container -->
      <table class="container overflow-hidden">
        <tr>
          <td style="padding-left: 10px; border: none" class="py-6">
            <!-- Invoice Table -->
            <div class="p-4">
              <table class="w-full border-collapse border-spacing-0 relative">
                <div class="mt-4"></div>
                <!-- Footer Section -->
                <tbody>
                  <tr class="w-full text-center border-none">
                    <td class="border-none text-center" colspan="3">
                      <img
                        src="https://res.cloudinary.com/dhvfqgo7q/pickezee/default/logo.png"
                        width="150"
                        alt="styleezee"
                      />
                    </td>
                  </tr>
  
                  <tr class="w-full">
                    <td class="border-none text-center" colspan="3">
                      <h1 style="font-size: 30px; font-weight: bold">Email Verification</h1>
                    </td>
                  </tr>
  
                  <tr class="w-full">
                    <td class="border-none" colspan="3">
                      <p class="text-lg text-center">Please use the following verification code to complete your process.</p>
                    </td>
                  </tr>
  
                  <tr class="w-full">
                    <td class="m-auto text-center border-none" colspan="3">
                      <p class="text-xl bg-gray-200 p-6 inline-block rounded-lg font-semibold">${verificationCode}</p>
                    </td>
                  </tr>
  
                  <tr class="w-full">
                    <td colspan="3">
                      <div>
                        <p class="font-bold mb-3">Don't share your otp with anyone!</p>
                        <p>Thank you for signing up!</p>
                        <p>Best Regards,</p>
                        <p class="font-bold mb-3">${companyName} Team</p>
                        <p>${address}</p>
                      </div>
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </td>
        </tr>
  
        <!-- Body Section -->
      </table>
    </body>
  </html>
    `;
};
